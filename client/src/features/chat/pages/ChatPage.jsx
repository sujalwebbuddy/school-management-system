import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { SocketProvider, useSocketContext } from "../hooks/SocketContext";
import { getUserChats } from "../../../slices/chatSlice";
import ChatList from "../components/ChatList";
import ChatContainer from "../components/ChatContainer";
import FeatureGuard from "../../../components/FeatureGuard";

const StyledContainer = styled(Box)(({ theme }) => ({
  height: "calc(100vh - 64px)", // Account for header
  width: "100%",
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

const ChatGrid = styled(Grid)(({ theme }) => ({
  flex: 1,
  height: "100%",
  minHeight: 0, // Important for flex children
}));

const WelcomePaper = styled(Paper)(({ theme }) => ({
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

function ChatPageContent() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { userInfo } = useSelector((state) => state.user);
  const { currentChat, chats, loading } = useSelector((state) => state.chat);
  const { initializeSocket, disconnectSocket, addUserToSocket, joinChat, leaveChat } = useSocketContext();

  useEffect(() => {
    // Initialize socket connection
    initializeSocket();

    // Load user's chats
    dispatch(getUserChats());

    // Cleanup function to disconnect socket when component unmounts
    return () => {
      disconnectSocket();
    };
  }, [initializeSocket, disconnectSocket, dispatch]);

  // Add user to socket when user is available and authenticated
  useEffect(() => {
    if (userInfo?._id) {
      addUserToSocket(userInfo._id);
    }
  }, [userInfo, addUserToSocket]);

  // Join/leave chat rooms when currentChat changes
  useEffect(() => {
    if (currentChat) {
      joinChat(currentChat._id);
      return () => {
        leaveChat(currentChat._id);
      };
    }
  }, [currentChat, joinChat, leaveChat]);

  if (loading && chats.length === 0) {
    return (
      <StyledContainer>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Loading chats...
          </Typography>
        </Box>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <ChatGrid container spacing={2} sx={{ height: "100%" }}>
        <Grid 
          item 
          xs={12} 
          sm={5} 
          md={4} 
          lg={3.5}
          sx={{ 
            height: { xs: "40vh", sm: "100%" },
            minHeight: { xs: "300px", sm: 0 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ChatList />
        </Grid>

        <Grid 
          item 
          xs={12} 
          sm={7} 
          md={8} 
          lg={8.5}
          sx={{ 
            height: { xs: "60vh", sm: "100%" },
            minHeight: { xs: "400px", sm: 0 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          {currentChat === null ? (
            <WelcomePaper elevation={1}>
              <Box textAlign="center">
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  Welcome to Messages
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Select a chat from the list to start messaging
                </Typography>
              </Box>
            </WelcomePaper>
          ) : (
            <ChatContainer currentChat={currentChat} />
          )}
        </Grid>
      </ChatGrid>
    </StyledContainer>
  );
}

export default function ChatPage() {
  return (
    <FeatureGuard feature="chat">
    <SocketProvider>
      <ChatPageContent />
    </SocketProvider>
    </FeatureGuard>
  );
}

// const Container = styled.div`
//   height: 100vh;
//   width: 100vw;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   gap: 1rem;
//   align-items: center;
//   background-color: #131324;
//   .container {
//     height: 85vh;
//     width: 85vw;
//     background-color: #00000076;
//     display: grid;
//     grid-template-columns: 25% 75%;
//     @media screen and (min-width: 720px) and (max-width: 1080px) {
//       grid-template-columns: 35% 65%;
//     }
//   }
// `;
