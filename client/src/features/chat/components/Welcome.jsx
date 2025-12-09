import React from "react";
import { useSelector } from "react-redux";
import { Box, Typography, Avatar } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import MessageIcon from "@mui/icons-material/Message";

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  padding: theme.spacing(4),
  textAlign: "center",
}));

export default function Welcome() {
  const theme = useTheme();
  const { userInfo } = useSelector((state) => state.user);
  const userName = userInfo?.firstName || userInfo?.username || "User";

  return (
    <StyledBox>
      <Avatar
        sx={{
          width: 120,
          height: 120,
          bgcolor: theme.palette.primary.main,
          mb: 3,
        }}
      >
        <MessageIcon sx={{ fontSize: 60 }} />
      </Avatar>

      <Typography variant="h4" fontWeight="600" gutterBottom>
        Welcome back, {userName}!
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
        Ready to start a conversation? Select a chat from the list or create a new one to begin messaging with your colleagues.
      </Typography>
    </StyledBox>
  );
}
