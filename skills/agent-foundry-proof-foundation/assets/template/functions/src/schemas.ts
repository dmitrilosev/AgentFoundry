import { z } from "zod";

export const sendMessageSchema = z.object({
  sessionId: z.string().min(3).max(160),
  messageId: z.string().min(3).max(160),
  textMarkdown: z.string().trim().min(1).max(6000),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type ChatSessionStatus = "idle" | "generating" | "completed" | "failed";
export type ChatMessageRole = "user" | "assistant";

export type ChatMessageDTO = {
  id: string;
  role: ChatMessageRole;
  bodyMarkdown: string;
  responseToMessageId?: string;
  createdAt: string;
};

export type ChatSessionDTO = {
  id: string;
  title: string;
  status: ChatSessionStatus;
  updatedAt: string;
  messages: ChatMessageDTO[];
};

export type ChatSnapshotDTO = { sessions: ChatSessionDTO[] };
