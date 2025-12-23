import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "sonner"

const LikeButton = ({ postId, showCount = true, size = "default" }) => {
    const [likesCount, setLikesCount] = useState(0)
    const [isLiked, setIsLiked] = useState(false)
    const [isLiking, setIsLiking] = useState(false)

    useEffect(() => {
        const fetchLikesData = async () => {
            if (!postId) return
            try {
                const countRes = await axios.get(`http://localhost:8000/api/sma/likesCount/${postId}`)
                setLikesCount(countRes.data.likesCount)

                // Check if current user liked this post
                try {
                    const likedRes = await axios.get(`http://localhost:8000/api/sma/checkLiked/${postId}`, { withCredentials: true })
                    setIsLiked(likedRes.data.liked)
                } catch {
                    // User not logged in, that's okay
                    setIsLiked(false)
                }
            } catch (error) {
                console.error("Error fetching likes:", error)
            }
        }
        fetchLikesData()
    }, [postId])

    const handleLike = async (e) => {
        e.stopPropagation() // Prevent card click when clicking like button
        setIsLiking(true)
        try {
            const response = await axios.post(`http://localhost:8000/api/sma/likePost/${postId}`, {}, { withCredentials: true })
            setIsLiked(response.data.liked)
            setLikesCount(response.data.likesCount)
        } catch (error) {
            console.error("Error liking post:", error)
            if (error.response?.status === 401) {
                toast.error("Please login to like posts")
            } else {
                toast.error("Failed to like post")
            }
        } finally {
            setIsLiking(false)
        }
    }

    const sizeClasses = {
        small: "h-8 px-2 text-sm",
        default: "h-10 px-3",
        large: "h-12 px-4 text-lg"
    }

    return (
        <Button
            variant="ghost"
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-1.5 transition-all ${sizeClasses[size]} ${isLiked ? "text-red-500 hover:text-red-600 hover:bg-red-50" : "text-gray-600 hover:text-red-500 hover:bg-red-50"}`}
        >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
            {showCount && <span className="font-medium">{likesCount}</span>}
        </Button>
    )
}

export default LikeButton
