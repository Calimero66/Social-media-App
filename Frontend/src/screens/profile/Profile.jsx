"use client"

import { Globe, Instagram, Twitter, MapPin, Link2, Settings, Grid3X3, Bookmark, Heart } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import CreatePost from "@/components/CreatePost"
import PostCard from "@/components/PostCard"
import SettingsModal from "@/components/SettingsModal"
import { Toaster } from "sonner"

const Profile = () => {
    const [data, setData] = useState({})
    const [posts, setPosts] = useState([])
    const [likedPosts, setLikedPosts] = useState([])
    const [activeTab, setActiveTab] = useState("posts")
    const [showSettings, setShowSettings] = useState(false)
    const navigate = useNavigate()

    const fetchPosts = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/sma/getMyPosts", { withCredentials: true })
            setPosts(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    const fetchLikedPosts = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/sma/getLikedPosts", { withCredentials: true })
            setLikedPosts(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/sma/getUser", { withCredentials: true })
                setData(response.data)
            } catch (err) {
                console.error(err)
            }
        }

        getUser()
        fetchPosts()
        fetchLikedPosts()
    }, [])

    const handleCardClick = (postId) => {
        navigate(`/post/${postId}`)
    }

    const handleProfileUpdate = (updatedData) => {
        setData(updatedData)
    }

    return (
        <>
            <section className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
                {/* Cover Image */}
                <div className="relative h-48 md:h-64 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi00LTJjMCAwLTItMi0yLTRzMi00IDItNCAyIDIgNCAyYzAgMCAyIDIgMiA0cy0yIDQtMiA0LTIgMi00IDJjMCAwLTItMi0yLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
                </div>

                {/* Profile Header */}
                <div className="relative max-w-4xl mx-auto px-4">
                    <Card className="relative -mt-20 border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                        <div className="p-6 md:p-8">
                            {/* Avatar & Basic Info */}
                            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                                <div className="relative -mt-20 md:-mt-24">
                                    <Avatar className="w-32 h-32 md:w-40 md:h-40 ring-4 ring-white shadow-2xl">
                                        <AvatarImage src="https://github.com/shadcn.png" alt={data.username} />
                                        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-4xl font-bold">
                                            {data.username?.[0]?.toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white" />
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                            {data.username}
                                        </h1>
                                        <span className="text-gray-500 font-medium">@{data.username}</span>
                                    </div>
                                    <p className="mt-2 text-gray-600 max-w-lg">
                                        Welcome to My Page, a space where ideas, experiences, and insights come to life. ✨
                                    </p>
                                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-3 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            Earth
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Link2 className="h-4 w-4" />
                                            mywebsite.com
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="icon" 
                                        className="rounded-full"
                                        onClick={() => setShowSettings(true)}
                                    >
                                        <Settings className="h-4 w-4" />
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
                                    <div className="text-2xl font-bold text-gray-900">{data.followers?.length || 0}</div>
                                    <div className="text-sm text-gray-500">Followers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">{data.following?.length || 0}</div>
                                    <div className="text-sm text-gray-500">Following</div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="flex justify-center md:justify-start gap-2 mt-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 hover:bg-blue-50 hover:text-blue-600 transition-all rounded-full"
                                >
                                    <Globe className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 hover:bg-pink-50 hover:text-pink-600 transition-all rounded-full"
                                >
                                    <Instagram className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 hover:bg-blue-50 hover:text-blue-400 transition-all rounded-full"
                                >
                                    <Twitter className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Content Tabs */}
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <Tabs defaultValue="posts" className="w-full" onValueChange={setActiveTab}>
                        <TabsList className="w-full justify-start bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-sm mb-6">
                            <TabsTrigger 
                                value="posts" 
                                className="flex-1 md:flex-none gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg"
                            >
                                <Grid3X3 className="h-4 w-4" />
                                Posts
                            </TabsTrigger>
                            <TabsTrigger 
                                value="saved" 
                                className="flex-1 md:flex-none gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg"
                            >
                                <Bookmark className="h-4 w-4" />
                                Saved
                            </TabsTrigger>
                            <TabsTrigger 
                                value="liked" 
                                className="flex-1 md:flex-none gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg"
                            >
                                <Heart className="h-4 w-4" />
                                Liked
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="posts" className="mt-0">
                            {/* Post Creation */}
                            <div className="mb-6">
                                <CreatePost username={data.username} onPostCreated={fetchPosts} />
                            </div>

                            {/* Posts Feed */}
                            <div className="flex flex-col gap-4">
                                {posts.filter(post => post !== null).length > 0 ? (
                                    posts.filter(post => post !== null).map((post) => (
                                        <PostCard 
                                            key={post._id} 
                                            post={post} 
                                            username={data.username} 
                                            authorId={post.author}
                                            currentUserId={data._id}
                                            onClick={() => handleCardClick(post._id)}
                                            onPostDeleted={fetchPosts}
                                        />
                                    ))
                                ) : (
                                    <Card className="p-12 text-center border-0 bg-white/80 backdrop-blur-sm">
                                        <div className="text-gray-400 mb-2">
                                            <Grid3X3 className="h-12 w-12 mx-auto opacity-50" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-700">No posts yet</h3>
                                        <p className="text-gray-500 text-sm mt-1">Share your first post with the world!</p>
                                    </Card>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="saved" className="mt-0">
                            <Card className="p-12 text-center border-0 bg-white/80 backdrop-blur-sm">
                                <div className="text-gray-400 mb-2">
                                    <Bookmark className="h-12 w-12 mx-auto opacity-50" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700">No saved posts</h3>
                                <p className="text-gray-500 text-sm mt-1">Posts you save will appear here</p>
                            </Card>
                        </TabsContent>

                        <TabsContent value="liked" className="mt-0">
                            {/* Liked Posts Feed */}
                            <div className="flex flex-col gap-4">
                                {likedPosts.filter(post => post !== null).length > 0 ? (
                                    likedPosts.filter(post => post !== null).map((post) => (
                                        <PostCard 
                                            key={post._id} 
                                            post={post} 
                                            username={data.username} 
                                            authorId={post.author}
                                            currentUserId={data._id}
                                            onClick={() => handleCardClick(post._id)}
                                            onPostDeleted={fetchLikedPosts}
                                        />
                                    ))
                                ) : (
                                    <Card className="p-12 text-center border-0 bg-white/80 backdrop-blur-sm">
                                        <div className="text-gray-400 mb-2">
                                            <Heart className="h-12 w-12 mx-auto opacity-50" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-700">No liked posts</h3>
                                        <p className="text-gray-500 text-sm mt-1">Posts you like will appear here</p>
                                    </Card>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>

            <SettingsModal 
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                userData={data}
                onSave={handleProfileUpdate}
            />

            <Toaster position="top-right" richColors />
        </>
    )
}

export default Profile
