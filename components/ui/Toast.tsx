"use client";

interface ToastProps {
  message: string;
  isVisible: boolean;
}

export default function Toast({ message, isVisible }: ToastProps) {
  return (
    <div
      className={`fixed bottom-28 left-1/2 -translate-x-1/2 z-50 transition-all duration-400 ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      <div
        className="rounded-2xl px-6 py-3 text-body-md text-on-surface whitespace-nowrap"
        style={{
          background: "rgba(255, 255, 255, 0.90)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(44, 47, 48, 0.12), 0 0 0 1px rgba(44,47,48,0.04)",
        }}
      >
        {message}
      </div>
    </div>
  );
}
