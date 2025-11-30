import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import connectDB from "@/app/mongoose/index";
import { Profile, UserModel } from "@/app/mongoose/models";
import { parseResumeText } from "@/lib/resume-parser";

export async function POST(req: NextRequest) {
  try {
    console.log("Received request, now proceeding next");
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Extracting data from your request");
    const formData = await req.formData();

    console.log("Extracting file from your extracted data");
    const file = formData.get("resume") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "resumes");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${userId}_${Date.now()}_${file.name.replace(
      /[^a-zA-Z0-9.-]/g,
      "_"
    )}`;
    const filePath = path.join(uploadsDir, fileName);

    await writeFile(filePath, buffer);

    // Parse PDF using pdf2json
    let extractedText = "";
    let parsedData;

    try {
      const PDFParser = (await import("pdf2json")).default;
      const pdfParser = new PDFParser();

      // Helper function to safely decode URI
      const safeDecodeURIComponent = (str: string): string => {
        try {
          return decodeURIComponent(str);
        } catch (e) {
          // If decoding fails, return the original string
          return str;
        }
      };

      // Parse PDF as promise
      const parsePDF = (): Promise<string> => {
        return new Promise((resolve, reject) => {
          pdfParser.on("pdfParser_dataError", (errData: any) => {
            reject(new Error(errData.parserError));
          });

          pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
            try {
              let text = "";
              // Extract text from all pages with safe decoding
              if (pdfData.Pages && Array.isArray(pdfData.Pages)) {
                pdfData.Pages.forEach((page: any) => {
                  if (page.Texts && Array.isArray(page.Texts)) {
                    page.Texts.forEach((textItem: any) => {
                      if (textItem.R && Array.isArray(textItem.R)) {
                        textItem.R.forEach((run: any) => {
                          if (run.T) {
                            text += safeDecodeURIComponent(run.T) + " ";
                          }
                        });
                      }
                    });
                  }
                  text += "\n";
                });
              }
              resolve(text);
            } catch (err) {
              reject(err);
            }
          });

          pdfParser.parseBuffer(buffer);
        });
      };

      extractedText = await parsePDF();

      if (!extractedText || extractedText.trim().length < 50) {
        throw new Error("PDF appears to be empty or corrupted");
      }

      parsedData = parseResumeText(extractedText);
    } catch (pdfError: any) {
      console.error("PDF parsing error:", pdfError);

      return NextResponse.json(
        {
          error: "Could not parse PDF content.",
          details: pdfError.message,
        },
        { status: 400 }
      );
    }

    if (!parsedData.skills.length && !parsedData.experience.length) {
      return NextResponse.json(
        {
          error: "Could not extract meaningful information from the resume",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const profile = await Profile.findOneAndUpdate(
      { userId },
      {
        userId,
        resumePath: `/uploads/resumes/${fileName}`,
        skills: parsedData.skills.map((skill) => ({
          name: skill,
          category: "Technical",
        })),
        experience: parsedData.experience,
        education: parsedData.education,
        projects: parsedData.projects,
        updatedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
      }
    );

    await UserModel.findOneAndUpdate(
      { clerkId: userId },
      {
        clerkId: userId,
        isProfileCompleted: true,
        updatedAt: new Date(),
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Resume uploaded and parsed successfully",
      data: {
        skills: parsedData.skills,
        experienceCount: parsedData.experience.length,
        educationCount: parsedData.education.length,
        projectsCount: parsedData.projects.length,
      },
      profileId: profile._id,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Failed to upload and parse resume",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
