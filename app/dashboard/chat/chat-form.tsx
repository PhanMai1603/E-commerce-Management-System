/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { getAllConversations, getMessage } from "@/app/api/chat";
import { uploadChat } from "@/app/api/upload";
import type { Conversations, Content } from "@/interface/chat";
import {
  connectSocket,
  getSocket,
  disconnectSocket,
} from "@/app/socket/socket";

interface Props {
  userId: string;
  accessToken: string;
  role: string;
}
interface ExtendedContent extends Content {
  conversationId: string;
}

const ChatUI: React.FC<Props> = ({ userId, accessToken, role }) => {
  const [conversations, setConversations] = useState<Conversations[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<ExtendedContent[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [targetUser, setTargetUser] = useState<any>(null);
  const [tokenReady, setTokenReady] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [notificationConversations, setNotificationConversations] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (accessToken && userId) setTokenReady(true);
  }, [accessToken, userId]);

  useEffect(() => {
    if (!tokenReady) return;

    const deviceToken = localStorage.getItem("deviceToken") || "";
    const socket = connectSocket(accessToken, deviceToken);

    socket?.on("new_message", (data) => {
      const msg: ExtendedContent = {
        ...data.message,
        conversationId: data.conversationId, // Thêm dòng này nếu BE gửi kèm conversationId
      };
      if (msg.conversationId === selectedConversation) {
        // Nếu đang xem cuộc trò chuyện đó thì hiển thị luôn
        setMessages((prev) => [...prev, msg]);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
      } else {
        // Nếu là cuộc trò chuyện khác thì hiển thị badge đỏ
        setNotificationConversations((prev) => new Set(prev).add(data.conversationId));
      }

      getAllConversations(userId, accessToken)
        .then((res) => setConversations(res.items))
        .catch((err) => console.error("Error updating conversations", err));
    });

    socket?.on("refresh_conversations", (data) => {
      console.log("📩 refresh_conversations received:", data);

      getAllConversations(userId, accessToken)
        .then((res) => {
          console.log("✅ Conversations refreshed:", res.items);
          setConversations(res.items);
        })
        .catch((err) => console.error("Error reloading conversations", err));

      if (data.conversationId === selectedConversation) {
        getMessage(data.conversationId, userId, accessToken).then((res) => {
          setMessages(res.items.map(item => ({ ...item, conversationId: data.conversationId })).reverse());
          const otherUser = res.items.find((msg) => msg.userId?.id !== userId)?.userId || null;
          setTargetUser(otherUser);
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 50);
        });
      } else {
        setNotificationConversations((prev) => new Set(prev).add(data.conversationId));
      }
    });


    return () => {
      disconnectSocket();
    };
  }, [accessToken, selectedConversation, role, tokenReady]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!tokenReady) return;
    getAllConversations(userId, accessToken)
      .then((res) => setConversations(res.items))
      .catch((err) => console.error("Error loading conversations", err));
  }, [userId, accessToken, tokenReady]);

  const handleSelectConversation = async (id: string) => {
    setSelectedConversation(id);
    setNotificationConversations((prev) => {
      const updated = new Set(prev);
      updated.delete(id);
      return updated;
    });

    const res = await getMessage(id, userId, accessToken);
    setMessages(res.items.map(item => ({ ...item, conversationId: id })).reverse());
    const otherUser = res.items.find((msg) => msg.userId?.id !== userId)?.userId || null;
    setTargetUser(otherUser);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleSendMessage = async () => {
    const socket = getSocket();
    if (!selectedConversation || !socket?.connected) return;
    if (!newMessage.trim() && selectedImages.length === 0) return;

    let image = null;
    if (selectedImages.length > 0) {
      image = await uploadChat(selectedImages[0], userId, accessToken);
    }

    const optimisticMessage: ExtendedContent = {
      id: "temp-id-" + Date.now(),
      content: newMessage,
      image: image || null,
      conversationId: selectedConversation,
      createdAt: new Date().toISOString(),
      userId: { id: userId, name: "", avatar: "/avatar.jpg" },
      sender: userId,
      senderType: role,
      seen: false,
      position: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);

    socket.emit("send_message", {
      conversationId: selectedConversation,
      content: newMessage,
      imageUrls: image ? [image] : [],
      useAI: false,
    });

    setNewMessage("");
    setSelectedImages([]);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    setSelectedImages((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isValidUrl = (url?: string) => {
    try {
      if (!url) return false;
      const parsed = new URL(url);
      return parsed.hostname !== "via.placeholder.com";
    } catch {
      return false;
    }
  };

  if (!tokenReady) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[80vh] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Sidebar */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-white border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Chat</h2>
        </div>
        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💬</span>
              </div>
              <p>Chưa có cuộc trò chuyện nào</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const name = conv.user.name;
              const avatar = isValidUrl(conv.user.avatar) ? conv.user.avatar : "/avatar.jpg";
              const last = conv.latestMessage;
              const isSelected = selectedConversation === conv.id;
              const hasNotification = notificationConversations.has(conv.id);

              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-100 flex items-center space-x-3 border-b ${isSelected ? "bg-blue-50" : ""
                    }`}
                >
                  <img src={avatar} className="w-10 h-10 rounded-full object-cover" alt="avatar" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                    {last && (
                      <div className="flex justify-between text-xs text-gray-500">
                        <p className="truncate max-w-[160px]">
                          {last.userId?.name || "Ẩn danh"}: {last.content || "📷 Hình ảnh"}
                        </p>
                        <p>{formatTime(last.createdAt)}</p>
                      </div>
                    )}
                  </div>
                  {hasNotification && !isSelected && (
                    <span className="ml-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                  )}

                </div>
              );
            })
          )}
        </div>


      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            {targetUser && (
              <div className="p-4 bg-white border-b border-gray-200 shadow-sm">
                <div className="flex items-center space-x-3">
                  <img
                    src={isValidUrl(targetUser?.avatar) ? targetUser.avatar : "/avatar.jpg"}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => (e.currentTarget.src = "/avatar.jpg")}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{targetUser?.name || "Người dùng"}</h3>
                    <p className="text-sm text-green-500">Đang hoạt động</p>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">💬</span>
                    </div>
                    <p>Chưa có tin nhắn nào</p>
                    <p className="text-sm mt-1">Hãy bắt đầu cuộc trò chuyện!</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, i) => {
                    // 👉 Bạn sửa TẠI ĐÂY
                    const isSelf = msg.userId?.id === userId;
                    const avatar = isValidUrl(msg.userId?.avatar || undefined)
                      ? msg.userId!.avatar
                      : "/avatar.jpg";

                    if (!msg.content && !msg.image) return null; // ✅ THÊM DÒNG NÀY

                    return (
                      <div key={i} className={`flex ${isSelf ? "justify-end" : "justify-start"}`}>
                        <div className={`flex max-w-[70%] ${isSelf ? "flex-row-reverse" : "flex-row"}`}>
                          <img
                            src={avatar}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1"
                            alt="avatar"
                            onError={(e) => (e.currentTarget.src = "/avatar.jpg")}
                          />
                          <div className={`mx-2 ${isSelf ? "text-right" : "text-left"}`}>
                            <div className={`inline-block p-3 rounded-2xl max-w-full ${isSelf
                              ? "bg-blue-500 text-white rounded-br-sm"
                              : "bg-white text-gray-900 border border-gray-200 rounded-bl-sm shadow-sm"
                              }`}>
                              {msg.image && (
                                <img
                                  src={msg.image}
                                  alt="image"
                                  className="max-w-48 max-h-48 object-cover rounded-lg mb-2"
                                />
                              )}
                              {msg.content && (
                                <p className="text-sm break-words whitespace-pre-wrap">{msg.content}</p>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1 px-2">
                              {formatTime(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div ref={messagesEndRef}></div>
            </div>

            {/* Image Previews */}
            {selectedImages.length > 0 && (
              <div className="p-3 bg-gray-50 border-t border-gray-200">
                <div className="flex space-x-2 overflow-x-auto">
                  {selectedImages.map((img, index) => (
                    <div key={index} className="relative flex-shrink-0">
                      <img
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex items-end space-x-3">
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  multiple
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>

                <div className="flex-1 relative">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="w-full p-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tin nhắn..."
                  />
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() && selectedImages.length === 0}
                  className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Chào mừng đến với Chat</h3>
              <p>Chọn một cuộc trò chuyện để bắt đầu nhắn tin</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatUI;