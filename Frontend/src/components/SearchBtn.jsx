import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function SearchBar() {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const searchUsers = async () => {
            if (!searchQuery.trim()) {
                setSearchResults([])
                return
            }

            setIsLoading(true)
            try {
                // Fetch all users and filter by username
                const response = await axios.get('http://localhost:8000/api/sma/allUsers')
                const filtered = response.data.filter(user =>
                    user.username.toLowerCase().includes(searchQuery.toLowerCase())
                )
                setSearchResults(filtered.slice(0, 5)) // Limit to 5 results
            } catch (error) {
                console.error('Error searching users:', error)
                setSearchResults([])
            } finally {
                setIsLoading(false)
            }
        }

        const debounceTimer = setTimeout(searchUsers, 300)
        return () => clearTimeout(debounceTimer)
    }, [searchQuery])

    const handleUserClick = (userId) => {
        navigate(`/user/${userId}`)
        setIsOpen(false)
        setSearchQuery('')
        setSearchResults([])
    }

    return (
        <div className="relative">
            <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsOpen(true)}
            >
                <Search className="h-4 w-4" />
                <span className="sr-only">Open search</span>
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: '350px', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-0 z-50 origin-top-right"
                    >
                        <div className="relative w-full bg-white rounded-lg shadow-lg border border-gray-200">
                            <div className="relative">
                                <Input
                                    type="search"
                                    placeholder="Search users..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pr-10 bg-white border-0 rounded-t-lg"
                                    autoFocus
                                />
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute right-0 top-0"
                                    onClick={() => {
                                        setIsOpen(false)
                                        setSearchQuery('')
                                        setSearchResults([])
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Search Results */}
                            {(searchResults.length > 0 || (searchQuery && isLoading)) && (
                                <div className="max-h-96 overflow-y-auto border-t border-gray-200">
                                    {isLoading ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            Searching...
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        <div className="divide-y">
                                            {searchResults.map((user) => (
                                                <button
                                                    key={user._id}
                                                    onClick={() => handleUserClick(user._id)}
                                                    className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left"
                                                >
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src="https://github.com/shadcn.png" alt={user.username} />
                                                        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold">
                                                            {user.username?.[0]?.toUpperCase() || "U"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-gray-900 truncate">{user.username}</p>
                                                        <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            No users found
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Close search when clicking outside */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        setIsOpen(false)
                        setSearchQuery('')
                        setSearchResults([])
                    }}
                />
            )}
        </div>
    )
}