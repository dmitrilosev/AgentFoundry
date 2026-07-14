import { randomUUID } from "node:crypto";
import { Timestamp } from "firebase-admin/firestore";
import type { DocumentData } from "firebase-admin/firestore";
import { collectionRoot } from "../config.js";
import { db } from "../firebase.js";
import type {
  Archive__DOMAIN_SWIFT__Input,
  Create__DOMAIN_SWIFT__Input,
  Update__DOMAIN_SWIFT__Input,
} from "./__DOMAIN_NAME__-contract.js";

function records(uid: string) {
  return db.collection(collectionRoot).doc(uid).collection("__DOMAIN_COLLECTION__");
}

export async function list__DOMAIN_SWIFT__Records(uid: string): Promise<unknown[]> {
  const snapshot = await records(uid).where("status", "!=", "archived").limit(100).get();
  return snapshot.docs.map((document) => dto(document.id, document.data()));
}

export async function create__DOMAIN_SWIFT__Record(uid: string, input: Create__DOMAIN_SWIFT__Input): Promise<unknown> {
  const mutation = db.collection(collectionRoot).doc(uid).collection("mutations").doc(input.mutationId);
  const record = records(uid).doc(input.recordId ?? randomUUID());
  await db.runTransaction(async (transaction) => {
    const prior = await transaction.get(mutation);
    if (prior.exists) return;
    const now = Timestamp.now();
    transaction.create(record, {
      title: input.title,
      ...(input.note ? { note: input.note } : {}),
      status: "active",
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: uid,
      updatedBy: uid,
    });
    transaction.create(mutation, { recordId: record.id, operation: "create", createdAt: now });
  });
  const snapshot = await record.get();
  return dto(snapshot.id, snapshot.data() ?? {});
}

export async function update__DOMAIN_SWIFT__Record(uid: string, input: Update__DOMAIN_SWIFT__Input): Promise<unknown> {
  const record = records(uid).doc(input.recordId);
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(record);
    if (!snapshot.exists) throw new Error("__DOMAIN_SWIFT__ record not found.");
    const current = snapshot.data() ?? {};
    if (current.version !== input.expectedVersion) throw new Error("Version conflict. Reload before updating.");
    transaction.update(record, {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.note !== undefined ? { note: input.note } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      version: input.expectedVersion + 1,
      updatedAt: Timestamp.now(),
      updatedBy: uid,
    });
  });
  const snapshot = await record.get();
  return dto(snapshot.id, snapshot.data() ?? {});
}

export async function archive__DOMAIN_SWIFT__Record(uid: string, input: Archive__DOMAIN_SWIFT__Input): Promise<unknown> {
  const record = records(uid).doc(input.recordId);
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(record);
    if (!snapshot.exists) throw new Error("__DOMAIN_SWIFT__ record not found.");
    if (snapshot.data()?.version !== input.expectedVersion) throw new Error("Version conflict. Reload before archiving.");
    transaction.update(record, {
      status: "archived",
      version: input.expectedVersion + 1,
      updatedAt: Timestamp.now(),
      updatedBy: uid,
    });
  });
  const snapshot = await record.get();
  return dto(snapshot.id, snapshot.data() ?? {});
}

function dto(id: string, data: DocumentData): unknown {
  const iso = (value: unknown) => value instanceof Timestamp ? value.toDate().toISOString() : String(value ?? "");
  return {
    id,
    title: String(data.title ?? ""),
    ...(data.note ? { note: String(data.note) } : {}),
    status: String(data.status ?? "active"),
    version: Number(data.version ?? 1),
    createdAt: iso(data.createdAt),
    updatedAt: iso(data.updatedAt),
  };
}
