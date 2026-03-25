"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { communityPosts, chatMessages, currentUser } from "@/lib/mock-data";
import { ChatMessage } from "@/lib/types";
import ChatBubble from "@/components/community/ChatBubble";
import MeetupStatus from "@/components/community/MeetupStatus";

function formatMeetDate(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours < 12 ? "오전" : "오후";
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  const displayMinute = String(minutes).padStart(2, "0");
  return `${month}월 ${day}일 ${ampm} ${displayHour}:${displayMinute}`;
}

function getInitials(nickname: string): string {
  return nickname.charAt(0);
}

export default function CommunityChatPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const post = communityPosts.find((p) => p.id === id);
  const initialMessages = chatMessages.filter((m) => m.postId === id);

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!post) {
    return (
      <div className="flex items-center justify-center h-screen text-on-surface-variant">
        모임을 찾을 수 없습니다.
      </div>
    );
  }

  function handleSend() {
    const trimmed = newMessage.trim();
    if (!trimmed) return;
    const msg: ChatMessage = {
      id: `msg-local-${Date.now()}`,
      postId: post!.id,
      userId: currentUser.id,
      nickname: currentUser.nickname,
      message: trimmed,
      timestamp: new Date().toISOString(),
      isSystem: false,
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Build participant list: host first, then unique participants from messages
  const participantIds = new Set<string>();
  participantIds.add(post.hostId);
  messages.forEach((m) => {
    if (!m.isSystem) participantIds.add(m.userId);
  });
  const participantNicknames: Record<string, string> = { [post.hostId]: post.hostNickname };
  messages.forEach((m) => {
    if (!m.isSystem) participantNicknames[m.userId] = m.nickname;
  });
  const participants = Array.from(participantIds).map((uid) => ({
    id: uid,
    nickname: participantNicknames[uid] ?? uid,
    isHost: uid === post.hostId,
  }));

  const isCompleted = post.status === "completed";

  return (
    <div className="relative flex flex-col h-screen max-w-[390px] mx-auto bg-surface">
      {/* Fixed Header */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] glass z-20 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container active:scale-95 transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-on-surface">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" />
          </svg>
        </button>
        <div className="flex-1 text-center text-title-md text-on-surface truncate">
          {post.saunaName}
        </div>
        <div className="flex-shrink-0">
          <MeetupStatus status={post.status} />
        </div>
      </div>

      {/* Info card */}
      <div className="mx-4 mt-[68px] bg-surface-container-lowest rounded-2xl p-4 shadow-ambient-sm">
        {/* Host row */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-label-md font-semibold flex-shrink-0">
            {getInitials(post.hostNickname)}
          </div>
          <span className="text-title-md text-on-surface">{post.hostNickname}</span>
          <span className="px-2 py-0.5 rounded-full bg-primary-container/20 text-primary text-label-sm">HOST</span>
        </div>

        {/* Date */}
        <div className="text-body-md text-on-surface-variant mt-3">
          📅 {formatMeetDate(post.meetDate)}
        </div>

        {/* Spots */}
        <div className="text-body-md text-on-surface-variant mt-1">
          👥 {post.currentSpots}/{post.maxSpots}명 참여
        </div>

        {/* Description */}
        <p className="text-body-md text-on-surface mt-2">{post.description}</p>
      </div>

      {/* Participant avatars */}
      <div className="flex gap-2 px-4 mt-3">
        {participants.map((p) => (
          <div
            key={p.id}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-label-sm font-semibold flex-shrink-0 ${
              p.isHost ? "gradient-primary shadow-glow-primary" : "bg-surface-container-high text-on-surface-variant"
            }`}
            title={p.nickname}
          >
            {getInitials(p.nickname)}
          </div>
        ))}
      </div>

      {/* Chat messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 scrollbar-hide"
        style={{ paddingBottom: isCompleted ? "160px" : "96px", paddingTop: "8px" }}
      >
        {messages.length === 0 && (
          <div className="flex justify-center mt-8">
            <p className="text-body-md text-on-surface-variant">아직 메시지가 없습니다. 첫 인사를 남겨보세요!</p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            isMe={msg.userId === currentUser.id}
          />
        ))}
        <div ref={chatBottomRef} />
      </div>

      {/* Completed CTA banner */}
      {isCompleted && (
        <div
          className="fixed left-1/2 -translate-x-1/2 w-full max-w-[390px] z-20 px-4 py-3"
          style={{ bottom: "80px" }}
        >
          <button
            onClick={() => router.push(`/check-in`)}
            className="w-full py-3.5 rounded-2xl gradient-primary-bold text-white text-title-md font-semibold shadow-glow-primary active:scale-[0.98] transition-all"
          >
            체크인 하러 가기
          </button>
        </div>
      )}

      {/* Input bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] glass z-20 px-4 py-3 flex gap-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요..."
          className="flex-1 bg-surface-container-highest/60 rounded-2xl px-4 py-3 outline-none text-body-lg text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-lowest focus:shadow-focus-primary transition-all"
        />
        <button
          onClick={handleSend}
          className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-glow-primary active:scale-95 transition-all flex-shrink-0 self-end"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
