import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '@/context/SocketContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, MoreVertical, Check, CheckCheck } from 'lucide-react';

const ChatRoom = () => {
    const { recipientId } = useParams();
    const navigate = useNavigate();
    const { socket, isUserOnline } = useSocket();
    
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [recipient, setRecipient] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);
    
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Get current user
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/sma/getUser', {
                    withCredentials: true
                });
                setCurrentUser(response.data);
            } catch (error) {
                console.error('Error fetching current user:', error);
                navigate('/login');
            }
        };
        fetchCurrentUser();
    }, [navigate]);

    // Get or create conversation and load messages
    useEffect(() => {
        const initializeChat = async () => {
            try {
                setLoading(true);
                
                // Get recipient info
                const userResponse = await axios.get(
                    `http://localhost:8000/api/sma/getUseById/${recipientId}`,
                    { withCredentials: true }
                );
                setRecipient(userResponse.data);

                // Get or create conversation
                const convResponse = await axios.get(
                    `http://localhost:8000/api/sma/conversation/${recipientId}`,
                    { withCredentials: true }
                );
                setConversation(convResponse.data);

                // Get messages
                const messagesResponse = await axios.get(
                    `http://localhost:8000/api/sma/messages/${convResponse.data._id}`,
                    { withCredentials: true }
                );
                setMessages(messagesResponse.data);

                // Mark messages as read
                await axios.put(
                    `http://localhost:8000/api/sma/messages/${convResponse.data._id}/read`,
                    {},
                    { withCredentials: true }
                );

            } catch (error) {
                console.error('Error initializing chat:', error);
            } finally {
                setLoading(false);
            }
        };

        if (recipientId) {
            initializeChat();
        }
    }, [recipientId]);

    // Join conversation room and handle socket events
    useEffect(() => {
        if (!socket || !conversation) return;

        socket.emit('join_conversation', conversation._id);

        const handleNewMessage = (message) => {
            setMessages(prev => [...prev, message]);
            
            // Mark as read if message is from other user
            if (message.sender._id === recipientId) {
                socket.emit('mark_read', {
                    conversationId: conversation._id,
                    senderId: recipientId
                });
            }
        };

        const handleUserTyping = ({ userId, isTyping: typing }) => {
            if (userId === recipientId) {
                setIsTyping(typing);
            }
        };

        const handleMessagesRead = ({ conversationId }) => {
            if (conversationId === conversation._id) {
                setMessages(prev => prev.map(msg => ({ ...msg, read: true })));
            }
        };

        socket.on('new_message', handleNewMessage);
        socket.on('user_typing', handleUserTyping);
        socket.on('messages_read', handleMessagesRead);

        return () => {
            socket.emit('leave_conversation', conversation._id);
            socket.off('new_message', handleNewMessage);
            socket.off('user_typing', handleUserTyping);
            socket.off('messages_read', handleMessagesRead);
        };
    }, [socket, conversation, recipientId]);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleTyping = () => {
        if (!socket || !conversation) return;

        socket.emit('typing', { conversationId: conversation._id, isTyping: true });

        if (typingTimeout) clearTimeout(typingTimeout);

        const timeout = setTimeout(() => {
            socket.emit('typing', { conversationId: conversation._id, isTyping: false });
        }, 2000);

        setTypingTimeout(timeout);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        
        if (!newMessage.trim() || !socket || !conversation) return;

        socket.emit('send_message', {
            conversationId: conversation._id,
            content: newMessage.trim(),
            receiverId: recipientId
        });

        socket.emit('typing', { conversationId: conversation._id, isTyping: false });
        setNewMessage('');
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date) => {
        const msgDate = new Date(date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (msgDate.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (msgDate.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }
        return msgDate.toLocaleDateString();
    };

    const groupMessagesByDate = (messages) => {
        const groups = {};
        messages.forEach(msg => {
            const date = formatDate(msg.createdAt);
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(msg);
        });
        return groups;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const groupedMessages = groupMessagesByDate(messages);

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 bg-white border-b shadow-sm">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => navigate('/chat')}
                    className="md:hidden"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                
                <div className="relative">
                    <Avatar className="h-10 w-10">
                        <AvatarImage 
                            src={recipient?.profileImage ? `http://localhost:8000/uploads/${recipient.profileImage}` : ''} 
                        />
                        <AvatarFallback>{recipient?.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {isUserOnline(recipientId) && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                </div>
                
                <div className="flex-1">
                    <h2 className="font-semibold text-gray-900">{recipient?.username}</h2>
                    <p className="text-sm text-gray-500">
                        {isTyping ? (
                            <span className="text-blue-500">typing...</span>
                        ) : isUserOnline(recipientId) ? (
                            <span className="text-green-500">Online</span>
                        ) : (
                            'Offline'
                        )}
                    </p>
                </div>

                <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {Object.entries(groupedMessages).map(([date, msgs]) => (
                    <div key={date}>
                        <div className="flex justify-center mb-4">
                            <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                                {date}
                            </span>
                        </div>
                        
                        {msgs.map((message, index) => {
                            const isOwn = message.sender._id === currentUser?._id;
                            return (
                                <div
                                    key={message._id || index}
                                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}
                                >
                                    <div className={`flex items-end gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                                        {!isOwn && (
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage 
                                                    src={message.sender.profileImage ? `http://localhost:8000/uploads/${message.sender.profileImage}` : ''} 
                                                />
                                                <AvatarFallback>{message.sender.username?.[0]?.toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                        )}
                                        
                                        <div
                                            className={`px-4 py-2 rounded-2xl ${
                                                isOwn
                                                    ? 'bg-blue-500 text-white rounded-br-md'
                                                    : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                                            }`}
                                        >
                                            <p className="text-sm break-words">{message.content}</p>
                                            <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : ''}`}>
                                                <span className={`text-xs ${isOwn ? 'text-blue-100' : 'text-gray-400'}`}>
                                                    {formatTime(message.createdAt)}
                                                </span>
                                                {isOwn && (
                                                    message.read ? (
                                                        <CheckCheck className="h-3 w-3 text-blue-100" />
                                                    ) : (
                                                        <Check className="h-3 w-3 text-blue-100" />
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 bg-white border-t">
                <div className="flex items-center gap-2">
                    <Input
                        ref={inputRef}
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => {
                            setNewMessage(e.target.value);
                            handleTyping();
                        }}
                        className="flex-1 rounded-full bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-blue-500"
                    />
                    <Button 
                        type="submit" 
                        size="icon" 
                        className="rounded-full bg-blue-500 hover:bg-blue-600"
                        disabled={!newMessage.trim()}
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ChatRoom;
