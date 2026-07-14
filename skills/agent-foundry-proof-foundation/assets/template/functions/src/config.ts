import { defineSecret } from "firebase-functions/params";

export const region = "__REGION__";
export const collectionRoot = "__COLLECTION_ROOT__";
export const openAIKey = defineSecret("__SECRET_NAME__");
