// Import statements remain the same
import { useRef, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TagsScreen = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [tags, setTags] = useState([]);
    const [filteredTags, setFilteredTags] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);


    useEffect(() => {
        const getAllTags = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/blogs/getTags", { withCredentials: true });
                setTags(response.data);
                setFilteredTags(response.data);
            } catch (err) {
                console.error("Error fetching tags:", err);
            }
        };
        getAllTags();
    }, []);

    useEffect(() => {
        if (!search.trim()) {
            setFilteredTags(tags);
            setPosts([]);
            return;
        }


        const filtered = tags.filter((tag) =>
            tag.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredTags(filtered);


        fetchPostsByTag(search);
    }, [search, tags]);


    const fetchPostsByTag = async (tag) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/api/blogs/getPostsByTag?tag=${tag}`, { withCredentials: true });
            setPosts(response.data);
        } catch (err) {
            console.error("Error fetching posts:", err);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 space-y-8 pt-60">

            <div className="relative">
                <Input
                    type="text"
                    placeholder="Find the topics you care about..."
                    className="w-full pl-4 pr-10 py-2 text-base rounded-full border-2 border-gray-200 focus:border-gray-400 focus:outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    ref={inputRef}
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>


            <div className="flex flex-wrap gap-2">
                {filteredTags.length > 0 && (
                    filteredTags.map((topic) => (
                        <Button
                            key={topic}
                            variant="outline"
                            className="rounded-full hover:bg-gray-100 transition-colors"
                            onClick={() => {
                                setSearch(topic);
                                inputRef.current?.focus();
                            }}
                        >
                            #{topic}
                        </Button>
                    ))
                )}
            </div>


            {(search.trim() || posts.length > 0) && (
                <div className="mt-4 p-4 border rounded-lg h-60 overflow-y-auto shadow ">
                    {loading ? (
                        <p className="text-center text-gray-500">Loading posts...</p>
                    ) : posts.length > 0 ? (
                        posts.map((post, index) => (
                            <div
                                key={index}
                                className="p-2 border-b last:border-none cursor-pointer hover:bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg "
                                onClick={() => navigate(`/post/${post._id}`)}
                            >

                                <h3 className="font-semibold text-lg">{post.title}</h3>
                                <p className="text-gray-600 text-sm">{post.content}</p>

                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No posts found</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default TagsScreen;
