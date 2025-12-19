import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import SearchBtn from "./SearchBtn"

const NavBar = () => {
    const navigate = useNavigate()

    const [profile, setProfile] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)

    const [data, setData] = useState([])
    const handleLogout = async () => {
        try {
            await axios.post(
                "http://localhost:8000/api/sma/logout",
                {},
                {
                    withCredentials: true,
                },
            )
            setProfile(false)
            setIsOpen(false)
            navigate("/login")
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/sma/getUser", { withCredentials: true })
                setData(response.data)
                console.log(response.data)
            } catch (err) {
                console.error(err)
            }
        }

        getUser()
    }, [])

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                await axios.get("http://localhost:8000/api/sma/isAuthenticated", {
                    withCredentials: true,
                })
                setProfile(true)
                setLoading(false)
            } catch (err) {
                console.error(err)
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    useEffect(() => {
        const closeDropdown = () => {
            if (isOpen) setIsOpen(false)
        }

        document.addEventListener("click", closeDropdown)
        return () => document.removeEventListener("click", closeDropdown)
    }, [isOpen])

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Left Section - Logo & Nav */}
                <div className="flex items-center gap-8">
                    <Link
                        to={profile ? "/home" : "/login"}
                        className="font-black text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                        nuntium.
                    </Link>

                    {profile && (
                        <nav className="hidden md:flex items-center gap-1">
                            <Link
                                to="/home"
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                to="/tags"
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Tags
                            </Link>
                            <Link
                                to="/about"
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                About
                            </Link>
                        </nav>
                    )}
                </div>

                {/* Right Section - Search, Profile, or Auth Buttons */}
                {profile ? (
                    <div className="flex items-center gap-4">
                        <SearchBtn />

                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setIsOpen(!isOpen)
                                }}
                                className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full transition-all hover:scale-105"
                            >
                                <Avatar className="h-9 w-9 border-2 border-gray-200 hover:border-blue-500 transition-colors">
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                                        {data.username ? data.username.substring(0, 2).toUpperCase() : "CN"}
                                    </AvatarFallback>
                                </Avatar>
                            </button>

                            {isOpen && (
                                <div className="absolute right-0 mt-3 w-64 rounded-2xl shadow-2xl bg-white ring-1 ring-black/5 focus:outline-none z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="py-2">
                                        {/* User Info Header */}
                                        <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                                            <p className="text-sm font-bold text-gray-900">{data.username}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">@{data.username}</p>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-1">
                                            <Link
                                                to="/profile"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    />
                                                </svg>
                                                Profile
                                            </Link>
                                            <Link
                                                to="/WritePost"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                    />
                                                </svg>
                                                Write a Post
                                            </Link>
                                        </div>

                                        {/* Logout */}
                                        <div className="border-t border-gray-100 mt-1">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                    />
                                                </svg>
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : loading ? (
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="h-2 w-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="h-2 w-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <SearchBtn />
                        <div className="flex items-center gap-2">
                            <Link to="/login">
                                <Button
                                    variant="ghost"
                                    className="text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                                >
                                    Login
                                </Button>
                            </Link>
                            <Link to="/Register">
                                <Button className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}

export default NavBar