"use client";

import React, { useRef, useState } from "react";

type Asset = {
  id: string;
  name: string;
  url?: string;
  type: "image" | "video" | "audio" | "text";
};

export default function Upload({
  onClose,
  className,
}: {
  onClose: () => void;
  className?: string;
}) {
  const [activeTab, setActiveTab] = useState<"Images" | "Videos" | "Audio" | "Text">("Images");
  const [assets, setAssets] = useState<Asset[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>, isFolder = false) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: Asset[] = Array.from(files).map((file) => {
      const mime = file.type;
      let type: Asset["type"] = "text";

      if (mime.startsWith("image")) type = "image";
      if (mime.startsWith("video")) type = "video";
      if (mime.startsWith("audio")) type = "audio";

      return {
        id: `${file.name}-${file.size}-${Date.now()}`,
        name: file.name,
        url: URL.createObjectURL(file),
        type,
      };
    });

    setAssets((prev) => [...newFiles, ...prev]);
    e.target.value = "";
  };

  const filteredAssets = assets.filter((a) => {
    if (activeTab === "Images") return a.type === "image";
    if (activeTab === "Videos") return a.type === "video";
    if (activeTab === "Audio") return a.type === "audio";
    if (activeTab === "Text") return a.type === "text";
    return false;
  });

  return (
    <div className={`fixed top-0 right-0 h-full w-[25vw] bg-white shadow-2xl z-9999 flex ${className}`}>
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-md font-bold hover:bg-red-700"
      >
        ✕
      </button>

      {/* Sidebar */}
      <aside className="w-full p-5 flex flex-col gap-4 bg-white/95 border-l border-slate-200 shadow-sm">

        {/* Upload Buttons */}
        <div className="flex gap-3 my-12">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 px-4 py-3 bg-indigo-500 text-white rounded-xl font-extrabold shadow-md hover:shadow-lg transition"
          >
            Upload files
          </button>

          <button
            onClick={() => folderInputRef.current?.click()}
            className="px-4 py-3 bg-slate-200 rounded-xl font-bold shadow hover:bg-slate-300 transition"
          >
            Folder
          </button>
        </div>

        {/* Hidden Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="*/*"
          onChange={(e) => handleFiles(e, false)}
          className="hidden"
        />

        <input
          ref={folderInputRef}
          type="file"
          multiple
          //@ts-ignore
          webkitdirectory="true"
          directory=""
          onChange={(e) => handleFiles(e, true)}
          className="hidden"
        />

        {/* Tabs */}
        <div className="flex gap-3 mt-1">
          {(["Images", "Videos", "Audio", "Text"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-2 font-bold rounded-md transition ${
                activeTab === t ? "border-b-4 border-indigo-400 text-slate-900" : "text-slate-500"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Asset Display */}
        <div className="flex-1 overflow-y-auto pr-1">
          {filteredAssets.length === 0 ? (
            <p className="text-center text-slate-400 font-bold pt-10">
              No {activeTab.toLowerCase()} found
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 pt-3">
              {filteredAssets.map((a) => (
                <div
                  key={a.id}
                  className="flex gap-3 p-3 border border-slate-200 rounded-xl bg-white shadow-sm"
                >
                  {a.type === "image" && <img src={a.url} className="w-28 h-20 object-cover rounded-md border" />}
                  {a.type === "video" && <video src={a.url} className="w-28 h-20 rounded-md border" controls />}
                  {a.type === "audio" && <audio src={a.url} controls className="w-full" />}
                  {a.type === "text" && (
                    <div className="w-12 h-12 rounded-md bg-orange-300 flex items-center justify-center text-xl">
                      📄
                    </div>
                  )}

                  <p className="font-bold text-sm">{a.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
