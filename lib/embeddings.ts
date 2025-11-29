import { InferenceClient } from "@huggingface/inference";

const hf = new InferenceClient(process.env.HF_API_KEY!);

export async function getEmbeddings(text: string) {
  try {
    const embedding = await hf.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: text.replace(/\n/g, " "),
    });

    return embedding as number[];
  } catch (error) {
    console.error("error calling huggingface embeddings api", error);
    throw error;
  }
}
