import { useState, useEffect, useRef } from "react"
import { X, Camera, Instagram, Twitter, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import axios from "axios"
import { toast } from "sonner"

const SettingsModal = ({ isOpen, onClose, userData, onSave }) => {
    const [formData, setFormData] = useState({
        username: userData?.username || "",
        email: userData?.email || "",
        bio: userData?.bio || "",
        instagram: userData?.instagram || "",
        twitter: userData?.twitter || "",
        website: userData?.website || ""
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isUploadingImage, setIsUploadingImage] = useState(false)
    const [previewImage, setPreviewImage] = useState(null)
    const fileInputRef = useRef(null)

    // Update form data when userData changes or modal opens
    useEffect(() => {
        if (isOpen && userData) {
            setFormData({
                username: userData.username || "",
                email: userData.email || "",
                bio: userData.bio || "",
                instagram: userData.instagram || "",
                twitter: userData.twitter || "",
                website: userData.website || ""
            })
            setPreviewImage(null)
        }
    }, [isOpen, userData])

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
        if (!allowedTypes.includes(file.type)) {
            toast.error("Please select a valid image file (JPEG, PNG, or GIF)")
            return
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB")
            return
        }

        // Show preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreviewImage(reader.result)
        }
        reader.readAsDataURL(file)

        const formData = new FormData()
        formData.append('profileImage', file)

        setIsUploadingImage(true)
        try {
            const response = await axios.put(
                "http://localhost:8000/api/sma/updateProfileImage",
                formData,
                { 
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
            onSave(response.data)
            toast.success("Profile photo updated successfully!")
        } catch (error) {
            console.error("Error uploading profile image:", error)
            toast.error(error.response?.data?.message || "Failed to update profile photo")
            setPreviewImage(null)
        } finally {
            setIsUploadingImage(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!formData.username.trim()) {
            toast.error("Username is required")
            return
        }

        setIsLoading(true)
        try {
            const response = await axios.put(
                "http://localhost:8000/api/sma/updateProfile",
                formData,
                { withCredentials: true }
            )
            
            toast.success("Profile updated successfully!")
            onSave(response.data)
            onClose()
        } catch (error) {
            console.error("Error updating profile:", error)
            toast.error(error.response?.data?.message || "Failed to update profile")
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold">Edit Profile</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Profile Photo */}
                        <div className="flex flex-col items-center mb-4">
                            <div className="relative group">
                                <Avatar className="w-24 h-24 ring-2 ring-purple-200">
                                    <AvatarImage 
                                        src={previewImage || (userData?.profileImage ? `http://localhost:8000/uploads/${userData.profileImage}` : undefined)} 
                                        alt={userData?.username} 
                                    />
                                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-2xl font-bold">
                                        {userData?.username?.[0]?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div 
                                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {isUploadingImage ? (
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Camera className="h-6 w-6 text-white" />
                                    )}
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/jpeg,image/jpg,image/png,image/gif"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                                disabled={isUploadingImage}
                            >
                                {isUploadingImage ? "Uploading..." : "Change Photo"}
                            </button>
                        </div>

                        {/* Username Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Username
                            </label>
                            <Input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                className="w-full"
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email
                            </label>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="w-full"
                            />
                        </div>

                        {/* Bio Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Bio
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Tell us about yourself"
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                            />
                        </div>

                        {/* Social Links */}
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-700">
                                Social Links
                            </label>
                            
                            {/* Instagram */}
                            <div className="relative">
                                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-500" />
                                <Input
                                    type="url"
                                    name="instagram"
                                    value={formData.instagram}
                                    onChange={handleChange}
                                    placeholder="Instagram URL"
                                    className="w-full pl-10"
                                />
                            </div>
                            
                            {/* Twitter */}
                            <div className="relative">
                                <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
                                <Input
                                    type="url"
                                    name="twitter"
                                    value={formData.twitter}
                                    onChange={handleChange}
                                    placeholder="Twitter URL"
                                    className="w-full pl-10"
                                />
                            </div>
                            
                            {/* Website */}
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder="Website URL"
                                    className="w-full pl-10"
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1"
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700"
                                disabled={isLoading}
                            >
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default SettingsModal
