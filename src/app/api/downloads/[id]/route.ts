import { NextResponse } from "next/server";
import { INITIAL_VIDEOS } from "@/lib/mock-data";
import { getSecureDownloadUrl } from "@/lib/r2";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: Props) {
  try {
    const { id } = await params;
    const video = INITIAL_VIDEOS.find((v) => v.id === id);

    if (!video) {
      return NextResponse.json({ message: "Video asset not found" }, { status: 404 });
    }

    // In production with authenticated users:
    // verify user license exists in `user_licenses` for (user_id, video.id)

    // Generate short-lived presigned URL from Cloudflare R2
    const downloadUrl = await getSecureDownloadUrl(
      video.r2_master_key,
      `${video.slug}-4k-master.mov`
    );

    // Redirect user to the secure signed stream/download URL
    return NextResponse.redirect(downloadUrl);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Failed to generate download link" },
      { status: 500 }
    );
  }
}
