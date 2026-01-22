import { NextResponse } from "next/server";

// POST upload image to ImgBB
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "ImgBB API key not configured" }, { status: 500 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    // Upload to ImgBB
    const imgbbFormData = new FormData();
    imgbbFormData.append("key", apiKey);
    imgbbFormData.append("image", base64);
    imgbbFormData.append("name", file.name.replace(/[^a-zA-Z0-9.]/g, "_"));

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: imgbbFormData,
    });

    const result = await response.json();

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        url: result.data.url,
        deleteUrl: result.data.delete_url,
        thumb: result.data.thumb?.url,
      });
    } else {
      console.error("ImgBB upload failed:", result);
      return NextResponse.json({ 
        success: false, 
        error: result.error?.message || "Upload failed" 
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
