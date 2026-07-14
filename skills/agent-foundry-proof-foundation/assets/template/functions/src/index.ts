import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onRequest } from "firebase-functions/v2/https";
import { runProductAgent } from "./agent.js";
import { verifiedUid } from "./auth.js";
import {
  acceptMessage,
  completeJob,
  failJob,
  markJobRunning,
  snapshotForUser,
  transcriptForSession,
} from "./chat.js";
import { collectionRoot, openAIKey, region } from "./config.js";
import { handleHttpError } from "./http.js";
import { sendMessageSchema } from "./schemas.js";

export const loadChat = onRequest({ region }, async (request, response) => {
  try {
    if (request.method !== "GET") {
      response.status(405).json({ error: "Method not allowed." });
      return;
    }
    const uid = await verifiedUid(request.header("authorization"));
    response.status(200).json({ snapshot: await snapshotForUser(uid) });
  } catch (error) {
    handleHttpError(response, error);
  }
});

export const sendMessage = onRequest({ region }, async (request, response) => {
  try {
    if (request.method !== "POST") {
      response.status(405).json({ error: "Method not allowed." });
      return;
    }
    const uid = await verifiedUid(request.header("authorization"));
    const input = sendMessageSchema.parse(request.body);
    await acceptMessage(uid, input);
    response.status(202).json({ snapshot: await snapshotForUser(uid) });
  } catch (error) {
    handleHttpError(response, error);
  }
});

export const processChatJob = onDocumentCreated(
  {
    document: `${collectionRoot}/{uid}/jobs/{jobId}`,
    region,
    secrets: [openAIKey],
    retry: true,
  },
  async (event) => {
    const data = event.data?.data();
    if (!data) return;
    const uid = event.params.uid;
    const jobId = event.params.jobId;
    const sessionId = String(data.sessionId);
    const messageId = String(data.messageId);
    if (!await markJobRunning(uid, jobId)) return;

    try {
      process.env.OPENAI_API_KEY = openAIKey.value();
      const transcript = await transcriptForSession(uid, sessionId);
      const replyMarkdown = await runProductAgent(transcript);
      await completeJob(uid, jobId, sessionId, messageId, replyMarkdown);
    } catch (error) {
      console.error("Agent job failed", { uid, jobId, sessionId, error });
      await failJob(uid, jobId, sessionId);
      throw error;
    }
  },
);
