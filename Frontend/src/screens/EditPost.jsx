import { ImageIcon, Video, X } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

const EditPost = () => {
    const { postId } = useParams()
    const navigate = useNavigate()
    const [content, setContent] = useState("")
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [video, setVideo] = useState(null)
    const [videoPreview, setVideoPreview] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [username, setUsername] = useState("")
    const imageInputRef = useRef(null)
    const videoInputRef = useRef(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postRes, userRes] = await Promise.all([
                    axios.get(`http://localhost:8000/api/sma/getPost/${postId}`),
                    axios.get(`http://localhost:8000/api/sma/getUser`, { withCredentials: true })
                ])
                
                setContent(postRes.data.content)
                setUsername(userRes.data.username)
                
                if (postRes.data.image) {
                    setImagePreview(`http://localhost:8000${postRes.data.image}`)
                } else if (postRes.data.video) {
                    setVideoPreview(`http://localhost:8000${postRes.data.video}`)
                }
            } catch (error) {
                console.error(error)
                toast.error("Failed to load post")
            }
        }

        fetchData()
    }, [postId])

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            console.log("Image file selected:", file)
            setImage(file)
            setImagePreview(URL.createObjectURL(file))
            setVideo(null)
            setVideoPreview(null)
            e.target.value = ""
        }
    }

    const handleVideoUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            setVideo(file)
            setVideoPreview(URL.createObjectURL(file))
            setImage(null)
            setImagePreview(null)
        }
    }

    const removeImage = () => {
        setImage(null)
        setImagePreview(null)
        if (imageInputRef.current) {
            imageInputRef.current.value = ""
        }
    }

    const removeVideo = () => {
        setVideo(null)
        setVideoPreview(null)
        if (videoInputRef.current) {
            videoInputRef.current.value = ""
        }
    }

    const handleSubmit = async () => {
        if (!content.trim() && !image && !video && !imagePreview && !videoPreview) return

        setIsLoading(true)

        const formData = new FormData()
        formData.append("content", content)
        
        // Only append new file if it's a File object (not a string path to existing image)
        if (image && image instanceof File) formData.append("image", image)
        if (video && video instanceof File) formData.append("image", video)

        try {
            await axios.put(
                `http://localhost:8000/api/sma/updatePost/${postId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            )

            toast.success("Post updated successfully!")
            navigate(-1)
        } catch (error) {
            console.error("Post update error:", error)
            toast.error("Failed to update post")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Edit Post</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
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

                    {/* Video Preview */}
                    {videoPreview && (
                        <div className="relative mt-3 rounded-xl overflow-hidden">
                            <video
                                src={videoPreview}
                                controls
                                className="w-full max-h-[200px] object-cover rounded-xl"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={removeVideo}
                                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    {/* Add to post section */}
                    <div className="border border-gray-200 rounded-xl p-4 mt-4">
                        <p className="text-sm font-semibold text-gray-800 mb-3">Update media</p>
                        <div className="flex items-center gap-2">
                            {/* Image Upload Input */}
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/gif"
                                onChange={handleImageUpload}
                                ref={imageInputRef}
                                className="hidden"
                                id="image-upload"
                            />
                            {/* Video Upload Input */}
                            <input
                                type="file"
                                accept="video/mp4,video/mov,video/avi,video/mkv,video/webm"
                                onChange={handleVideoUpload}
                                ref={videoInputRef}
                                className="hidden"
                                id="video-upload"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-green-50 rounded-full"
                                onClick={() => imageInputRef.current?.click()}
                            >
                                <ImageIcon className="h-6 w-6 text-green-500" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="hover:bg-red-50 rounded-full"
                                onClick={() => videoInputRef.current?.click()}
                            >
                                <Video className="h-6 w-6 text-red-500" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t">
                    <Button
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all"
                        disabled={(!content.trim() && !image && !video && !imagePreview && !videoPreview) || isLoading}
                    >
                        {isLoading ? "Updating..." : "Update Post"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default EditPost
