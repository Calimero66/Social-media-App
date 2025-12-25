import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '@/context/SocketContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MessageSquarePlus, ArrowLeft } from 'lucide-react';

const ChatList = () => {
    const navigate = useNavigate();
    const { isUserOnline, socket } = useSocket();

    const [conversations, setConversations] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [showNewChat, setShowNewChat] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Fetch current user
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

    // Fetch conversations
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8000/api/sma/conversations', {
                    withCredentials: true
                });
                setConversations(response.data);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, []);

    // Fetch all users for new chat
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/sma/allUsers', {
                    withCredentials: true
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    // Listen for new messages to update conversation list
    useEffect(() => {
        if (!socket) return;

        const handleMessageNotification = ({ conversationId, message }) => {
            setConversations(prev => {
                const updated = prev.map(conv => {
                    if (conv._id === conversationId) {
                        return {
                            ...conv,
                            lastMessage: message,
                            unreadCount: (conv.unreadCount || 0) + 1,
                            updatedAt: new Date().toISOString()
                        };
                    }
                    return conv;
                });
                // Sort by updatedAt
                return updated.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            });
        };

        socket.on('message_notification', handleMessageNotification);

        return () => {
            socket.off('message_notification', handleMessageNotification);
        };
    }, [socket]);

    const getOtherParticipant = (conversation) => {
        return conversation.participants.find(p => p._id !== currentUser?._id);
    };

    const formatTime = (date) => {
        if (!date) return '';
        const msgDate = new Date(date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (msgDate.toDateString() === today.toDateString()) {
            return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (msgDate.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }
        return msgDate.toLocaleDateString();
    };

    const filteredConversations = conversations.filter(conv => {
        const otherUser = getOtherParticipant(conv);
        return otherUser?.username?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const filteredUsers = users.filter(user => 
        user._id !== currentUser?._id &&
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const startNewChat = (userId) => {
        navigate(`/chat/${userId}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <div className="p-4 bg-white border-b shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    {showNewChat ? (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setShowNewChat(false)}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    ) : (
                        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                    )}
                    
                    {!showNewChat && (
                        <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setShowNewChat(true)}
                            className="text-blue-500 hover:text-blue-600"
                        >
                            <MessageSquarePlus className="h-6 w-6" />
                        </Button>
                    )}
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder={showNewChat ? "Search users..." : "Search conversations..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-gray-100 border-0 rounded-full focus-visible:ring-1 focus-visible:ring-blue-500"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {showNewChat ? (
                    // New Chat - User List
                    <div className="divide-y">
                        {filteredUsers.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No users found
                            </div>
                        ) : (
                            filteredUsers.map(user => (
                                <div
                                    key={user._id}
                                    onClick={() => startNewChat(user._id)}
                                    className="flex items-center gap-3 p-4 hover:bg-gray-100 cursor-pointer transition-colors"
                                >
                                    <div className="relative">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage 
                                                src={user.profileImage ? `http://localhost:8000/uploads/${user.profileImage}` : ''} 
                                            />
                                            <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        {isUserOnline(user._id) && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{user.username}</h3>
                                        {user.bio && (
                                            <p className="text-sm text-gray-500 truncate">{user.bio}</p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    // Conversation List
                    <div className="divide-y">
                        {filteredConversations.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <MessageSquarePlus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>No conversations yet</p>
                                <Button 
                                    variant="link" 
                                    onClick={() => setShowNewChat(true)}
                                    className="text-blue-500"
                                >
                                    Start a new chat
                                </Button>
                            </div>
                        ) : (
                            filteredConversations.map(conversation => {
                                const otherUser = getOtherParticipant(conversation);
                                if (!otherUser) return null;
                                
                                return (
                                    <div
                                        key={conversation._id}
                                        onClick={() => navigate(`/chat/${otherUser._id}`)}
                                        className="flex items-center gap-3 p-4 hover:bg-gray-100 cursor-pointer transition-colors"
                                    >
                                        <div className="relative">
                                            <Avatar className="h-14 w-14">
                                                <AvatarImage 
                                                    src={otherUser.profileImage ? `http://localhost:8000/uploads/${otherUser.profileImage}` : ''} 
                                                />
                                                <AvatarFallback>{otherUser.username?.[0]?.toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            {isUserOnline(otherUser._id) && (
                                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-gray-900">{otherUser.username}</h3>
                                                <span className="text-xs text-gray-400">
                                                    {formatTime(conversation.lastMessage?.createdAt || conversation.updatedAt)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-500 truncate">
                                                    {conversation.lastMessage?.content || 'Start a conversation'}
                                                </p>
                                                {conversation.unreadCount > 0 && (
                                                    <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                        {conversation.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatList;
