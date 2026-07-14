import { auth } from "./firebase.js";

export async function verifiedUid(authorization: string | undefined): Promise<string> {
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  if (!match) throw new HttpError(401, "A Firebase ID token is required.");
  try {
    return (await auth.verifyIdToken(match[1])).uid;
  } catch {
    throw new HttpError(401, "The Firebase ID token is invalid or expired.");
  }
}

export class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}
