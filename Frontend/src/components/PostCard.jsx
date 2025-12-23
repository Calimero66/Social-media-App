import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, MoreHorizontal, Calendar, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { toast } from "sonner"
import LikeButton from "./LikeButton"
import PostDetailModal from "./PostDetailModal"

const PostCard = ({ post, username, authorId, onClick, currentUserId, onPostDeleted }) => {
    const navigate = useNavigate()
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const menuRef = useRef(null)

    useEffect(() => {
        if (currentUserId) {
            setCurrentUser(currentUserId)
        }
    }, [currentUserId])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false)
            }
        }

        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [showMenu])
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const isAuthor = currentUser && authorId && currentUser === authorId

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/sma/deletePost/${post._id}`, { 
                withCredentials: true 
            })
            toast.success("Post deleted successfully")
            setShowMenu(false)
            if (onPostDeleted) onPostDeleted()
        } catch (err) {
            console.error(err)
            toast.error("Failed to delete post")
        }
    }

    const handleEdit = () => {
        setShowMenu(false)
        navigate(`/edit-post/${post._id}`)
    }

    return (
        <>
            <Card 
                className="group overflow-hidden border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div 
                            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={(e) => {
                                e.stopPropagation()
                                authorId && navigate(`/user/${authorId}`)
                            }}
                        >
                            <Avatar className="h-10 w-10 ring-2 ring-gray-100">
                                <AvatarImage src="https://github.com/shadcn.png" alt={username} />
                                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold">
                                    {username?.[0]?.toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-900 text-sm">{username}</span>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Calendar className="h-3 w-3" />
                                    <span>{formatDate(post.date)}</span>
                                </div>
                            </div>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity relative"
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowMenu(!showMenu)
                            }}
                        >
                            <MoreHorizontal className="h-4 w-4 text-gray-500" />
                        
                            {/* Dropdown Menu */}
                            {showMenu && isAuthor && (
                                <div 
                                    ref={menuRef}
                                    className="absolute top-full right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[150px] mt-1"
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleEdit()
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm text-gray-700 border-b border-gray-200"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                        Edit Post
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDelete()
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-sm text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete Post
                                    </button>
                                </div>
                            )}
                        </Button>
                </div>
            </CardHeader>

            <CardContent className="pb-3 cursor-pointer" onClick={() => setShowDetailModal(true)}>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {post.content}
                </p>

                {post.image && (
                    <div className="mt-3 rounded-xl overflow-hidden">
                        <img 
                            src={`http://localhost:8000${post.image}`} 
                            alt="Post" 
                            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                )}

                {post.video && (
                    <div className="mt-3 rounded-xl overflow-hidden">
                        <video 
                            src={`http://localhost:8000${post.video}`} 
                            controls 
                            className="w-full h-auto"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )}
            </CardContent>

            <CardFooter className="pt-0 border-t border-gray-50">
                <div className="flex items-center gap-4 w-full pt-3" onClick={(e) => e.stopPropagation()}>
                    <LikeButton postId={post._id} />
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 gap-1.5"
                        onClick={() => setShowDetailModal(true)}
                    >
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">Comment</span>
                    </Button>
                </div>
            </CardFooter>
            </Card>

            <PostDetailModal 
                postId={post._id}
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                onPostDeleted={() => {
                    setShowDetailModal(false)
                    onPostDeleted?.()
                }}
            />
        </>
    )
}

export default PostCard
