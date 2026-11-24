import { notFound } from "next/navigation";
import { INITIAL_VIDEOS } from "@/lib/mock-data";
import { VideoDetailClient } from "./VideoDetailClient";

export function generateStaticParams() {
  return INITIAL_VIDEOS.map((v) => ({
    slug: v.slug,
  }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function VideoPage({ params }: Props) {
  const { slug } = await params;
  const video = INITIAL_VIDEOS.find((v) => v.slug === slug);

  if (!video) {
    notFound();
  }

  // Related videos
  const relatedVideos = INITIAL_VIDEOS.filter(
    (v) => v.id !== video.id && v.category_id === video.category_id
  );

  return <VideoDetailClient video={video} relatedVideos={relatedVideos} />;
}
