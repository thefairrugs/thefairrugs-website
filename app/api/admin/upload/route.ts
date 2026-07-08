import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

function getAdminToken(): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require("fs");
    const raw = fs.readFileSync(path.join(process.cwd(), "data", "admin.json"), "utf-8");
    return JSON.parse(raw).token || "fairrugs2026admin";
  } catch {
    return "fairrugs2026admin";
  }
}

function verifyAdmin(request: Request): boolean {
  const key = request.headers.get("x-admin-key") || "";
  return key === getAdminToken();
}

// Allowed MIME types
const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/avif"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo"];

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();

    // Get product id/slug for subdirectory (optional)
    const productId = (formData.get("productId") as string) || "new";
    const slug = sanitizeFilename(productId);

    // Ensure upload dir exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", "products", slug);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const urls: string[] = [];
    let videoUrl = "";

    // Process all entries
    for (const [key, value] of formData.entries()) {
      if (!(value instanceof Blob)) continue;

      const file = value as File;
      if (!file.size) continue;

      const mime = file.type;
      const isImage = IMAGE_TYPES.includes(mime);
      const isVideo = VIDEO_TYPES.includes(mime);

      if (!isImage && !isVideo) continue;

      // Limit: 10 images, 1 video
      if (isImage && urls.length >= 10) continue;
      if (isVideo && videoUrl) continue;

      // Build unique filename
      const ext = (file.name.split(".").pop() || (isImage ? "jpg" : "mp4")).toLowerCase();
      const baseName = sanitizeFilename(file.name.replace(/\.[^.]+$/, "")) || (isImage ? `image-${urls.length + 1}` : "video");
      const timestamp = Date.now();
      const filename = `${baseName}-${timestamp}.${ext}`;
      const filePath = path.join(uploadDir, filename);

      // Write file
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);

      const publicUrl = `/uploads/products/${slug}/${filename}`;

      if (isImage) {
        urls.push(publicUrl);
      } else if (isVideo) {
        videoUrl = publicUrl;
      }
    }

    return NextResponse.json({ urls, videoUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed", detail: String(err) }, { status: 500 });
  }
}

// Disable Next.js body parsing — formData() handles it natively
export const config = {
  api: {
    bodyParser: false,
  },
};
