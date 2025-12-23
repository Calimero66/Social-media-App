import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, MoreHorizontal, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import LikeButton from "./LikeButton"

const PostCard = ({ post, username, onClick }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <Card 
            className="group overflow-hidden border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
            onClick={onClick}
        >
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
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
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MoreHorizontal className="h-4 w-4 text-gray-500" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="pb-3">
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
                        />
                    </div>
                )}

                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                        {post.tags.map((tag, index) => (
                            <Badge 
                                key={index} 
                                variant="secondary" 
                                className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-normal px-2 py-0.5 rounded-full transition-colors"
                            >
                                #{tag}
                            </Badge>
                        ))}
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
                        onClick={onClick}
                    >
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">Comment</span>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}

export default PostCard
