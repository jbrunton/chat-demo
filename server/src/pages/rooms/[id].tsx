import React, { useState, useEffect, useRef } from "react";
import { List, Input, Typography, InputRef, Button, Form } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { io } from "socket.io-client";
import { useRouter } from "next/router";
import { formatTime } from "@util/format";
import Layout from "@app/components/Layout";
import { NextPage } from "next";
import { getRoom } from "@app/api/rooms";
import { sendMessage } from "@app/api/chat";
import { useContext } from "react";
import { SessionContext } from "@app/components/AuthWrapper";
import {
  IncomingMessage,
  Message,
  PublicMessage,
} from "@domain/entities/messages";
import { Room } from "@domain/entities/room";

const RoomPage: NextPage = () => {
  const inputRef = useRef<InputRef>(null);

  const router = useRouter();
  const roomId: string = router.query.id as string;

  const [chat, setChat] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [connected, setConnected] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const { refreshSession } = useContext(SessionContext);

  const loadRoom = async () => {
    const response = await getRoom(roomId);
    setRoom(response.room);
    setChat(response.messages);
  };

  const createSocket = () => {
    return io(process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000", {
      path: "/api/socketio",
      query: {
        roomId,
      },
    });
  };

  const onMessage = (message: PublicMessage) => {
    if (message.updated?.includes("room")) {
      loadRoom();
    }
    if (message.updated?.includes("user")) {
      refreshSession();
      loadRoom();
    }
    setChat((chat) => [...chat, message]);
  };

  useEffect(() => {
    if (!roomId) return;
    const socket = createSocket();
    socket.on("connect", () => {
      setConnected(true);
    });
    socket.on("message", onMessage);
    return () => {
      socket.close();
    };
  }, [roomId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (roomId) {
      loadRoom();
    }
  }, [roomId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    inputRef?.current?.focus();
  }, [connected]);

  const onSendMessage = async () => {
    if (!connected) return;

    if (content) {
      setSendingMessage(true);
      const message: IncomingMessage = {
        roomId,
        content,
        time: new Date().toISOString(),
      };

      await sendMessage(message);

      setSendingMessage(false);
      setContent("");
    }

    inputRef?.current?.focus();
  };

  return (
    <Layout subTitle={room?.name}>
      <List
        itemLayout="vertical"
        dataSource={chat}
        size="small"
        locale={{ emptyText: <span>Be the first to say something!</span> }}
        renderItem={(message) => (
          <List.Item extra={<span>{formatTime(new Date(message.time))}</span>}>
            {message.sender ? (
              <>
                <Typography.Text strong={true}>
                  {message.sender.name}:{" "}
                </Typography.Text>
                <span>{message.content}</span>
              </>
            ) : (
              <span dangerouslySetInnerHTML={{ __html: message.content }} />
            )}
          </List.Item>
        )}
      />
      <Form layout="vertical" className="form">
        <Form.Item>
          <Input.Search
            className="input"
            disabled={!connected}
            value={content}
            ref={inputRef}
            placeholder="Type to chat"
            onChange={(e) => setContent(e.target.value)}
            onSearch={() => onSendMessage()}
            enterButton={
              <Button
                type="primary"
                disabled={!content.length}
                loading={sendingMessage}
                icon={<ArrowRightOutlined disabled={true} />}
              />
            }
          />
        </Form.Item>
      </Form>
    </Layout>
  );
};

RoomPage.requireAuth = true;

export default RoomPage;
