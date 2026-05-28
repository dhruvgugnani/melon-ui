import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const component = searchParams.get("component");

  try {
    const registryPath = path.join(process.cwd(), "../../registry/registry.json");
    const fileContents = fs.readFileSync(registryPath, "utf8");
    const registry = JSON.parse(fileContents);

    if (component) {
      if (registry[component]) {
        return NextResponse.json(registry[component]);
      } else {
        return NextResponse.json({ error: "Component not found" }, { status: 404 });
      }
    }

    return NextResponse.json(registry);
  } catch {
    return NextResponse.json({ error: "Failed to load registry" }, { status: 500 });
  }
}
