import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Edit2, Trash2, MessageSquare, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { toast, Toaster } from "sonner"

const PostDetail = () => {
    const navigate = useNavigate()
    const { postId } = useParams()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [check, setCheck] = useState([])
    const [parsedTags, setParsedTags] = useState([])
    const [comments, setComments] = useState([])
    const commentInputRef = useRef(null)
    const editCommentRef = useRef(null)
    const [editingCommentId, setEditingCommentId] = useState(null)
    const [isSubmittingComment, setIsSubmittingComment] = useState(false)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/blogs/getPost/${postId}`)
                setPost(response.data)

                if (response.data.tags) {
                    try {
                        const parsed = JSON.parse(response.data.tags)
                        const tags = Array.isArray(parsed) ? parsed : JSON.parse(parsed)
                        setParsedTags(tags)
                    } catch {
                        const tags = Array.isArray(response.data.tags) ? response.data.tags : [response.data.tags]
                        setParsedTags(tags)
                    }
                }
            } catch (error) {
                console.error("Error fetching post:", error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchPost()
    }, [postId])

    useEffect(() => {
        const getUserByID = async () => {
            if (!post || !post.author) return
            try {
                const response = await axios.get(`http://localhost:8000/api/blogs/getUseById/${post.author}`, {
                    withCredentials: true,
                })
                setData(response.data)
            } catch (err) {
                console.error("Error fetching user:", err)
            }
        }

        getUserByID()
    }, [post])

    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/blogs/getUser`, { withCredentials: true })
                setCheck(response.data)
            } catch (err) {
                console.error("Error fetching user:", err)
            }
        }

        checkUser()
    }, [])

    const fetchComments = async () => {
        if (!postId) return
        try {
            const response = await axios.get(`http://localhost:8000/api/blogs/comment/${postId}`)
            console.log("Comments data:", response.data)
            setComments(response.data)
        } catch (error) {
            console.error("Error fetching comments:", error)
        }
    }

    useEffect(() => {
        fetchComments()
    }, [postId])

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/blogs/deletePost/${postId}`, { withCredentials: true })
            navigate("/profile")
        } catch (err) {
            console.error(err)
        }
    }

    const handleEdit = () => {
        navigate(`/edit/${postId}`)
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
                `http://localhost:8000/api/blogs/comment/${commentId}`,
                { content: editCommentRef.current.value },
                { withCredentials: true },
            )

            setComments(
                comments.map((comment) =>
                    comment._id === commentId ? { ...comment, content: editCommentRef.current.value } : comment,
                ),
            )
            setEditingCommentId(null)
            toast.success("Your comment has been updated successfully.")
        } catch (error) {
            console.error("Error updating comment:", error)
            toast.error("Failed to update your comment. Please try again.")
        }
    }

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(`http://localhost:8000/api/blogs/comment/${commentId}`, { withCredentials: true })
            setComments(comments.filter((comment) => comment._id !== commentId))
            toast.success("Your comment has been deleted successfully.")
        } catch (error) {
            console.error("Error deleting comment:", error)
            toast.error("Failed to delete your comment. Please try again.")
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    if (!post) {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-500">
                <p>Post not found.</p>
            </div>
        )
    }

    return (
        <article className="container max-w-3xl mx-auto py-10 px-6 md:px-0">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-sm mb-6 text-gray-600 hover:text-primary"
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to posts
            </button>

            {/* Post Header */}
            <div className="space-y-4 mb-6">
                <div className="flex flex-wrap gap-2">
                    {parsedTags.length > 0 ? (
                        parsedTags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                                {tag}
                            </Badge>
                        ))
                    ) : (
                        <Badge variant="secondary" className="text-sm px-3 py-1">
                            Uncategorized
                        </Badge>
                    )}
                </div>
                <h1 className="text-4xl font-extrabold leading-tight text-gray-900">{post.title}</h1>

                <div className="flex items-center justify-between text-gray-600 text-sm">
                    <div className="flex items-center space-x-3">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>AB</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-gray-800">{data.username || "Unknown Author"}</p>
                            <p className="text-gray-500">@{data.username || "anonymous"}</p>
                        </div>
                    </div>
                    <p>
                        {new Date(post.date).toLocaleDateString()} · {post.readTime || "5 min read"}
                    </p>
                </div>
            </div>

            {/* Post Image */}
            {post.image && (
                <div className="relative w-full h-72 md:h-96 rounded-lg overflow-hidden mb-6">
                    <img src={`http://localhost:8000${post.image}`} alt={post.title} className="w-full h-full object-cover" />
                </div>
            )}

            {/* Post Content */}
            <div className="prose prose-lg prose-gray max-w-none mb-6" dangerouslySetInnerHTML={{ __html: post.content }} />

            {/* Action Buttons */}
            {check?._id === post?.author && (
                <div className="flex justify-end space-x-4">
                    <Button variant="outline" onClick={handleEdit} className="flex items-center">
                        <Edit2 className="mr-2 h-4 w-4" /> Edit Post
                    </Button>
                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="flex items-center">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Post
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your post and remove the data from our
                                    servers.
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
            {/* Comments Section */}
            <div className="mt-12">
                <Separator className="my-6" />
                <h2 className="text-2xl font-bold flex items-center mb-6">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Comments ({comments.length})
                </h2>

                {/* Comment Form */}
                {check?._id && (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            if (!commentInputRef.current?.value.trim()) return

                            setIsSubmittingComment(true)
                            axios
                                .post(
                                    `http://localhost:8000/api/blogs/comment?post=${postId}`,
                                    { content: commentInputRef.current.value },
                                    { withCredentials: true },
                                )
                                .then((response) => {
                                    // Instead of manually creating the comment object, refresh comments from server
                                    fetchComments()
                                    commentInputRef.current.value = ""
                                    toast.success("Your comment has been posted successfully.")
                                })
                                .catch((error) => {
                                    console.error("Error posting comment:", error)
                                    toast.error("Failed to post your comment. Please try again.")
                                })
                                .finally(() => {
                                    setIsSubmittingComment(false)
                                })
                        }}
                        className="mb-8"
                    >
                        <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
                                <AvatarFallback>{check?.username?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <Textarea ref={commentInputRef} placeholder="Add a comment..." className="resize-none mb-2" rows={3} />
                                <Button type="submit" disabled={isSubmittingComment} className="flex items-center">
                                    <Send className="mr-2 h-4 w-4" />
                                    {isSubmittingComment ? "Posting..." : "Post Comment"}
                                </Button>
                            </div>
                        </div>
                    </form>
                )}

                {/* Comments List */}
                <div className="space-y-6">
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <Card key={comment._id} className="border border-gray-200">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={comment.user?.avatar || "https://github.com/shadcn.png"} alt="@user" />
                                                <AvatarFallback>{comment.user?.username?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">{comment.user?.username || "Anonymous"}</p>
                                            </div>
                                        </div>

                                        {check?._id === comment.user?._id && (
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEditComment(comment)}
                                                    className="h-8 px-2"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete this comment? This action cannot be undone.
                                                            </AlertDialogDescription>
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

                                    {editingCommentId === comment._id ? (
                                        <div className="mt-4">
                                            <Textarea
                                                ref={editCommentRef}
                                                className="resize-none mb-2"
                                                rows={3}
                                                defaultValue={comment.content}
                                            />
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm" onClick={() => setEditingCommentId(null)}>
                                                    Cancel
                                                </Button>
                                                <Button size="sm" onClick={() => handleUpdateComment(comment._id)}>
                                                    Update
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="mt-4">{comment.content}</p>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <MessageSquare className="mx-auto h-12 w-12 opacity-20 mb-2" />
                            <p>No comments yet. Be the first to share your thoughts!</p>
                        </div>
                    )}
                </div>
            </div>
            <Toaster position="top-right" />
        </article>
    )
}

export default PostDetail