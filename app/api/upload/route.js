import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";

const uploadDir = path.join(process.cwd(), "public", "uploads");

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// POST: Handle file upload
export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("image");

  if (!file) {
    return NextResponse.json(
      { error: "No image file provided" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);

  fs.writeFileSync(filePath, buffer);

  return NextResponse.json({ imagePath: `/uploads/${fileName}` });
}

// DELETE: Handle file deletion
export async function DELETE(req) {
  const body = await req.json();
  const imagePath = body.imagePath; // expected format: '/uploads/filename.jpg'

  if (!imagePath) {
    return NextResponse.json(
      { error: "No image path provided" },
      { status: 400 }
    );
  }

  // Ensure only files inside /public/uploads can be deleted
  const fullPath = path.join(process.cwd(), "public", imagePath.replace(/^\/+/, ""));

  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
