import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Paper,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { useSocketContext } from "../hooks/SocketContext";
import { addMessage } from "../../../slices/chatSlice";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.grey[50],
    "&:hover": {
      backgroundColor: theme.palette.grey[100],
    },
    "&.Mui-focused": {
      backgroundColor: theme.palette.common.white,
    },
  },
}));

export default function ChatInput() {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const { currentChat } = useSelector((state) => state.chat);
  const theme = useTheme();
  const dispatch = useDispatch();
  const { sendMessage: sendMessageSocket } = useSocketContext();

  const handleEmojiPickerToggle = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const sendChat = async (event) => {
    event.preventDefault();
    if (msg.trim().length > 0 && currentChat) {
      const messageText = msg.trim();

      try {
        console.log("Sending message:", messageText, "to chat:", currentChat._id, "from:", userInfo._id);

        // Add message optimistically to UI
        const optimisticMessage = {
          _id: `temp-${Date.now()}`, // Temporary ID
          fromSelf: true,
          message: messageText,
          sender: {
            _id: userInfo._id,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            username: userInfo.username,
          },
          createdAt: new Date().toISOString(),
          messageType: "text",
        };

        dispatch(addMessage(optimisticMessage));

        // Emit message via socket - this will save to DB and broadcast
        // The socket response will update the message with the real ID
        sendMessageSocket({
          chatId: currentChat._id,
          senderId: userInfo._id,
          message: messageText,
        });

        // Clear input immediately
        setMsg("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendChat(event);
    }
  };

  return (
    <StyledPaper elevation={0}>
      <Box component="form" onSubmit={sendChat} sx={{ display: 'flex', gap: 1 }}>
        <StyledTextField
          fullWidth
          placeholder="Type your message..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleEmojiPickerToggle}
                  sx={{ color: theme.palette.grey[500] }}
                >
                  <EmojiEmotionsIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <IconButton
          type="submit"
          color="primary"
          disabled={!msg.trim() || !currentChat}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: 'white',
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            },
            '&:disabled': {
              bgcolor: theme.palette.grey[300],
              color: theme.palette.grey[500],
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </StyledPaper>
  );
}

