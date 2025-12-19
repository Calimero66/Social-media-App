import { ImageIcon, Video, Smile, X } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useRef } from "react"
import axios from "axios"

const CreatePost = ({ username, onPostCreated }) => {
    const [isPostModalOpen, setIsPostModalOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const fileInputRef = useRef(null)

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const removeImage = () => {
        setImage(null)
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleSubmit = async () => {
        if (!content.trim() && !image) return

        setIsLoading(true)

        const formData = new FormData()
        formData.append("title", title || "Untitled Post")
        formData.append("content", content)
        if (image) formData.append("image", image)
        formData.append("tags", JSON.stringify([]))

        try {
            const response = await axios.post(
                "http://localhost:8000/api/sma/createPost",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            )

            console.log("Post created successfully!", response.data)

            // Reset form
            setTitle("")
            setContent("")
            setImage(null)
            setImagePreview(null)
            setIsPostModalOpen(false)

            // Callback to refresh posts if provided
            if (onPostCreated) onPostCreated()
        } catch (error) {
            console.error("Post submission error:", error.response?.data || error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCloseModal = () => {
        setIsPostModalOpen(false)
        setTitle("")
        setContent("")
        setImage(null)
        setImagePreview(null)
    }

    return (
        <>
            {/* Post Creation Card */}
            <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12 ring-2 ring-blue-100">
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                                {username?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <button
                            onClick={() => setIsPostModalOpen(true)}
                            className="flex-1 text-left px-5 py-3 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-all cursor-pointer"
                        >
                            What's on your mind, {username}?
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
                                onClick={handleCloseModal}
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
                                        {username?.[0]?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-gray-800">{username}</p>
                                </div>
                            </div>

                            {/* Title Input */}
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Post title (optional)"
                                className="w-full p-3 mb-2 text-lg border-b border-gray-200 focus:outline-none focus:border-blue-500 text-gray-800 placeholder-gray-400"
                            />

                            {/* Content Textarea */}
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder={`What's on your mind, ${username}?`}
                                className="w-full min-h-[120px] p-3 text-lg resize-none focus:outline-none text-gray-800 placeholder-gray-400"
                                autoFocus
                            />

                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="relative mt-3 rounded-xl overflow-hidden">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full max-h-[200px] object-cover rounded-xl"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            {/* Add to post section */}
                            <div className="border border-gray-200 rounded-xl p-4 mt-4">
                                <p className="text-sm font-semibold text-gray-800 mb-3">Add to your post</p>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        ref={fileInputRef}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="hover:bg-green-50 rounded-full"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
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
                                onClick={handleSubmit}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all"
                                disabled={(!content.trim() && !image) || isLoading}
                            >
                                {isLoading ? "Posting..." : "Post"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default CreatePost
