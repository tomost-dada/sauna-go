"use client";

import { ChatMessage } from "@/lib/types";

interface ChatBubbleProps {
  message: ChatMessage;
  isMe: boolean;
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours < 12 ? "오전" : "오후";
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  const displayMinute = String(minutes).padStart(2, "0");
  return `${ampm} ${displayHour}:${displayMinute}`;
}

export default function ChatBubble({ message, isMe }: ChatBubbleProps) {
  if (message.isSystem) {
    return (
      <div className="flex justify-center">
        <div className="bg-surface-container rounded-2xl px-4 py-2 mx-auto text-body-md text-on-surface-variant text-center max-w-[280px]">
          {message.message}
        </div>
      </div>
    );
  }

  if (isMe) {
    return (
      <div className="flex flex-col items-end">
        <div className="bg-primary-container text-white rounded-2xl rounded-br-sm px-4 py-3 max-w-[75%] ml-auto">
          <p className="text-body-md">{message.message}</p>
        </div>
        <span className="text-label-sm text-on-surface-variant/50 mt-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start">
      <span className="text-label-sm text-on-surface-variant mb-1">
        {message.nickname}
      </span>
      <div className="bg-surface-container-lowest shadow-ambient-sm rounded-2xl rounded-bl-sm px-4 py-3 max-w-[75%]">
        <p className="text-body-md text-on-surface">{message.message}</p>
      </div>
      <span className="text-label-sm text-on-surface-variant/50 mt-1">
        {formatTime(message.timestamp)}
      </span>
    </div>
  );
}
