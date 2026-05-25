import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get("path");

  if (!filePath) {
    return NextResponse.json({ error: "File path is required" }, { status: 400 });
  }

  try {
    const registryBasePath = path.join(process.cwd(), "../../registry");
    const absolutePath = path.join(registryBasePath, filePath);

    // Security check to ensure we're not reading files outside the registry
    if (!absolutePath.startsWith(registryBasePath + path.sep)) {
      return NextResponse.json({ error: "Invalid path" }, { status: 403 });
    }

    const fileContents = fs.readFileSync(absolutePath, "utf8");

    return new NextResponse(fileContents, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
