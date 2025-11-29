import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import md5 from "md5";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import { getEmbeddings } from "./embeddings";
import { convertToAscii } from "./utils";

// Initialize Pinecone client
export const getPineconeClient = () => {
  return new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
    fetchApi: fetch,
  });
};

// Optional type for PDF pages (LangChain returns Document[])
type PDFPage = Document & {
  metadata: {
    pageNumber?: number;
    [key: string]: any;
  };
};

// Truncate string to a specific byte length
export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

// Prepare individual PDF page into smaller chunks
async function prepareDocument(page: PDFPage) {
  let pageContent = page.pageContent.replace(/\n/g, "");
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: page.metadata.pageNumber ?? 0,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return docs;
}

// Embed a document into a Pinecone vector
async function embedDocument(doc: Document): Promise<PineconeRecord> {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);
    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.error("Error embedding document:", error);
    throw error;
  }
}

// Main function: download PDF from S3, split, embed, and upload to Pinecone
export async function loadS3IntoPinecone(fileKey: string) {
  // 1️⃣ Download PDF from S3
  console.log("Downloading PDF from S3...");
  const file_name = await downloadFromS3(fileKey);
  if (!file_name) throw new Error("Could not download PDF from S3");

  console.log("Loading PDF into memory:", file_name);
  const loader = new PDFLoader(file_name);
  const pages: PDFPage[] = (await loader.load()) as PDFPage[];

  // 2️⃣ Split and segment PDF pages
  const documents = await Promise.all(pages.map(prepareDocument));

  // Flatten all chunks and embed them
  const vectors = await Promise.all(documents.flat().map(embedDocument));

  // 3️⃣ Upload vectors to Pinecone
  const client = getPineconeClient();
  const pineconeIndex = client.index("study-app-384");

  console.log("Inserting vectors into Pinecone...");
  await pineconeIndex.namespace(convertToAscii(fileKey)).upsert(vectors);

  console.log("Upload complete!");
  return documents.flat();
}