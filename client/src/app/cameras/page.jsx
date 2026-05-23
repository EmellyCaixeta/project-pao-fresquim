"use client";
import Image from "next/image";

export default function CameraPage() {
  return (
    <div className="player-wrapper w-200 max-w-3xl mx-auto aspect-video flex items-center justify-center bg-gray-100 rounded-lg shadow-md p-4">
      <Image
        src="/cmrseg1.jpg"
        alt="Padaria System Logo"
        className="w-300 h- mb-2 flex "
        width={300}
        height={1600}
      />
    </div>
  );
}
