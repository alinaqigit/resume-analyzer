// lib/context.ts
import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

export async function getContext(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddings(query);
  
  const client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });

  const pineconeIndex = client.index("study-app-384");
  const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

  const queryResponse = await namespace.query({
    topK: 5,
    vector: queryEmbeddings,
    includeMetadata: true,
  });

  const relevantDocs = queryResponse.matches || [];
  const docs = relevantDocs.map((match) => (match.metadata as any)?.text || "");
  
  return docs.join("\n").substring(0, 3000);
}