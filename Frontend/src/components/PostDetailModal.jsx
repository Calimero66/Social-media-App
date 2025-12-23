import { useState, useEffect, useRef } from "react"
import { X, Edit2, Trash2, MessageSquare, Send, Heart } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axios from "axios"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import EditPost from "../screens/EditPost"

const PostDetailModal = ({ postId, isOpen, onClose, onPostDeleted }) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [authorData, setAuthorData] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [comments, setComments] = useState([])
    const commentInputRef = useRef(null)
    const editCommentRef = useRef(null)
    const [editingCommentId, setEditingCommentId] = useState(null)
    const [isSubmittingComment, setIsSubmittingComment] = useState(false)
    const [likesCount, setLikesCount] = useState(0)
    const [isLiked, setIsLiked] = useState(false)
    const [isLiking, setIsLiking] = useState(false)
    const [isEditingPost, setIsEditingPost] = useState(false)

    useEffect(() => {
        if (!isOpen) return

        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/sma/getPost/${postId}`)
                setPost(response.data)
            } catch (error) {
                console.error("Error fetching post:", error.message)
            } finally {
                setLoading(false)
            }
        }

        const getAuthor = async () => {
            if (!post || !post.author) return
            try {
                const response = await axios.get(`http://localhost:8000/api/sma/getUseById/${post.author}`, {
                    withCredentials: true,
                })
                setAuthorData(response.data)
            } catch (err) {
                console.error("Error fetching author:", err)
            }
        }

        const getCurrentUser = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/sma/getUser`, { withCredentials: true })
                setCurrentUser(response.data)
            } catch (err) {
                console.error("Error fetching current user:", err)
            }
        }

        fetchPost()
        getCurrentUser()
    }, [isOpen, postId])

    useEffect(() => {
        if (post?.author) {
            const getAuthor = async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/api/sma/getUseById/${post.author}`, {
                        withCredentials: true,
                    })
                    setAuthorData(response.data)
                } catch (err) {
                    console.error("Error fetching author:", err)
                }
            }
            getAuthor()
        }
    }, [post])

    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/sma/comment/${postId}`)
            setComments(response.data)
        } catch (error) {
            console.error("Error fetching comments:", error)
        }
    }

    useEffect(() => {
        if (isOpen && postId) {
            fetchComments()
        }
    }, [isOpen, postId])

    // Fetch likes count and check if user liked
    useEffect(() => {
        const fetchLikesData = async () => {
            try {
                const countRes = await axios.get(`http://localhost:8000/api/sma/likesCount/${postId}`)
                setLikesCount(countRes.data.likesCount)

                const likedRes = await axios.get(`http://localhost:8000/api/sma/checkLiked/${postId}`, { withCredentials: true })
                setIsLiked(likedRes.data.liked)
            } catch (error) {
                console.error("Error fetching likes:", error)
            }
        }
        if (isOpen) {
            fetchLikesData()
        }
    }, [isOpen, postId])

    const handleLike = async () => {
        if (!currentUser?._id) {
            toast.error("Please login to like posts")
            return
        }
        setIsLiking(true)
        try {
            const response = await axios.post(`http://localhost:8000/api/sma/likePost/${postId}`, {}, { withCredentials: true })
            setIsLiked(response.data.liked)
            setLikesCount(response.data.likesCount)
            toast.success(response.data.message)
        } catch (error) {
            console.error("Error liking post:", error)
            toast.error("Failed to like post")
        } finally {
            setIsLiking(false)
        }
    }

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/sma/deletePost/${postId}`, { withCredentials: true })
            toast.success("Post deleted successfully")
            onPostDeleted?.()
            onClose()
        } catch (err) {
            console.error(err)
            toast.error("Failed to delete post")
        }
    }

    const handleEditComment = (comment) => {
        setEditingCommentId(comment._id)
        setTimeout(() => {
            if (editCommentRef.current) {
                editCommentRef.current.value = comment.content
            }
        }, 0)
    }

    const handleUpdateComment = async (commentId) => {
        if (!editCommentRef.current || !editCommentRef.current.value.trim()) return

        try {
            await axios.put(
                `http://localhost:8000/api/sma/comment/${commentId}`,
                { content: editCommentRef.current.value },
                { withCredentials: true },
            )

            setComments(
                comments.map((comment) =>
                    comment._id === commentId ? { ...comment, content: editCommentRef.current.value } : comment,
                ),
            )
            setEditingCommentId(null)
            toast.success("Comment updated")
        } catch (error) {
            console.error("Error updating comment:", error)
            toast.error("Failed to update comment")
        }
    }

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(`http://localhost:8000/api/sma/comment/${commentId}`, { withCredentials: true })
            setComments(comments.filter((comment) => comment._id !== commentId))
            toast.success("Comment deleted")
        } catch (error) {
            console.error("Error deleting comment:", error)
            toast.error("Failed to delete comment")
        }
    }

    if (!isOpen) return null

    return (
        <>
            {isEditingPost ? (
                <EditPost 
                    isModal={true} 
                    onClose={() => {
                        setIsEditingPost(false)
                        // Refresh post data
                        const fetchUpdated = async () => {
                            try {
                                const response = await axios.get(`http://localhost:8000/api/sma/getPost/${postId}`)
                                setPost(response.data)
                            } catch (error) {
                                console.error("Error fetching updated post:", error)
                            }
                        }
                        fetchUpdated()
                    }}
                    postId={postId}
                />
            ) : (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
                            <h2 className="text-xl font-bold">Post Details</h2>
                            <Button variant="ghost" size="icon" onClick={onClose}>
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <CardContent className="p-6 space-y-6">
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                                </div>
                            ) : !post ? (
                                <p className="text-center text-gray-500">Post not found</p>
                            ) : (
                                <>
                                    {/* Author Info */}
                                    <div className="flex items-center justify-between">
                                        <div 
                                            className="flex items-center space-x-3 cursor-pointer hover:opacity-80"
                                            onClick={() => {
                                                onClose()
                                                window.location.href = `/user/${post.author}`
                                            }}
                                        >
                                            <Avatar>
                                                <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
                                                <AvatarFallback>U</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold text-gray-800">{authorData?.username || "Unknown"}</p>
                                                <p className="text-sm text-gray-500">@{authorData?.username || "anonymous"}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {new Date(post.date).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <Separator />

                                    {/* Content */}
                                    <div className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />

                                    {/* Media */}
                                    {post.image && (
                                        <img 
                                            src={`http://localhost:8000${post.image}`} 
                                            alt="Post" 
                                            className="w-full rounded-lg max-h-[300px] object-cover"
                                        />
                                    )}
                                    {post.video && (
                                        <video 
                                            src={`http://localhost:8000${post.video}`} 
                                            controls 
                                            className="w-full rounded-lg max-h-[300px]"
                                        />
                                    )}

                                    <Separator />

                                    {/* Like Button */}
                                    <Button
                                        variant="ghost"
                                        onClick={handleLike}
                                        disabled={isLiking}
                                        className={`flex items-center gap-2 w-full justify-center py-2 ${isLiked ? "text-red-500" : "text-gray-600"}`}
                                    >
                                        <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                                        <span className="font-semibold">{likesCount}</span>
                                    </Button>

                                    {/* Edit/Delete Buttons */}
                                    {currentUser?._id === post?.author && (
                                        <div className="flex gap-2">
                                            <Button 
                                                variant="outline" 
                                                onClick={() => setIsEditingPost(true)}
                                                className="flex-1"
                                            >
                                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                                            </Button>
                                            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" className="flex-1">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Post?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    )}

                                    <Separator />

                                    {/* Comments Section */}
                                    <div>
                                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                                            <MessageSquare className="h-5 w-5" />
                                            Comments ({comments.length})
                                        </h3>

                                        {/* Comment Form */}
                                        {currentUser?._id && (
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault()
                                                    if (!commentInputRef.current?.value.trim()) return

                                                    setIsSubmittingComment(true)
                                                    axios
                                                        .post(
                                                            `http://localhost:8000/api/sma/comment?post=${postId}`,
                                                            { content: commentInputRef.current.value },
                                                            { withCredentials: true },
                                                        )
                                                        .then(() => {
                                                            fetchComments()
                                                            commentInputRef.current.value = ""
                                                            toast.success("Comment posted")
                                                        })
                                                        .catch(() => toast.error("Failed to post comment"))
                                                        .finally(() => setIsSubmittingComment(false))
                                                }}
                                                className="mb-4"
                                            >
                                                <div className="flex items-start gap-2">
                                                    <Textarea 
                                                        ref={commentInputRef} 
                                                        placeholder="Add a comment..." 
                                                        className="resize-none text-sm"
                                                        rows={2}
                                                    />
                                                    <Button type="submit" size="sm" disabled={isSubmittingComment}>
                                                        <Send className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </form>
                                        )}

                                        {/* Comments List */}
                                        <div className="space-y-4">
                                            {comments.length > 0 ? (
                                                comments.map((comment) => (
                                                    <Card key={comment._id} className="bg-gray-50">
                                                        <CardContent className="pt-4">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div className="flex items-start gap-2 flex-1">
                                                                    <Avatar className="h-8 w-8">
                                                                        <AvatarImage src={comment.user?.avatar} alt="@user" />
                                                                        <AvatarFallback>{comment.user?.username?.substring(0, 1).toUpperCase()}</AvatarFallback>
                                                                    </Avatar>
                                                                    <div className="flex-1">
                                                                        <p className="font-semibold text-sm">{comment.user?.username}</p>
                                                                        {editingCommentId === comment._id ? (
                                                                            <div className="mt-2 space-y-2">
                                                                                <Textarea
                                                                                    ref={editCommentRef}
                                                                                    className="resize-none text-sm"
                                                                                    rows={2}
                                                                                    defaultValue={comment.content}
                                                                                />
                                                                                <div className="flex gap-2">
                                                                                    <Button size="sm" variant="outline" onClick={() => setEditingCommentId(null)}>
                                                                                        Cancel
                                                                                    </Button>
                                                                                    <Button size="sm" onClick={() => handleUpdateComment(comment._id)}>
                                                                                        Update
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <p className="text-sm mt-1">{comment.content}</p>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {currentUser?._id === comment.user?._id && editingCommentId !== comment._id && (
                                                                    <div className="flex gap-1">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => handleEditComment(comment)}
                                                                            className="h-6 px-2"
                                                                        >
                                                                            <Edit2 className="h-3 w-3" />
                                                                        </Button>
                                                                        <AlertDialog>
                                                                            <AlertDialogTrigger asChild>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="h-6 px-2 text-red-500 hover:text-red-600"
                                                                                >
                                                                                    <Trash2 className="h-3 w-3" />
                                                                                </Button>
                                                                            </AlertDialogTrigger>
                                                                            <AlertDialogContent>
                                                                                <AlertDialogHeader>
                                                                                    <AlertDialogTitle>Delete Comment?</AlertDialogTitle>
                                                                                </AlertDialogHeader>
                                                                                <AlertDialogFooter>
                                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                    <AlertDialogAction
                                                                                        onClick={() => handleDeleteComment(comment._id)}
                                                                                        className="bg-red-600 text-white hover:bg-red-700"
                                                                                    >
                                                                                        Delete
                                                                                    </AlertDialogAction>
                                                                                </AlertDialogFooter>
                                                                            </AlertDialogContent>
                                                                        </AlertDialog>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))
                                            ) : (
                                                <p className="text-center text-gray-500 text-sm py-4">No comments yet</p>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    )
}

export default PostDetailModal
