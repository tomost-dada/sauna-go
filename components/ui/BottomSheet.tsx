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
        className="fixed inset-0 bg-on-surface/20 z-40 animate-fade-in"
        style={{ backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)" }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto z-50 rounded-t-3xl overflow-hidden animate-slide-up"
        style={{
          maxHeight: "55vh",
          background: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 -8px 40px rgba(44, 47, 48, 0.10)",
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-surface-container-high" />
        </div>

        {/* Title */}
        <div className="text-headline-md text-on-surface px-6 pt-3 pb-4">{title}</div>

        {/* Content */}
        <div className="px-6 pb-8 overflow-y-auto" style={{ maxHeight: "calc(55vh - 90px)" }}>
          {children}
        </div>
      </div>
    </>
  );
}
