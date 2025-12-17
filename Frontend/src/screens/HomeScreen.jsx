import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'

const HomeScreen = () => {
    const [data, setData] = useState([]);
    const [featuredPost, setFeaturedPost] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getAllPosts = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/blogs/allPosts", { withCredentials: true });
                setData(response.data);
                console.log(response.data);

                const randomIndex = Math.floor(Math.random() * response.data.length);
                setFeaturedPost(response.data[randomIndex]);
            } catch (err) {
                console.error(err);
            }
        };
        getAllPosts();

    }, []);

    useEffect(() => {
        const getUserbyID = async () => {
            try {
                if (featuredPost && featuredPost.author) {
                    const response = await axios.get(`http://localhost:8000/api/blogs/getUseById/${featuredPost.author}`, { withCredentials: true });
                    setUser(response.data);
                    console.log(response.data);
                }
            } catch (err) {
                console.error(err);
            }
        };

        getUserbyID();
    }, [featuredPost]);

    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`);
    };

    return (
        <div className="min-h-screen">
            {/* Featured Article */}
            <section className="container mx-auto px-4 py-12">
                {featuredPost && (
                    <Card
                        className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => handlePostClick(featuredPost._id)}
                    >
                        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                            <div className="relative aspect-[4/3] md:aspect-square w-full">
                                <img
                                    src={`http://localhost:8000${featuredPost.image}`}
                                    alt={featuredPost.title}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className="p-6 flex flex-col justify-center">
                                <div className="text-sm font-semibold text-blue-600 mb-2">FEATURED ARTICLE</div>
                                <h1 className="text-3xl font-bold mb-4 text-gray-900">{featuredPost.title}</h1>
                                <p className="text-gray-600 text-sm mb-4">
                                    {user?.username} • {featuredPost.date}
                                </p>
                                <p className="text-gray-700">{featuredPost.description}</p>
                            </div>
                        </div>
                    </Card>
                )}
            </section>

            {/* Editor's Picks */}
            <section className="container mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold mb-8 text-gray-900">Editor's Picks</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {data.map((post) => (
                        <Card
                            key={post._id}
                            className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => handlePostClick(post._id)}
                        >
                            <CardContent className="p-0">
                                <div className="relative aspect-[3/2] w-full">
                                    <img
                                        src={`http://localhost:8000${post.image}`}
                                        alt={post.title}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-gray-900">{post.title}</h3>
                                    <p className="text-sm text-gray-600">
                                        {user?.username} • {post.date}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">{post.readTime}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomeScreen;