import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Card,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Badge,
  Chip,
  Checkbox,
  ListItemSecondaryAction,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import MessageIcon from "@mui/icons-material/Message";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import { setCurrentChat, clearMessages, createChat } from "../../../slices/chatSlice";
import api from "../../../utils/api";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.paper,
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

const ChatListContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: "auto",
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

const StyledListItemButton = styled(ListItemButton)(({ theme, selected }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 1),
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.main + "20",
    "&:hover": {
      backgroundColor: theme.palette.primary.main + "30",
    },
  },
}));

const EmptyStateBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function ChatList() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { chats, currentChat, loading, error } = useSelector((state) => state.chat);
  const { userInfo } = useSelector((state) => state.user);

  // Create chat modal state
  const [showCreateChat, setShowCreateChat] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [contactsError, setContactsError] = useState(null);

  // Fetch contacts when modal opens
  useEffect(() => {
    if (showCreateChat && userInfo?._id && contacts.length === 0) {
      fetchContacts();
    }
  }, [showCreateChat, userInfo._id, contacts.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchContacts = async () => {
    if (!userInfo?._id) return;

    setContactsLoading(true);
    setContactsError(null);

    try {
      const response = await api.get(`/authmsg/allusers/${userInfo._id}`);
      setContacts(response.data);
    } catch (error) {
      setContactsError(error.response?.data?.message || error.message);
    } finally {
      setContactsLoading(false);
    }
  };

  const changeCurrentChat = (chat) => {
    dispatch(setCurrentChat(chat));
    dispatch(clearMessages());
  };

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateChat = async () => {
    if (!newChatName.trim() || selectedUsers.length === 0) return;

    try {
      await dispatch(createChat({
        name: newChatName.trim(),
        participantIds: selectedUsers,
        type: selectedUsers.length === 1 ? "direct" : "group"
      }));

      resetCreateChatModal();
    } catch (error) {
      // Error is handled by Redux
    }
  };

  const resetCreateChatModal = () => {
    setNewChatName("");
    setSelectedUsers([]);
    setShowCreateChat(false);
  };

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
    return undefined; // Use default avatar
  };

  const getChatSubtitle = (chat) => {
    if (chat.type === "direct") {
      return "Direct Message";
    }
    return `${chat.participants?.length || 0} members`;
  };

  return (
    <StyledCard>
      <HeaderBox>
        <Box display="flex" alignItems="center" gap={1}>
          <MessageIcon color="primary" />
          <Typography variant="h6" fontWeight="600">
            Chats
          </Typography>
        </Box>
        <Fab
          size="small"
          color="primary"
          onClick={() => setShowCreateChat(true)}
          sx={{ boxShadow: theme.shadows[4] }}
        >
          <AddIcon />
        </Fab>
      </HeaderBox>

      <ChatListContainer>
        {loading && chats.length === 0 ? (
          <EmptyStateBox>
            <Typography variant="body2">Loading chats...</Typography>
          </EmptyStateBox>
        ) : error ? (
          <EmptyStateBox>
            <Typography variant="body2" color="error">
              Error loading chats: {error}
            </Typography>
          </EmptyStateBox>
        ) : chats.length === 0 ? (
          <EmptyStateBox>
            <MessageIcon sx={{ fontSize: 48, color: theme.palette.grey[400], mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No chats yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start a conversation to get connected
            </Typography>
          </EmptyStateBox>
        ) : (
          <List disablePadding>
            {chats.map((chat) => (
              <StyledListItemButton
                key={chat._id}
                selected={currentChat?._id === chat._id}
                onClick={() => changeCurrentChat(chat)}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    color="success"
                  >
                    <Avatar
                      src={getChatAvatar(chat)}
                      sx={{
                        bgcolor: chat.type === "group" ? theme.palette.primary.main : theme.palette.grey[400]
                      }}
                    >
                      {chat.type === "group" ? <GroupIcon /> : <PersonIcon />}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="500" noWrap>
                      {getChatDisplayName(chat)}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {getChatSubtitle(chat)}
                      </Typography>
                      {chat.lastMessage && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                          sx={{ fontSize: '0.75rem', mt: 0.5 }}
                        >
                          {chat.lastMessage.message?.text?.substring(0, 40)}
                          {chat.lastMessage.message?.text?.length > 40 ? "..." : ""}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <Box display="flex" alignItems="center" gap={1}>
                  {chat.type === "group" && (
                    <Chip
                      label={`${chat.participants?.length || 0}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: 20 }}
                    />
                  )}
                </Box>
              </StyledListItemButton>
            ))}
          </List>
        )}
      </ChatListContainer>

      {/* Create Chat Dialog */}
      <Dialog
        open={showCreateChat}
        onClose={resetCreateChatModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="600">
            Create New Chat
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Chat Name"
            fullWidth
            variant="outlined"
            value={newChatName}
            onChange={(e) => setNewChatName(e.target.value)}
            placeholder="Enter chat name"
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Select Participants ({selectedUsers.length} selected)
          </Typography>

          {contactsLoading ? (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress size={24} />
            </Box>
          ) : contactsError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {contactsError}
            </Alert>
          ) : (
            <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
              {contacts.map((contact) => (
                <ListItem key={contact._id} disablePadding>
                  <ListItemButton
                    onClick={() => handleUserSelect(contact._id)}
                    sx={{ borderRadius: 1 }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={contact.avatarImage ? `data:image/svg+xml;base64,${contact.avatarImage}` : undefined}
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: theme.palette.grey[400]
                        }}
                      >
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight="500">
                          {`${contact.firstName} ${contact.lastName}`}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {contact.role}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Checkbox
                        edge="end"
                        checked={selectedUsers.includes(contact._id)}
                        onChange={() => handleUserSelect(contact._id)}
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}

          {selectedUsers.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Selected Users:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {selectedUsers.map(userId => {
                  const user = contacts.find(c => c._id === userId);
                  return user ? (
                    <Chip
                      key={userId}
                      label={`${user.firstName} ${user.lastName}`}
                      size="small"
                      onDelete={() => handleUserSelect(userId)}
                      color="primary"
                      variant="outlined"
                    />
                  ) : null;
                })}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={resetCreateChatModal} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleCreateChat}
            variant="contained"
            disabled={!newChatName.trim() || selectedUsers.length === 0}
            sx={{ minWidth: 100 }}
          >
            Create Chat
          </Button>
        </DialogActions>
      </Dialog>
    </StyledCard>
  );
}
