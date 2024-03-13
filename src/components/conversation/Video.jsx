import { base64ToBlobUrl } from "@/lib/base64ToBlobUrl.js";
import { useEffect, useState } from "react";

export default function VideoMessage({ src }) {
  const [blobUrl, setBlobUrl] = useState("");
  const [fullScreen, setFullScreen] = useState(false);
  useEffect(() => {
    const blobUrl = base64ToBlobUrl(src, "video/mp4");
    setBlobUrl(blobUrl);
  }, [src]);
  return (
    <div>
      <div onClick={() => setFullScreen(true)}>
        <video
          src={blobUrl}
          className=" aspect-video object-cover rounded "
          controls
        />
      </div>
    </div>
  );
}
