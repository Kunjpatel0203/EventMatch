import { useState, useEffect, useRef, useCallback } from "react";
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Badge,
  Grid,
} from "@mui/material";
import {
  Send as SendIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
  Forum as ForumIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

// ChatMessage Component - Unchanged
const ChatMessage = ({ message, currentUserId, profileImage }) => {
  const isOwnMessage = message.sender === currentUserId;
  
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getInitials = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };
  
  const getAvatarColor = (senderId) => {
    if (!senderId) return "#757575";
    const hashCode = senderId.split('').reduce(
      (acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0
    );
    const hue = Math.abs(hashCode) % 360;
    return `#000`
  };
  
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isOwnMessage ? "flex-end" : "flex-start",
        mb: 2,
        px: 1,
      }}
    >
      {!isOwnMessage && (
        <Avatar 
          sx={{ 
            width: 32, 
            height: 32, 
            mr: 1,
            bgcolor: getAvatarColor(message.sender)
          }}
        >
          {getInitials(message.senderName)}
        </Avatar>
      )}
      
      <Box sx={{ maxWidth: "70%" }}>
        {!isOwnMessage && message.senderName && (
          <Typography 
            variant="caption" 
            sx={{ ml: 1, mb: 0.5, display: "block", color: "text.secondary", fontWeight: 500 }}
          >
            {message.senderName}
          </Typography>
        )}
        
        <Paper
          elevation={1}
          sx={{
            py: 1.5,
            px: 2,
            bgcolor: isOwnMessage ? "primary.light" : "grey.50",
            color: isOwnMessage ? "white" : "text.primary",
            borderRadius: "18px",
            borderTopRightRadius: isOwnMessage ? "4px" : "18px",
            borderTopLeftRadius: !isOwnMessage ? "4px" : "18px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="body2">{message.content}</Typography>
        </Paper>
        
        <Typography 
          variant="caption" 
          sx={{ 
            display: "block", 
            mt: 0.5,
            textAlign: isOwnMessage ? "right" : "left",
            mx: 1,
            color: "text.secondary",
            fontSize: "0.7rem"
          }}
        >
          {formatTimestamp(message.timeStamp)}
        </Typography>
      </Box>
    </Box>
  );
};

// Room List Item - Unchanged
const RoomListItem = ({ room, isSelected, onSelect, hasNewMessages }) => {
  return (
    <ListItemButton
      selected={isSelected}
      onClick={onSelect}
      sx={{ 
        py: 1.5,
        borderRadius: 1,
        mb: 0.5,
        mx: 0.5,
        bgcolor: isSelected ? "primary.lighter" : "inherit",
        "&:hover": {
          bgcolor: isSelected ? "primary.lighter" : "action.hover",
        }
      }}
    >
      <Badge color="primary" variant="dot" invisible={!hasNewMessages} sx={{ width: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Avatar 
            sx={{ 
              mr: 2, 
              bgcolor: isSelected ? "primary.main" : "grey.400",
              width: 38,
              height: 38
            }}
          >
            {room.eventTitle?.charAt(0)?.toUpperCase() || "R"}
          </Avatar>
          <ListItemText 
            primary={
              <Typography noWrap variant="subtitle2" sx={{ fontWeight: isSelected ? 600 : 400 }}>
                {room.eventTitle || `Room ${room.roomId}`}
              </Typography>
            }
          />
        </Box>
      </Badge>
    </ListItemButton>
  );
};

export default function ChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messageInputRef = useRef(null);
  const userId = localStorage.getItem("userId");
  const profileImage = localStorage.getItem("profileImage");
  const [roomsWithNewMessages, setRoomsWithNewMessages] = useState(new Set());
  const subscriptionsRef = useRef({});
  const lastProcessedEventDetails = useRef(null);

  const ensureRoomExists = async (roomId, eventId, eventTitle) => {
    try {
      const response = await axios.post("http://localhost:8080/api/v1/rooms/ensure", {
        roomId,
        eventId,
        eventTitle,
        sender: userId
      });
      
      // Clear any existing messages when changing rooms
      setMessages([]);
      setCurrentRoom(response.data);
      setPage(0);
      setHasMoreMessages(true);
      
      setRooms(prev => {
        if (prev.find(room => room.roomId === roomId)) {
          return prev.map(room => 
            room.roomId === roomId ? response.data : room
          );
        }
        return [...prev, response.data];
      });
      
      // Fetch messages for the new room
      fetchMessages(roomId, 0);
      
      return response.data;
    } catch (error) {
      console.error("Error ensuring room exists:", error);
      return null;
    }
  };

  // Process location state when it contains event details
  useEffect(() => {
    if (location.state?.eventDetails) {
      const { eventId, eventTitle, roomId, isEventChat } = location.state.eventDetails;
      
      // Create a unique identifier for this event details combination
      const eventDetailsKey = `${roomId}-${eventId}-${eventTitle}`;
      
      // Only process if this is different from the last processed event details
      if (!lastProcessedEventDetails.current || 
          lastProcessedEventDetails.current !== eventDetailsKey) {
        
        // Update the ref to the current event details
        lastProcessedEventDetails.current = eventDetailsKey;
        
        // Process the new room
        ensureRoomExists(roomId, eventId, eventTitle);
        
        // Clear the state to prevent reprocessing
        navigate("/chat", { replace: true });
      }
    }
  }, [location.state]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const socket = new SockJS("http://localhost:8080/chat");
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log("Connected to WebSocket");
      setStompClient(client);

      // Subscribe to the CURRENT room only on initial connect
      if (currentRoom) {
        subscribeToRoom(client, currentRoom.roomId);
      }
    };

    client.onStompError = (frame) => {
      console.error("STOMP error", frame);
    };

    client.activate();

    return () => {
      if (client && client.active) {
        // Unsubscribe all subscriptions on disconnect
        for (const roomId in subscriptionsRef.current) {
          if (subscriptionsRef.current.hasOwnProperty(roomId)) {
            const subscription = subscriptionsRef.current[roomId];
            subscription.unsubscribe();
          }
        }
        client.deactivate();
      }
    };
  }, [navigate, userId]);

  // Fetch rooms
  useEffect(() => {
    if (!userId) return;

    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/v1/rooms/user/${userId}/events-and-auctions`
        );
        setRooms(response.data);

        const highlightEventId = location.state?.highlightEventId;
        if (highlightEventId) {
          const foundRoom = response.data.find(
            (room) => room.roomId === highlightEventId.toString()
          );
          if (foundRoom) {
            setCurrentRoom(foundRoom);
          }
        } else if (response.data.length > 0 && !currentRoom) {
          setCurrentRoom(response.data[0]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setLoading(false);
      }
    };

    fetchRooms();
  }, [userId]);

  // Subscribe to current room
  useEffect(() => {
    if (!currentRoom || !stompClient || !stompClient.active) return;

    subscribeToRoom(stompClient, currentRoom.roomId);
    fetchMessages(currentRoom.roomId, 0);
    setDrawerOpen(false);

    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 100);

    // Remove current room from new messages set
    setRoomsWithNewMessages(prev => {
      const updated = new Set(prev);
      updated.delete(currentRoom.roomId);
      return updated;
    });
  }, [currentRoom, stompClient]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && !loadingMoreMessages) {
      scrollToBottom();
    }
  }, [messages, loadingMoreMessages]);

  const subscribeToRoom = (client, roomId) => {
    // Unsubscribe from the previous room, if any
    for (const subRoomId in subscriptionsRef.current) {
      if (subscriptionsRef.current.hasOwnProperty(subRoomId)) {
        const subscription = subscriptionsRef.current[subRoomId];
        subscription.unsubscribe();
        delete subscriptionsRef.current[subRoomId];
      }
    }
    
    // Subscribe to the new room
    const subscription = client.subscribe(`/topic/room/${roomId}`, (message) => {
      const receivedMsg = JSON.parse(message.body);

      if (receivedMsg.sender !== userId) {
        setMessages((prevMessages) => [...prevMessages, receivedMsg]);
        
        // Mark messages as read only if we're currently viewing this room
        if (currentRoom && currentRoom.roomId === roomId) {
          setRoomsWithNewMessages(prev => {
            const updated = new Set(prev);
            updated.delete(roomId);
            return updated;
          });
        } else {
          // Otherwise mark room as having new messages
          setRoomsWithNewMessages(prev => {
            const updated = new Set(prev);
            updated.add(roomId);
            return updated;
          });
        }
      }
    });
    
    subscriptionsRef.current[roomId] = subscription;
  };

  const fetchMessages = async (roomId, nextPage = 0) => {
    try {
      setLoadingMoreMessages(true);
      const response = await axios.get(
        `http://localhost:8080/api/v1/rooms/${roomId}/messages?page=${nextPage}&size=20`
      );

      if (nextPage === 0) {
        setMessages(response.data.reverse());
      } else {
        setMessages((prev) => [...response.data.reverse(), ...prev]);
      }

      setHasMoreMessages(response.data.length === 20);
      setPage(nextPage);
      setLoadingMoreMessages(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoadingMoreMessages(false);
    }
  };

  const loadMoreMessages = () => {
    if (currentRoom && hasMoreMessages && !loadingMoreMessages) {
      fetchMessages(currentRoom.roomId, page + 1);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim() || !currentRoom || !stompClient || !stompClient.active) return;

    const messagePayload = {
      content: message,
      sender: userId,
      senderName: localStorage.getItem("username") || "You",
      eventId: currentRoom.roomId,
      eventTitle: currentRoom.eventTitle,
      timeStamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, messagePayload]);

    stompClient.publish({
      destination: `/app/sendMessage/${currentRoom.roomId}`,
      body: JSON.stringify(messagePayload),
    });

    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRoomSelect = (room) => {
    // Only reset messages if changing rooms
    if (!currentRoom || currentRoom.roomId !== room.roomId) {
      setMessages([]);
      setPage(0);
      setHasMoreMessages(true);
      setCurrentRoom(room);
    }
  };

  const handleScroll = (e) => {
    const element = e.target;
    if (element.scrollTop === 0 && hasMoreMessages && !loadingMoreMessages) {
      loadMoreMessages();
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
        }}
      >
        <Grid container>
          {/* Mobile header */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              width: "100%",
              bgcolor: "primary.main",
              color: "white",
              p: 1.5,
              alignItems: "center"
            }}
          >
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 2, fontWeight: 500 }}>
              {currentRoom?.eventTitle || "Select a Room"}
            </Typography>
          </Box>
          {/* Room list - desktop */}
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              display: { xs: "none", md: "block" },
              borderRight: "1px solid #f0f0f0",
              height: "80vh"
            }}
          >
            <Box sx={{
              p: 2,
              borderBottom: "1px solid #f5f5f5",
              bgcolor: "#f8f9fa"
            }}>
              <Typography variant="h6" sx={{ fontWeight: 500, color: "text.primary" }}>Conversations</Typography>
            </Box>
            <List sx={{ p: 1, overflowY: "auto", maxHeight: "calc(80vh - 60px)" }}>
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <RoomListItem
                    key={room.roomId}
                    room={room}
                    isSelected={currentRoom?.roomId === room.roomId}
                    onSelect={() => handleRoomSelect(room)}
                    hasNewMessages={roomsWithNewMessages.has(room.roomId)}
                  />
                ))
              ) : (
                <Box sx={{ py: 6, px: 2, textAlign: "center", color: "text.secondary" }}>
                  <Typography variant="body2" gutterBottom>
                    No conversations yet
                  </Typography>
                  <Typography variant="caption">
                    Join an event to start chatting
                  </Typography>
                </Box>
              )}
            </List>
          </Grid>

          {/* Mobile Drawer */}
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <Box sx={{ width: 280 }}>
              <Box sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "primary.main",
                color: "white"
              }}>
                <Typography variant="h6">Conversations</Typography>
                <IconButton onClick={() => setDrawerOpen(false)} color="inherit">
                  <CloseIcon />
                </IconButton>
              </Box>
              <List sx={{ p: 1 }}>
                {rooms.length > 0 ? (
                  rooms.map((room) => (
                    <RoomListItem
                      key={room.roomId}
                      room={room}
                      isSelected={currentRoom?.roomId === room.roomId}
                      onSelect={() => handleRoomSelect(room)}
                      hasNewMessages={roomsWithNewMessages.has(room.roomId)}
                    />
                  ))
                ) : (
                  <Box sx={{ py: 4, px: 2, textAlign: "center", color: "text.secondary" }}>
                    <Typography variant="body2">No conversations yet</Typography>
                  </Box>
                )}
              </List>
            </Box>
          </Drawer>

          {/* Chat area */}
          <Grid
            item
            xs={12}
            md={9}
            sx={{
              height: "80vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {currentRoom ? (
              <>
                {/* Chat header */}
                <Box
                  sx={{
                    p: 2,
                    borderBottom: "1px solid #f0f0f0",
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                    bgcolor: "#f8f9fa"
                  }}
                >
                  <Avatar sx={{ mr: 1.5, bgcolor: "primary.main" }}>
                    {currentRoom.eventTitle?.charAt(0)?.toUpperCase() || "R"}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 500, color: "text.primary" }}>
                    {currentRoom.eventTitle || `Room ${currentRoom.roomId}`}
                  </Typography>
                </Box>

                {/* Messages area */}
                <Box
                  ref={messagesContainerRef}
                  onScroll={handleScroll}
                  sx={{
                    flexGrow: 1,
                    p: 2,
                    overflowY: "auto",
                    position: "relative",
                  }}
                >
                  {loadingMoreMessages && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        bgcolor: "rgba(255,255,255,0.8)",
                        zIndex: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CircularProgress size={30} />
                    </Box>
                  )}
                  {messages.length > 0 ? (
                    messages.map((message, index) => (
                      <ChatMessage
                        key={`${currentRoom.roomId}-${index}`}
                        message={message}
                        currentUserId={userId}
                        profileImage={profileImage}
                      />
                    ))
                  ) : (
                    <Box sx={{ 
                      display: "flex", 
                      justifyContent: "center", 
                      alignItems: "center", 
                      height: "100%",
                      opacity: 0.5
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        No messages yet. Start the conversation!
                      </Typography>
                    </Box>
                  )}
                  <div ref={messagesEndRef} />
                </Box>

                {/* Input area */}
                <Box sx={{ p: 2, borderTop: "1px solid #f0f0f0" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      inputRef={messageInputRef}
                      fullWidth
                      placeholder="Type a message..."
                      variant="outlined"
                      size="small"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      multiline
                      maxRows={4}
                      sx={{ borderRadius: 2, mr: 1 }}
                    />
                    <IconButton
                      color="primary"
                      onClick={handleSendMessage}
                      aria-label="send"
                      disabled={!message.trim()}
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  flexDirection: "column",
                  color: "text.secondary",
                }}
              >
                <ForumIcon sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Select a conversation to start chatting
                </Typography>
                <Typography variant="body2">
                  Or join an event to create a new one
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}