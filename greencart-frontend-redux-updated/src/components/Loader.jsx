import React from 'react';

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
      <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
