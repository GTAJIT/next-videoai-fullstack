import Video from "@/models/Video";
import VideoFeed from "../components/VideoFeed";
import { connectToDatabase } from "@/lib/db"; // if you have a db util
import { IVideo } from "@/models/Video"; // Adjust the import path as necessary

export default async function VideoPage() {
  await connectToDatabase();
  const rawVideos = await Video.find({}).sort({ createdAt: -1 }).lean();

  function extractImageKitPath(fullUrl: string): string {
    try {
      const url = new URL(fullUrl);
      return url.pathname.startsWith("/") ? url.pathname.slice(10) : url.pathname;
    } catch {
      return fullUrl; // fallback in case it's already a path
    }
  }
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const videos: IVideo[] = rawVideos.map((video: any) => ({
    _id: video._id.toString(),
    userId: video.userId?.toString() ?? "",
    title: video.title,
    description: video.description,
    videoUrl: extractImageKitPath(video.videoUrl),
    thumbnailUrl: video.thumbnailUrl,
    controls: video.controls ?? true,
    transformation: {
      height: video.transformation?.height ?? 1920,
      width: video.transformation?.width ?? 1080,
      quality: video.transformation?.quality ?? 100,
    },
    createdAt: new Date(video.createdAt),
    updatedAt: new Date(video.updatedAt),
    __v: video.__v,
  }));

  console.log(videos.map(video => video.videoUrl), "Processed video URLs");

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
        {/* <img src={url} alt="img" ></img> */}
      </main>
    </>
  );
}
