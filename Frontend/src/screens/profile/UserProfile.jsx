"use client"

import { Globe, Instagram, Twitter, MapPin, Link2, ArrowLeft, Grid3X3, Calendar } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import PostCard from "@/components/PostCard"

const UserProfile = () => {
    const { userId } = useParams()
    const [user, setUser] = useState({})
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [isFollowing, setIsFollowing] = useState(false)
    const [isLoadingFollow, setIsLoadingFollow] = useState(false)
    const [currentUserId, setCurrentUserId] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true)
                const [userRes, postsRes, followRes, currentUserRes] = await Promise.all([
                    axios.get(`http://localhost:8000/api/sma/getUseById/${userId}`),
                    axios.get(`http://localhost:8000/api/sma/getPostsByUserId/${userId}`),
                    axios.get(`http://localhost:8000/api/sma/checkFollowing/${userId}`, { withCredentials: true }).catch(() => ({ data: { following: false } })),
                    axios.get(`http://localhost:8000/api/sma/getUser`, { withCredentials: true }).catch(() => ({ data: { _id: null } }))
                ])
                setUser(userRes.data)
                setPosts(postsRes.data)
                setIsFollowing(followRes.data.following)
                setCurrentUserId(currentUserRes.data._id)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        if (userId) {
            fetchUserData()
        }
    }, [userId])

    // Refetch user data when follow status changes
    useEffect(() => {
        const refetchUserStats = async () => {
            try {
                const userRes = await axios.get(`http://localhost:8000/api/sma/getUseById/${userId}`)
                setUser(userRes.data)
            } catch (err) {
                console.error("Error refetching user stats:", err)
            }
        }

        // Only refetch if isFollowing has actually changed after initial load
        if (loading === false && userId) {
            refetchUserStats()
        }
    }, [isFollowing, userId])

    const handleCardClick = (postId) => {
        navigate(`/post/${postId}`)
    }

    const handleFollow = async () => {
        try {
            setIsLoadingFollow(true)
            if (isFollowing) {
                await axios.post(`http://localhost:8000/api/sma/unfollow/${userId}`, {}, { withCredentials: true })
            } else {
                await axios.post(`http://localhost:8000/api/sma/follow/${userId}`, {}, { withCredentials: true })
            }
            setIsFollowing(!isFollowing)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoadingFollow(false)
        }
    }

    if (loading) {
        return (
            <section className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-32 h-32 bg-gray-300 rounded-full" />
                    <div className="h-6 w-48 bg-gray-300 rounded" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                </div>
            </section>
        )
    }

    if (!user) {
        return (
            <section className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
                <Card className="p-8 text-center">
                    <h2 className="text-xl font-semibold text-gray-700">User not found</h2>
                    <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
                </Card>
            </section>
        )
    }

    return (
        <section className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Cover Image */}
            <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi00LTJjMCAwLTItMi0yLTRzMi00IDItNCAyIDIgNCAyYzAgMCAyIDIgMiA0cy0yIDQtMiA0LTIgMi00IDJjMCAwLTItMi0yLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
                
                {/* Back Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
            </div>

            {/* Profile Header */}
            <div className="relative max-w-4xl mx-auto px-4">
                <Card className="relative -mt-20 border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                    <div className="p-6 md:p-8">
                        {/* Avatar & Basic Info */}
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                            <div className="relative -mt-20 md:-mt-24">
                                <Avatar className="w-32 h-32 md:w-40 md:h-40 ring-4 ring-white shadow-2xl">
                                    <AvatarImage 
                                        src={user.profileImage ? `http://localhost:8000/uploads/${user.profileImage}` : undefined} 
                                        alt={user.username} 
                                    />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-4xl font-bold">
                                        {user.username?.[0]?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center gap-3">
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                        {user.username}
                                    </h1>
                                    <span className="text-gray-500 font-medium">@{user.username}</span>
                                </div>
                                <p className="mt-2 text-gray-600 max-w-lg">
                                    {user.bio || `Welcome to ${user.username}'s profile. Check out their posts and content! ✨`}
                                </p>
                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-3 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        Earth
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        Member
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button 
                                    onClick={handleFollow}
                                    disabled={isLoadingFollow}
                                    className={`rounded-full px-6 ${
                                        isFollowing 
                                            ? 'bg-gray-300 hover:bg-gray-400 text-gray-800' 
                                            : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
                                    }`}
                                >
                                    {isLoadingFollow ? 'Loading...' : (isFollowing ? 'Following' : 'Follow')}
                                </Button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex justify-center md:justify-start gap-8 mt-6 pt-6 border-t border-gray-100">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
                                <div className="text-sm text-gray-500">Posts</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{user.followers?.length || 0}</div>
                                <div className="text-sm text-gray-500">Followers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{user.following?.length || 0}</div>
                                <div className="text-sm text-gray-500">Following</div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex justify-center md:justify-start gap-2 mt-4">
                            {user.website && (
                                <a
                                    href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 hover:bg-blue-50 hover:text-blue-600 transition-all rounded-full"
                                    >
                                        <Globe className="h-4 w-4" />
                                    </Button>
                                </a>
                            )}
                            {user.instagram && (
                                <a
                                    href={user.instagram.startsWith('http') ? user.instagram : `https://${user.instagram}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 hover:bg-pink-50 hover:text-pink-600 transition-all rounded-full"
                                    >
                                        <Instagram className="h-4 w-4" />
                                    </Button>
                                </a>
                            )}
                            {user.twitter && (
                                <a
                                    href={user.twitter.startsWith('http') ? user.twitter : `https://${user.twitter}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 hover:bg-blue-50 hover:text-blue-400 transition-all rounded-full"
                                    >
                                        <Twitter className="h-4 w-4" />
                                    </Button>
                                </a>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Posts Section */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="flex items-center gap-2 mb-6">
                    <Grid3X3 className="h-5 w-5 text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-800">Posts</h2>
                    <span className="text-sm text-gray-500">({posts.length})</span>
                </div>

                {/* Posts Feed */}
                <div className="flex flex-col gap-4">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <PostCard 
                                key={post._id} 
                                post={post} 
                                username={user.username} 
                                authorId={post.author}
                                currentUserId={currentUserId}
                                onClick={() => handleCardClick(post._id)}
                                onPostDeleted={() => {
                                    setPosts(posts.filter(p => p._id !== post._id))
                                }}
                            />
                        ))
                    ) : (
                        <Card className="p-12 text-center border-0 bg-white/80 backdrop-blur-sm">
                            <div className="text-gray-400 mb-2">
                                <Grid3X3 className="h-12 w-12 mx-auto opacity-50" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700">No posts yet</h3>
                            <p className="text-gray-500 text-sm mt-1">{user.username} hasn't posted anything yet</p>
                        </Card>
                    )}
                </div>
            </div>
        </section>
    )
}

export default UserProfile
