"use client";
import { useState } from "react";
import axios from "axios";
import FileSaver from "file-saver";
import JSZip from "jszip";
import Image from "next/image";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const profileUsername = url.split("/").filter(Boolean).pop();
      const response = await axios.get(`/api/instagram?username=${profileUsername}`);
      const mediaItems = response.data.graphql.user.edge_owner_to_timeline_media.edges;

      const zip = new JSZip();
      for (const item of mediaItems) {
        const mediaUrl = item.node.display_url;
        const mediaResponse = await axios.get(mediaUrl, { responseType: 'blob' });
        const blob = mediaResponse.data;
        zip.file(`${item.node.id}.jpg`, blob);
      }

      const content = await zip.generateAsync({ type: "blob" });
      FileSaver.saveAs(content, "instagram-profile.zip");
    } catch (error) {
      console.error("Download failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* download box */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold">Download Instagram Profile</h2>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter Instagram Profile URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          className="w-full p-2 bg-blue-500 text-white rounded-md"
          onClick={handleDownload}
          disabled={loading}
        >
          {loading ? "Downloading..." : "Download"}
        </button>
      </div>
    </main>
  );
}
