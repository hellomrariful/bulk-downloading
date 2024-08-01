"use client";
import { useState } from "react";
import axios from "axios";
import FileSaver from "file-saver";
import Image from "next/image";
import { IgApiClient } from 'instagram-web-api';

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleDownload = async () => {
    setLoading(true);
    try {
      const ig = new IgApiClient();
      ig.state.generateDevice(username);
      await ig.account.login(username, password);

      const profileUsername = url.split("/").filter(Boolean).pop();
      const user = await ig.user.searchExact(profileUsername);
      const userId = user.pk;
      const userFeed = ig.feed.user(userId);
      const mediaItems = await userFeed.items();

      // Creating a zip file with media items
      const zip = new JSZip();
      for (const item of mediaItems) {
        const mediaUrl = item.image_versions2.candidates[0].url;
        const response = await axios.get(mediaUrl, { responseType: 'blob' });
        const blob = response.data;
        zip.file(`${item.id}.jpg`, blob);
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
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Instagram Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Instagram Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
