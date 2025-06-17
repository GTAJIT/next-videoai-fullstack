import Video from "@/models/Video";
import VideoFeed from "../components/VideoFeed";
import { connectToDatabase } from "@/lib/db"; // if you have a db util
import { IVideo } from "@/models/Video"; // Adjust the import path as necessary

export default async function VideoPage() {
  await connectToDatabase();
  const rawVideos = await Video.find({}).sort({ createdAt: -1 }).lean();

  const videos: IVideo[] = rawVideos.map((video: any) => ({
    _id: video._id.toString(),
    userId: video.userId?.toString() ?? "", // <-- ✅ add this
    title: video.title,
    description: video.description,
    videoUrl: video.videoUrl,
    thumbnailUrl: video.thumbnailUrl,
    controls: video.controls ?? true,
    transformation: {
      height: video.transformation?.height ?? 1920,
      width: video.transformation?.width ?? 1080,
      quality: video.transformation?.quality ?? 100,
    },
    createdAt: new Date(video.createdAt).toISOString(),
    updatedAt: new Date(video.updatedAt).toISOString(),
    __v: video.__v,
  }));

  if (!videos || videos.length === 0) {
    return <p className="text-center">No videos available</p>;
  }
  if (videos.length > 100) {
    return <p className="text-center">Too many videos to display</p>;
  }

  return (
    <>
      <main className="p-4">
        <VideoFeed videos={videos || []} />
      </main>
    </>
  );
}
