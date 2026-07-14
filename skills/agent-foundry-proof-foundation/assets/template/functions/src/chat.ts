import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { collectionRoot } from "./config.js";
import { db } from "./firebase.js";
import type {
  ChatMessageDTO,
  ChatMessageRole,
  ChatSessionDTO,
  ChatSessionStatus,
  ChatSnapshotDTO,
  SendMessageInput,
} from "./schemas.js";

function userRef(uid: string) {
  return db.collection(collectionRoot).doc(uid);
}

function sessionRef(uid: string, sessionId: string) {
  return userRef(uid).collection("sessions").doc(sessionId);
}

export async function acceptMessage(uid: string, input: SendMessageInput): Promise<void> {
  const session = sessionRef(uid, input.sessionId);
  const message = session.collection("messages").doc(input.messageId);
  const job = userRef(uid).collection("jobs").doc(input.messageId);

  await db.runTransaction(async (transaction) => {
    if ((await transaction.get(message)).exists) return;
    const now = Timestamp.now();
    transaction.set(session, {
      title: input.textMarkdown.replace(/\s+/g, " ").slice(0, 72),
      status: "generating" satisfies ChatSessionStatus,
      updatedAt: now,
    }, { merge: true });
    transaction.create(message, {
      role: "user" satisfies ChatMessageRole,
      bodyMarkdown: input.textMarkdown,
      createdAt: now,
    });
    transaction.create(job, {
      sessionId: input.sessionId,
      messageId: input.messageId,
      status: "pending",
      createdAt: now,
    });
  });
}

export async function snapshotForUser(uid: string): Promise<ChatSnapshotDTO> {
  const sessionQuery = await userRef(uid)
    .collection("sessions")
    .orderBy("updatedAt", "desc")
    .limit(30)
    .get();

  const sessions = await Promise.all(sessionQuery.docs.map(async (document) => {
    const data = document.data();
    const messageQuery = await document.ref.collection("messages").orderBy("createdAt", "asc").get();
    const messages: ChatMessageDTO[] = messageQuery.docs.map((messageDocument) => {
      const message = messageDocument.data();
      return {
        id: messageDocument.id,
        role: message.role as ChatMessageRole,
        bodyMarkdown: String(message.bodyMarkdown ?? ""),
        ...(message.responseToMessageId ? { responseToMessageId: String(message.responseToMessageId) } : {}),
        createdAt: isoString(message.createdAt),
      };
    });
    return {
      id: document.id,
      title: String(data.title ?? "Conversation"),
      status: (data.status ?? "idle") as ChatSessionStatus,
      updatedAt: isoString(data.updatedAt),
      messages,
    } satisfies ChatSessionDTO;
  }));

  return { sessions };
}

export async function transcriptForSession(uid: string, sessionId: string): Promise<string> {
  const messages = await sessionRef(uid, sessionId).collection("messages").orderBy("createdAt", "asc").get();
  return messages.docs.map((document) => {
    const data = document.data();
    return `${data.role === "assistant" ? "Assistant" : "User"}: ${String(data.bodyMarkdown ?? "")}`;
  }).join("\n\n");
}

export async function completeJob(
  uid: string,
  jobId: string,
  sessionId: string,
  messageId: string,
  bodyMarkdown: string,
): Promise<void> {
  const session = sessionRef(uid, sessionId);
  const job = userRef(uid).collection("jobs").doc(jobId);
  const assistantMessage = session.collection("messages").doc(`assistant-${messageId}`);
  await db.runTransaction(async (transaction) => {
    if ((await transaction.get(job)).data()?.status === "completed") return;
    const now = Timestamp.now();
    transaction.set(assistantMessage, {
      role: "assistant" satisfies ChatMessageRole,
      bodyMarkdown,
      responseToMessageId: messageId,
      createdAt: now,
    });
    transaction.update(session, { status: "completed", updatedAt: now });
    transaction.set(job, { status: "completed", completedAt: now }, { merge: true });
  });
}

export async function failJob(uid: string, jobId: string, sessionId: string): Promise<void> {
  const now = Timestamp.now();
  await Promise.all([
    sessionRef(uid, sessionId).set({ status: "failed", updatedAt: now }, { merge: true }),
    userRef(uid).collection("jobs").doc(jobId).set({
      status: "failed",
      failedAt: now,
      failureCode: "agent_run_failed",
    }, { merge: true }),
  ]);
}

export async function markJobRunning(uid: string, jobId: string): Promise<boolean> {
  const job = userRef(uid).collection("jobs").doc(jobId);
  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(job);
    const status = snapshot.data()?.status;
    if (!snapshot.exists || status === "completed" || status === "running") return false;
    transaction.update(job, { status: "running", startedAt: FieldValue.serverTimestamp() });
    return true;
  });
}

function isoString(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === "string") return value;
  return new Date(0).toISOString();
}
