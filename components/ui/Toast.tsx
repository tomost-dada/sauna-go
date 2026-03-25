"use client";

interface ToastProps {
  message: string;
  isVisible: boolean;
}

export default function Toast({ message, isVisible }: ToastProps) {
  return (
    <div
      className={`fixed bottom-28 left-1/2 -translate-x-1/2 z-50 max-w-[350px] transition-all duration-300 ${
        isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-surface-container-lowest rounded-2xl px-6 py-3 text-body-md text-on-surface"
        style={{ boxShadow: "0 20px 40px rgba(44,47,48,0.06)" }}
      >
        {message}
      </div>
    </div>
  );
}
