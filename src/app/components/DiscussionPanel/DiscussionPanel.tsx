"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Avatar, Text } from "@radix-ui/themes";
import DefaultButton from "@/app/components/DefaultButton/DefaultButton";
import DiscussionMessage from "@/app/components/DiscussionMessage/DiscussionMessage";
import inputStyles from "../FormInput/FormInput.module.css";
import DefaultHeading from "@/app/components/DefaultHeading/DefaultHeading";
import { formatHungarianDate } from "@/app/lib/dateUtils";
import { useUser } from "@/app/context/UserContext";
import {
  getApiDiscussion,
  getApiDiscussionDiscussionIdMessages,
  getApiUserProfile,
  postApiDiscussionDiscussionIdRead,
  postApiDiscussionDiscussionIdMessages,
} from "@/api/generated";
import * as signalR from "@microsoft/signalr";
import type { DiscussionMessageDto } from "@/api/models/discussionMessageDto";
import type { SendDiscussionMessageRequestDto } from "@/api/models/sendDiscussionMessageRequestDto";
import TrainerSearchDialog from "@/app/profile/TrainerSearchDialog";

type DiscussionPanelProps = {
  useAthleteLogic?: boolean;
  athleteId?: number | null;
};

export default function DiscussionPanel({ useAthleteLogic = true, athleteId }: DiscussionPanelProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<DiscussionMessageDto[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [discussionId, setDiscussionId] = useState<number | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [value, setValue] = useState("");
  const [noTrainerConnected, setNoTrainerConnected] = useState<boolean>(true);
  const userInitial = user?.userName?.trim().charAt(0).toUpperCase() || "Y";

  useEffect(() => {
    if (!useAthleteLogic) return;

    let mounted = true;
    const checkTrainer = async () => {
      try {
        const response = await getApiUserProfile();
        if (!mounted) return;
        setNoTrainerConnected(response.status !== 200 || !response.data.trainerId);
      } catch (err) {
        console.error("Failed to check trainer status", err);
        if (mounted) setNoTrainerConnected(true);
      }
    };

    void checkTrainer();

    return () => {
      mounted = false;
    };
  }, [useAthleteLogic]);

  useEffect(() => {
    let mounted = true;
    const fetchMessages = async () => {
      setLoadingMessages(true);
      setDiscussionId(null);
      setMessages([]);
      try {
        const discussionsResponse = await getApiDiscussion();
        if (discussionsResponse.status !== 200) {
          throw new Error(`Failed to load discussions: ${discussionsResponse.status}`);
        }
        if (!mounted) return;

        const discussions = discussionsResponse.data;
        const discussion = athleteId != null
          ? discussions.find((item) => item.athleteId === athleteId)
          : useAthleteLogic ? discussions[0] : undefined;

        const selectedDiscussionId = discussion?.id;
        if (selectedDiscussionId == null) return;

        const messagesResponse = await getApiDiscussionDiscussionIdMessages(selectedDiscussionId);
        if (messagesResponse.status !== 200) {
          throw new Error(`Failed to load discussion messages: ${messagesResponse.status}`);
        }
        if (!mounted) return;

        setDiscussionId(selectedDiscussionId);
        setMessages(messagesResponse.data);

        try {
          const response = await postApiDiscussionDiscussionIdRead(selectedDiscussionId);
          if (mounted && response.status === 204) {
            setMessages((current) => current.map((message) => ({ ...message, isRead: true })));
          }
        } catch (err) {
          console.debug("Failed to mark discussion read", err);
        }
      } catch (err) {
        console.error("Failed to load discussion messages", err);
        if (mounted) setMessages([]);
      } finally {
        if (mounted) setLoadingMessages(false);
      }
    };

    void fetchMessages();

    return () => {
      mounted = false;
    };
  }, [useAthleteLogic, athleteId]);

  useEffect(() => {
    if (!discussionId) return;
    let mounted = true;
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/hubs/discussion`, {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();

    const start = async () => {
      connection.on("DiscussionMessageReceived", (message: DiscussionMessageDto) => {
        if (!mounted) return;
        setMessages((current) => [message, ...current]);
      });

      connection.on("DiscussionMarkedAsRead", (id: number) => {
        if (!mounted) return;
        if (id === discussionId) {
          setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
        }
      });

      try {
        await connection.start();
        if (!mounted) return;
        await connection.invoke("JoinDiscussion", discussionId);
      } catch (err) {
        console.error("SignalR connection error", err);
      }
    };

    void start();

    return () => {
      mounted = false;
      connection.off("DiscussionMessageReceived");
      connection.off("DiscussionMarkedAsRead");
      void connection.stop().catch((error) => console.error("Error stopping SignalR", error));
    };
  }, [discussionId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = value.trim();
    if (!content || !discussionId || isSending || loadingMessages) return;

    setIsSending(true);
    try {
      const payload: SendDiscussionMessageRequestDto = { content };
      const response = await postApiDiscussionDiscussionIdMessages(discussionId, payload);
      if (response.status !== 200) {
        throw new Error(`Failed to send message: ${response.status}`);
      }
      setValue("");
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="card"
      style={{
        position: "relative",
        maxWidth: "700px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        marginBottom: "0.75rem",
        maxHeight: "580px",
      }}
    >
      <DefaultHeading size="7">Discussion</DefaultHeading>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginTop: "1rem" }}>
        <Avatar src="" fallback={userInitial} radius="full" />

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type an answer..."
          className={inputStyles.input}
          style={{ flex: 1 }}
          disabled={isSending || loadingMessages || !discussionId}
        />

        <div style={{ width: 120 }}>
          <DefaultButton type="submit" fullWidth size="3" disabled={isSending || loadingMessages || !discussionId}>
            {isSending ? "SENDING..." : "SEND"}
          </DefaultButton>
        </div>
      </form>

      <div style={{ height: "1px", background: "var(--border)", margin: "1rem 0" }} />

      {loadingMessages ? (
        <div style={{ padding: "1rem 0" }}>
          <Text>Loading messages…</Text>
        </div>
      ) : (
        <div style={{ overflowY: "auto", flex: 1, paddingRight: "0.25rem" }} aria-busy={loadingMessages}>
          {messages.map((message, index) => (
            <DiscussionMessage
              key={message.id ?? index}
              author={message.senderName ?? message.senderId ?? "Unknown"}
              text={message.content ?? ""}
              timeAgo={message.sentAt ? formatHungarianDate(message.sentAt) : ""}
              fallback={message.senderName?.charAt(0).toUpperCase() || "U"}
            />
          ))}
        </div>
      )}

      {(noTrainerConnected && useAthleteLogic) && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
            backdropFilter: "blur(5px)",
          }}
        >
          <div style={{ width: 380, background: "var(--surface)", color: "var(--text)", padding: "2rem", textAlign: "center" }}>
            <DefaultHeading size="7">MY TRAINER</DefaultHeading>
            <Text>Connect with a trainer for workout plans and advices</Text>
            <div style={{ marginTop: 18 }}>
              <TrainerSearchDialog disabled={false} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
