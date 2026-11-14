"use client";

import { Avatar, Flex } from "@radix-ui/themes";

type DiscussionMessageProps = {
  author: string;
  text: string;
  timeAgo?: string;
  avatarSrc?: string;
  fallback?: string;
};

export default function DiscussionMessage({
  author,
  text,
  timeAgo = "",
  avatarSrc = "",
  fallback = "",
}: DiscussionMessageProps) {
  return (
    <div style={{ padding: "0.75rem 0" }}>
      <Flex align="start" gap="3">
        <Avatar src={avatarSrc} fallback={fallback || author.charAt(0)} radius="full" />

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontWeight: 700 }}>{author}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ color: "var(--text-soft)", fontSize: "0.9rem" }}>{timeAgo}</div>
            </div>
          </div>

          <div style={{ marginTop: "0.5rem", color: "var(--text)", whiteSpace: "pre-wrap" }}>{text}</div>
        </div>
      </Flex>
    </div>
  );
}
