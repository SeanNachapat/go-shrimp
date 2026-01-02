import React from 'react';
import shrimpImage from "../images/shrimp.png";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-white dark:bg-neutral-900">
      <div className="relative">
        <img 
          src={shrimpImage.src}
          alt="Loading..." 
          className="w-24 h-24 animate-spin"
        />
      </div>
      <p className="mt-4 text-orange-600 font-medium animate-pulse dark:text-orange-500">Loading...</p>
    </div>
  );
}
