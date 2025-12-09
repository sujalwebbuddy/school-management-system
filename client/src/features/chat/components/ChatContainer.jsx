import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Card,
  Typography,
  Avatar,
  Paper,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import { getMessages } from "../../../slices/chatSlice";
import ChatInput from "./ChatInput";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.paper,
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: "auto",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: theme.palette.background.default,
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.grey[300],
    borderRadius: "3px",
  },
}));

const MessageBubble = styled(Paper)(({ theme, isOwn }) => ({
  maxWidth: "70%",
  padding: theme.spacing(1.5, 2),
  alignSelf: isOwn ? "flex-end" : "flex-start",
  backgroundColor: isOwn
    ? theme.palette.primary.main
    : theme.palette.grey[100],
  color: isOwn
    ? theme.palette.primary.contrastText
    : theme.palette.text.primary,
  borderRadius: theme.spacing(2),
  position: "relative",
  wordWrap: "break-word",
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

export default function ChatContainer({ currentChat }) {
  const scrollRef = useRef();
  const theme = useTheme();
  const { userInfo } = useSelector((state) => state.user);
  const { messages } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  // Helper function to get sender initials
  const getSenderInitials = (sender) => {
    if (!sender) return '';
    const first = sender.firstName?.charAt(0)?.toUpperCase() || '';
    const last = sender.lastName?.charAt(0)?.toUpperCase() || '';
    return first + last || first || last;
  };

  // Load messages when current chat changes
  useEffect(() => {
    if (currentChat && userInfo?._id) {
      dispatch(getMessages({ chatId: currentChat._id, userId: userInfo._id }));
    }
  }, [dispatch, currentChat, userInfo]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!currentChat) {
    return null;
  }

  const getChatDisplayName = (chat) => {
    if (chat.name && chat.name !== "New Chat") {
      return chat.name;
    }

    // For direct chats, show the other participant's name
    if (chat.type === "direct" && chat.participants) {
      const otherParticipant = chat.participants.find(p => p.user._id !== userInfo._id);
      if (otherParticipant) {
        return `${otherParticipant.user.firstName} ${otherParticipant.user.lastName}`;
      }
    }

    return "Chat";
  };

  const getChatAvatar = (chat) => {
    if (chat.type === "direct" && chat.participants) {
      const otherParticipant = chat.participants.find(p => p.user._id !== userInfo._id);
      if (otherParticipant?.user?.avatarImage) {
        return `data:image/svg+xml;base64,${otherParticipant.user.avatarImage}`;
      }
    }
    return undefined;
  };

  return (
    <StyledCard>
      <ChatHeader>
        <Avatar
          src={getChatAvatar(currentChat)}
          sx={{
            bgcolor: currentChat.type === "group" ? theme.palette.primary.main : theme.palette.grey[400]
          }}
        >
          {currentChat.type === "group" ? <GroupIcon /> : <PersonIcon />}
        </Avatar>
        <Box flex={1}>
          <Typography variant="h6" fontWeight="600">
            {getChatDisplayName(currentChat)}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" color="text.secondary">
              {currentChat.type === "direct" ? "Direct Message" : `${currentChat.participants?.length || 0} members`}
            </Typography>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "success.main",
              }}
            />
          </Box>
        </Box>
      </ChatHeader>

      <MessagesContainer ref={scrollRef}>
        {messages.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ py: 4 }}
          >
            <Typography variant="body2" color="text.secondary">
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          messages.map((message) => (
            <Box
              key={message._id}
              sx={{
                display: "flex",
                justifyContent: message.fromSelf ? "flex-end" : "flex-start",
                mb: 2,
                alignItems: "flex-start",
              }}
            >
              {!message.fromSelf && (
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    mr: 1,
                    bgcolor: theme.palette.primary.main,
                    fontSize: "0.875rem",
                  }}
                >
                  {getSenderInitials(message.sender) || <PersonIcon sx={{ fontSize: 16 }} />}
                </Avatar>
              )}

              <MessageBubble isOwn={message.fromSelf}>
                <Typography variant="body1">
                  {typeof message.message === 'string'
                    ? message.message
                    : message.message?.text || 'Invalid message format'
                  }
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 0.5,
                    opacity: 0.7,
                    fontSize: "0.7rem",
                  }}
                >
                  {message.createdAt
                    ? new Date(message.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : ''
                  }
                </Typography>
              </MessageBubble>

              {message.fromSelf && (
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    ml: 1,
                    bgcolor: theme.palette.secondary.main,
                    fontSize: "0.875rem",
                  }}
                >
                  {getSenderInitials(userInfo) || <PersonIcon sx={{ fontSize: 16 }} />}
                </Avatar>
              )}
            </Box>
          ))
        )}
      </MessagesContainer>

      <InputContainer>
        <ChatInput />
      </InputContainer>
    </StyledCard>
  );
}

