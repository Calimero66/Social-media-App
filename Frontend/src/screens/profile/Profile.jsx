import { Globe, Instagram, Twitter } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import CreatePost from "@/components/CreatePost"

const Profile = () => {
    const [data, setData] = useState([])
    const [posts, setPosts] = useState([])
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
                        Welcome to My Page, a space where ideas, experiences, and insights come to life. Whether you're here for
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
                    <CreatePost username={data.username} />

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
        </>
    )
}

export default Profile