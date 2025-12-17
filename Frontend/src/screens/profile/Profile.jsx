import { Globe, Instagram, Twitter } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Profile = () => {
    const [data, setData] = useState([]);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/blogs/getUser", { withCredentials: true });
                setData(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        const getMyPosts = async () => {
            const res = await axios.get("http://localhost:8000/api/blogs/getMyPosts", { withCredentials: true });
            setPosts(res.data);
        }

        getUser();
        getMyPosts();
    }, [])

    const handleCardClick = (postId) => {
        // console.log(postId);
        navigate(`/post/${postId}`);
    };

    return (
        <>
            <section className="flex flex-col items-center justify-start min-h-screen pt-6 ">
                <div className="text-center max-w-2xl">
                    <Avatar className="w-32 h-32 mx-auto">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>AB</AvatarFallback>
                    </Avatar>
                    <h1 className="mt-4 text-3xl font-bold">{data.username}</h1>
                    <p className="text-gray-500">@{data.username}</p>
                    <p className="mt-4 text-gray-600">
                    Welcome to My Blog , a space where ideas, experiences, and insights come to life. Whether you're here for inspiration, knowledge, or just a good read, you'll find something that resonates with you. Join us as we explore diverse topics, share meaningful stories, and engage in thoughtful discussions. Your journey starts here!
                    </p>
                    <div className="flex justify-center gap-4 mt-4">
                        <Button variant="ghost" size="icon">
                            <Globe className="h-5 w-5" />
                            <span className="sr-only">Website</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Instagram className="h-5 w-5" />
                            <span className="sr-only">Instagram</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Twitter className="h-5 w-5" />
                            <span className="sr-only">Twitter</span>
                        </Button>
                    </div>
                </div>

                <div className="container py-8">
                    <div className="grid gap-8">
                        {/* Featured Article */}
                        {posts[0] && (
                            <Card 
                                className="grid md:grid-cols-2 gap-6 p-0 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => handleCardClick(posts[0]._id)}
                            >
                                <div className="relative aspect-[4/3] md:aspect-auto">
                                    <img
                                        src={`http://localhost:8000${posts[0].image}`}
                                        alt={posts[0].title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </div>
                                <CardContent className="p-6">
                                    <div className="flex gap-2 mb-2">
                                        {posts[0].tags && posts[0].tags[0] &&
                                            JSON.parse(posts[0].tags[0]).map((tag, index) => (
                                                <Badge key={index} variant="secondary">
                                                    {tag}
                                                </Badge>
                                            ))
                                        }
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">{posts[0].title}</h2>
                                    <p className="text-sm text-gray-500 mb-4">
                                        {posts[0].date ? new Date(posts[0].date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 'Date not available'}
                                    </p>
                                    <p className="text-gray-600">{posts[0].content}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Regular Articles */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.slice(1).map((post) => (
                                <Card 
                                    key={post._id} 
                                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                                    onClick={() => handleCardClick(post._id)}
                                >
                                    <div className="relative aspect-[3/2]">
                                        <img
                                            src={`http://localhost:8000${post.image}`}
                                            alt={post.title}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="flex gap-2 mb-2">
                                            {post.tags && post.tags[0] &&
                                                JSON.parse(post.tags[0]).map((tag, index) => (
                                                    <Badge key={index} variant="secondary">
                                                        {tag}
                                                    </Badge>
                                                ))
                                            }
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                                        <p className="text-sm text-gray-500 mb-4">
                                            {new Date(post.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-gray-600 line-clamp-3">{post.content}</p>
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