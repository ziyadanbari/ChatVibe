import { base64ToBlobUrl } from "@/lib/base64ToBlobUrl.js";
import { useEffect, useState } from "react";

export default function ImageMessage({ src }) {
  const [blobUrl, setBlobUrl] = useState("");
  const [showAllImage, setShowAllImage] = useState(false);
  useEffect(() => {
    const blobUrl = base64ToBlobUrl(src, "image/jpg");
    setBlobUrl(blobUrl);
  }, [src]);
  return (
    <div>
      <div onClick={() => setShowAllImage(true)}>
        <img
          src={blobUrl}
          className=" aspect-square object-cover rounded cursor-zoom-in"
        />
      </div>
      {showAllImage ? (
        <div
          className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 bg-main-black/20 backdrop-blur h-screen w-screen z-50"
          onClick={() => setShowAllImage(false)}>
          <img
            src={blobUrl}
            className="object-ph-full w-full rounded cursor-zoom-out"
          />
        </div>
      ) : null}
    </div>
  );
}
