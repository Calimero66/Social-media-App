import { Globe, Instagram, Twitter, ImageIcon, Video, Smile, X } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Profile = () => {
    const [data, setData] = useState([])
    const [posts, setPosts] = useState([])
    const [isPostModalOpen, setIsPostModalOpen] = useState(false)
    const [postContent, setPostContent] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/sma/getUser", { withCredentials: true })
                setData(response.data)
            } catch (err) {
                console.error(err)
            }
        }

        const getMyPosts = async () => {
            const res = await axios.get("http://localhost:8000/api/sma/getMyPosts", { withCredentials: true })
            setPosts(res.data)
        }

        getUser()
        getMyPosts()
    }, [])

    const handleCardClick = (postId) => {
        navigate(`/post/${postId}`)
    }

    return (
        <>
            <section className="flex flex-col items-center justify-start min-h-screen pt-6 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
                {/* Profile Header */}
                <div className="text-center max-w-2xl mb-8">
                    <div className="relative inline-block">
                        <Avatar className="w-32 h-32 mx-auto ring-4 ring-white shadow-xl">
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-3xl font-bold">
                                {data.username?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-4 border-white shadow-lg"></div>
                    </div>
                    <h1 className="mt-6 text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {data.username}
                    </h1>
                    <p className="text-gray-500 text-lg">@{data.username}</p>
                    <p className="mt-4 text-gray-600 leading-relaxed px-4">
                        Welcome to My Blog, a space where ideas, experiences, and insights come to life. Whether you're here for
                        inspiration, knowledge, or just a good read, you'll find something that resonates with you.
                    </p>
                    <div className="flex justify-center gap-2 mt-6">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-blue-100 hover:text-blue-600 transition-all rounded-full"
                        >
                            <Globe className="h-5 w-5" />
                            <span className="sr-only">Website</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-pink-100 hover:text-pink-600 transition-all rounded-full"
                        >
                            <Instagram className="h-5 w-5" />
                            <span className="sr-only">Instagram</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-blue-100 hover:text-blue-400 transition-all rounded-full"
                        >
                            <Twitter className="h-5 w-5" />
                            <span className="sr-only">Twitter</span>
                        </Button>
                    </div>
                </div>

                <div className="container py-8 max-w-6xl">
                    {/* Post Creation Section */}
                    <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="w-12 h-12 ring-2 ring-blue-100">
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                                        {data.username?.[0]?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <button
                                    onClick={() => setIsPostModalOpen(true)}
                                    className="flex-1 text-left px-5 py-3 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-all cursor-pointer"
                                >
                                    What's on your mind, {data.username}?
                                </button>
                            </div>
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                                <Button variant="ghost" className="flex-1 gap-2 hover:bg-red-50 hover:text-red-600 transition-all">
                                    <Video className="h-5 w-5 text-red-500" />
                                    <span>Video</span>
                                </Button>
                                <Button variant="ghost" className="flex-1 gap-2 hover:bg-green-50 hover:text-green-600 transition-all">
                                    <ImageIcon className="h-5 w-5 text-green-500" />
                                    <span>Photo</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="flex-1 gap-2 hover:bg-yellow-50 hover:text-yellow-600 transition-all"
                                >
                                    <Smile className="h-5 w-5 text-yellow-500" />
                                    <span>Feeling</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-8">
                        {/* Featured Article */}
                        {posts[0] && (
                            <Card
                                className="grid md:grid-cols-2 gap-6 p-0 overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm transform hover:-translate-y-1"
                                onClick={() => handleCardClick(posts[0]._id)}
                            >
                                <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
                                    <img
                                        src={`http://localhost:8000${posts[0].image}`}
                                        alt={posts[0].title}
                                        className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                </div>
                                <CardContent className="p-6">
                                    <div className="flex gap-2 mb-3 flex-wrap">
                                        {posts[0].tags &&
                                            posts[0].tags[0] &&
                                            JSON.parse(posts[0].tags[0]).map((tag, index) => (
                                                <Badge key={index} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                                                    {tag}
                                                </Badge>
                                            ))}
                                    </div>
                                    <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        {posts[0].title}
                                    </h2>
                                    <p className="text-sm text-gray-500 mb-4">
                                        {posts[0].date
                                            ? new Date(posts[0].date).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })
                                            : "Date not available"}
                                    </p>
                                    <p className="text-gray-600 leading-relaxed">{posts[0].content}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Regular Articles */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.slice(1).map((post) => (
                                <Card
                                    key={post._id}
                                    className="overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm transform hover:-translate-y-1"
                                    onClick={() => handleCardClick(post._id)}
                                >
                                    <div className="relative aspect-[3/2] overflow-hidden">
                                        <img
                                            src={`http://localhost:8000${post.image}`}
                                            alt={post.title}
                                            className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="flex gap-2 mb-3 flex-wrap">
                                            {post.tags &&
                                                post.tags[0] &&
                                                JSON.parse(post.tags[0]).map((tag, index) => (
                                                    <Badge
                                                        key={index}
                                                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0"
                                                    >
                                                        {tag}
                                                    </Badge>
                                                ))}
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 text-gray-800">{post.title}</h3>
                                        <p className="text-sm text-gray-500 mb-4">
                                            {new Date(post.date).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                        <p className="text-gray-600 line-clamp-3 leading-relaxed">{post.content}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Create Post Modal */}
            {isPostModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-xl font-bold text-gray-800">Create Post</h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsPostModalOpen(false)}
                                className="rounded-full hover:bg-gray-100"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-4 max-h-[60vh] overflow-y-auto">
                            <div className="flex items-center gap-3 mb-4">
                                <Avatar className="w-10 h-10 ring-2 ring-blue-100">
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                                        {data.username?.[0]?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-gray-800">{data.username}</p>
                                </div>
                            </div>

                            <textarea
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                placeholder={`What's on your mind, ${data.username}?`}
                                className="w-full min-h-[150px] p-4 text-lg resize-none focus:outline-none text-gray-800 placeholder-gray-400"
                                autoFocus
                            />

                            <div className="border border-gray-200 rounded-xl p-4 mt-4">
                                <p className="text-sm font-semibold text-gray-800 mb-3">Add to your post</p>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="hover:bg-green-50 rounded-full">
                                        <ImageIcon className="h-6 w-6 text-green-500" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="hover:bg-red-50 rounded-full">
                                        <Video className="h-6 w-6 text-red-500" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="hover:bg-yellow-50 rounded-full">
                                        <Smile className="h-6 w-6 text-yellow-500" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t">
                            <Button
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all"
                                disabled={!postContent.trim()}
                            >
                                Post
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Profile