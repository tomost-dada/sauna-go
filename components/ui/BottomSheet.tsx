"use client";

import React from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-on-surface/30 z-40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto z-50 bg-surface-container-lowest rounded-t-2xl overflow-y-auto"
        style={{ maxHeight: "50vh" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center">
          <div className="w-10 h-1 rounded-full bg-surface-container-high my-3" />
        </div>

        {/* Title */}
        <div className="text-headline-md px-6 pb-4">{title}</div>

        {/* Content */}
        <div className="px-6 pb-6">{children}</div>
      </div>
    </>
  );
}
