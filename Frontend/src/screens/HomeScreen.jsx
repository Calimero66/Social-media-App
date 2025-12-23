import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Toaster } from "sonner"
import PostCard from "@/components/PostCard"

const HomeScreen = () => {
    const [posts, setPosts] = useState([])
    const [authors, setAuthors] = useState({})
    const navigate = useNavigate()

    const fetchPosts = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/sma/allPosts", { withCredentials: true })
            // Sort posts from newest to oldest
            const sortedPosts = response.data.sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            )
            setPosts(sortedPosts)

            // Get unique author IDs and fetch their info
            const authorIds = [...new Set(response.data.map((post) => post.author))]
            const authorPromises = authorIds.map((id) =>
                axios
                    .get(`http://localhost:8000/api/sma/getUseById/${id}`)
                    .then((res) => ({ id, username: res.data.username }))
                    .catch(() => ({ id, username: "Unknown" })),
            )
            const authorData = await Promise.all(authorPromises)
            const authorMap = {}
            authorData.forEach(({ id, username }) => {
                authorMap[id] = username
            })
            setAuthors(authorMap)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`)
    }

    return (
        <div className="min-h-screen bg-[#f0f2f5]">
            <div className="max-w-[680px] mx-auto px-4 py-6">
                {/* Posts Feed - single column like Facebook */}
                <div className="flex flex-col gap-4">
                    {posts.map((post) => (
                        <PostCard
                            key={post._id}
                            post={post}
                            username={authors[post.author] || "Loading..."}
                            onClick={() => handlePostClick(post._id)}
                        />
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <div className="text-gray-400 mb-2 text-5xl">📭</div>
                        <h3 className="text-lg font-semibold text-gray-700">No posts yet</h3>
                        <p className="text-gray-500 text-sm mt-1">Be the first to share something!</p>
                    </div>
                )}
            </div>
            <Toaster position="top-right" richColors />
        </div>
    )
}

export default HomeScreen
