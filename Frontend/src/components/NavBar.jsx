import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import SearchBtn from "./SearchBtn"
import { Bell, UserPlus, Check, MessageCircle } from "lucide-react"

const NavBar = () => {
    const navigate = useNavigate()

    const [profile, setProfile] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [isNotificationOpen, setIsNotificationOpen] = useState(false)
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [unreadMessages, setUnreadMessages] = useState(0)

    const [data, setData] = useState([])
    const handleLogout = async () => {
        try {
            await axios.post(
                "http://localhost:8000/api/sma/logout",
                {},
                {
                    withCredentials: true,
                },
            )
            setProfile(false)
            setIsOpen(false)
            navigate("/login")
        } catch (err) {
            console.error(err)
        }
    }

    const fetchNotifications = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/sma/notifications", { withCredentials: true })
            setNotifications(response.data)
        } catch (err) {
            console.error(err)
        }
    }

    const fetchUnreadCount = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/sma/notifications/unread-count", { withCredentials: true })
            setUnreadCount(response.data.unreadCount)
        } catch (err) {
            console.error(err)
        }
    }

    const fetchUnreadMessages = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/sma/messages/unread/count", { withCredentials: true })
            setUnreadMessages(response.data.unreadCount)
        } catch (err) {
            console.error(err)
        }
    }

    const markAsRead = async (notificationId) => {
        try {
            await axios.put(`http://localhost:8000/api/sma/notifications/${notificationId}/read`, {}, { withCredentials: true })
            setNotifications(notifications.map(n => 
                n._id === notificationId ? { ...n, read: true } : n
            ))
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (err) {
            console.error(err)
        }
    }

    const markAllAsRead = async () => {
        try {
            await axios.put("http://localhost:8000/api/sma/notifications/mark-all-read", {}, { withCredentials: true })
            setNotifications(notifications.map(n => ({ ...n, read: true })))
            setUnreadCount(0)
        } catch (err) {
            console.error(err)
        }
    }

    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            markAsRead(notification._id)
        }
        if (notification.type === 'follow') {
            navigate(`/user/${notification.sender._id}`)
        }
        setIsNotificationOpen(false)
    }

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000)
        if (seconds < 60) return 'just now'
        const minutes = Math.floor(seconds / 60)
        if (minutes < 60) return `${minutes}m ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h ago`
        const days = Math.floor(hours / 24)
        if (days < 7) return `${days}d ago`
        return new Date(date).toLocaleDateString()
    }

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/sma/getUser", { withCredentials: true })
                setData(response.data)
                console.log(response.data)
            } catch (err) {
                console.error(err)
            }
        }

        getUser()
    }, [])

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                await axios.get("http://localhost:8000/api/sma/isAuthenticated", {
                    withCredentials: true,
                })
                setProfile(true)
                setLoading(false)
                // Fetch notifications when authenticated
                fetchNotifications()
                fetchUnreadCount()
                fetchUnreadMessages()
            } catch (err) {
                console.error(err)
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    // Poll for new notifications and messages every 30 seconds
    useEffect(() => {
        if (profile) {
            const interval = setInterval(() => {
                fetchUnreadCount()
                fetchUnreadMessages()
            }, 30000)
            return () => clearInterval(interval)
        }
    }, [profile])

    useEffect(() => {
        const closeDropdown = (e) => {
            if (isOpen) setIsOpen(false)
            if (isNotificationOpen) setIsNotificationOpen(false)
        }

        document.addEventListener("click", closeDropdown)
        return () => document.removeEventListener("click", closeDropdown)
    }, [isOpen, isNotificationOpen])

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Left Section - Logo & Nav */}
                <div className="flex items-center gap-8">
                    <Link
                        to={profile ? "/home" : "/login"}
                        className="font-black text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                        FaceRam
                    </Link>

                    {profile && (
                        <nav className="hidden md:flex items-center gap-1">
                            <Link
                                to="/home"
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                to="/about"
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                About
                            </Link>
                        </nav>
                    )}
                </div>

                {/* Right Section - Search, Profile, or Auth Buttons */}
                {profile ? (
                    <div className="flex items-center gap-4">
                        <SearchBtn />

                        {/* Chat Button */}
                        <Link
                            to="/chat"
                            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
                        >
                            <MessageCircle className="h-5 w-5" />
                            {unreadMessages > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 flex items-center justify-center text-xs font-bold text-white bg-blue-500 rounded-full">
                                    {unreadMessages > 9 ? '9+' : unreadMessages}
                                </span>
                            )}
                        </Link>

                        {/* Notification Bell */}
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setIsNotificationOpen(!isNotificationOpen)
                                    setIsOpen(false)
                                    if (!isNotificationOpen) {
                                        fetchNotifications()
                                    }
                                }}
                                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
                            >
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 h-5 w-5 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {isNotificationOpen && (
                                <div className="absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl bg-white ring-1 ring-black/5 focus:outline-none z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="py-2">
                                        {/* Header */}
                                        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        markAllAsRead()
                                                    }}
                                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                                >
                                                    <Check className="h-3 w-3" />
                                                    Mark all read
                                                </button>
                                            )}
                                        </div>

                                        {/* Notifications List */}
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map((notification) => (
                                                    <div
                                                        key={notification._id}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleNotificationClick(notification)
                                                        }}
                                                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${
                                                            notification.read 
                                                                ? 'bg-white hover:bg-gray-50' 
                                                                : 'bg-blue-50 hover:bg-blue-100'
                                                        }`}
                                                    >
                                                        <Avatar className="h-10 w-10 flex-shrink-0">
                                                            <AvatarImage 
                                                                src={notification.sender?.profileImage ? `http://localhost:8000/uploads/${notification.sender.profileImage}` : undefined}
                                                                alt={notification.sender?.username}
                                                            />
                                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm">
                                                                {notification.sender?.username?.[0]?.toUpperCase() || 'U'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm text-gray-900">
                                                                <span className="font-semibold">{notification.sender?.username}</span>
                                                                {notification.type === 'follow' && ' started following you'}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-0.5">
                                                                {getTimeAgo(notification.createdAt)}
                                                            </p>
                                                        </div>
                                                        {notification.type === 'follow' && (
                                                            <UserPlus className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                                        )}
                                                        {!notification.read && (
                                                            <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0" />
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-4 py-8 text-center text-gray-500">
                                                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                    <p className="text-sm">No notifications yet</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setIsOpen(!isOpen)
                                    setIsNotificationOpen(false)
                                }}
                                className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full transition-all hover:scale-105"
                            >
                                <Avatar className="h-9 w-9 border-2 border-gray-200 hover:border-blue-500 transition-colors">
                                    <AvatarImage 
                                        src={data.profileImage ? `http://localhost:8000/uploads/${data.profileImage}` : undefined} 
                                        alt={data.username} 
                                    />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                                        {data.username ? data.username.substring(0, 2).toUpperCase() : "CN"}
                                    </AvatarFallback>
                                </Avatar>
                            </button>

                            {isOpen && (
                                <div className="absolute right-0 mt-3 w-64 rounded-2xl shadow-2xl bg-white ring-1 ring-black/5 focus:outline-none z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="py-2">
                                        {/* User Info Header */}
                                        <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                                            <p className="text-sm font-bold text-gray-900">{data.username}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">@{data.username}</p>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-1">
                                            <Link
                                                to="/profile"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    />
                                                </svg>
                                                Profile
                                            </Link>
                                        </div>

                                        {/* Logout */}
                                        <div className="border-t border-gray-100 mt-1">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                    />
                                                </svg>
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : loading ? (
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="h-2 w-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="h-2 w-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <SearchBtn />
                        <div className="flex items-center gap-2">
                            <Link to="/login">
                                <Button
                                    variant="ghost"
                                    className="text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                                >
                                    Login
                                </Button>
                            </Link>
                            <Link to="/Register">
                                <Button className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}

export default NavBar