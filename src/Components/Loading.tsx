import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-white">
      <div className="relative">
        <img 
          src="../images/shrimp.png" 
          alt="Loading..." 
          className="w-24 h-24 animate-spin"
        />
      </div>
      <p className="mt-4 text-gray-500 font-medium animate-pulse">Loading...</p>
    </div>
  );
}
