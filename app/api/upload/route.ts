import { del, put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const PUT = async (request: Request) => {
  const form = await request.formData();
  const file = form.get("file") as File;

  try {
    if (file.size === 0 || file.size === undefined) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be less than 5MB" },
        { status: 400 },
      );
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 },
      );
    }

    const blob = await put(file.name, file, {
      access: "public",
      multipart: true,
    });
    return NextResponse.json(blob);
  } catch (error) {
    console.log(error);
  }
};

export const DELETE = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("imageUrl") as string;
  if (!imageUrl) {
    return NextResponse.json(
      { error: "Image url is required" },
      { status: 400 },
    );
  }
  await del(imageUrl);
  return NextResponse.json({ status: 200 });
};
