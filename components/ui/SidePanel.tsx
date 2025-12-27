'use client';

import { ReactNode } from 'react';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function SidePanel({
  isOpen,
  onClose,
  title,
  children,
}: SidePanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative ml-auto h-screen bg-white shadow-lg border-l w-full sm:w-full lg:w-1/2 max-w-full flex flex-col">

        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
          <h2 className="text-lg font-semibold truncate">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg"
          >
            ✕
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto px-4 sm:px-6 pt-6 pb-32 max-w-full break-words mb-28"
        >
          {children}
        </div>

      </div>
    </div>
  );
}
