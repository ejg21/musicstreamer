"use client";

import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      {/* Fullscreen Blurred Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/OctaveBanner.png" // Replace with your banner image
          alt="Background Overlay"
          fill
          priority
          className="object-cover blur-md opacity-50 hidden md:block" // Blurred and only visible on desktop
        />
      </div>

      <div className="relative flex flex-col items-center space-y-8 z-10">
        {/* Loading Circle */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-white rounded-full animate-spin-slow" />
        </div>

        <div className="text-gray-400">
          Credit to Octave
        </div>
      </div>
    </div>
  );
}
