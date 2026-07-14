import { ZodError } from "zod";
import { HttpError } from "./auth.js";

type HttpResponse = {
  status(code: number): HttpResponse;
  json(body: unknown): void;
};

export function handleHttpError(response: HttpResponse, error: unknown): void {
  if (error instanceof HttpError) {
    response.status(error.status).json({ error: error.message });
    return;
  }
  if (error instanceof ZodError) {
    response.status(400).json({ error: "The request is invalid.", issues: error.issues });
    return;
  }
  console.error("Unhandled request error", error);
  response.status(500).json({ error: "The backend could not complete the request." });
}
