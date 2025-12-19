import { useEffect, useState } from "react"
import { User, Key, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { toast, Toaster } from "sonner"

const LoginScreen = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)

    const navigate = useNavigate()
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8000/api/sma/login",
                { username, password },
                { withCredentials: true },
            )
            toast.success("Login successful", {
                duration: 1000,
                onAutoClose: () => {
                    navigate("/profile")
                },
            })
        } catch (err) {
            toast.error("Login failed. Please try again.")
            console.error(err)
        }
    }

    useEffect(() => {
        const auth = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/sma/isAuthenticated", { withCredentials: true })
                setIsAuthenticated(true)
                navigate("/profile")
            } catch (err) {
                console.error(err)
            }
        }

        auth()
    }, [navigate])

    return (
        <>
            <Toaster />
            {
                isAuthenticated ? (
                    <p>notauth</p>
                ) : (
                    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
                        {/* Background decorative elements */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
                            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                        </div>

                        {/* Login Card */}
                        <div className="relative w-full max-w-md">
                            <div className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-white/50 p-8 space-y-8">
                                {/* Logo/Icon */}
                                <div className="flex justify-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                                        <Sparkles className="w-8 h-8 text-white" />
                                    </div>
                                </div>

                                {/* Header */}
                                <div className="space-y-2 text-center">
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        Welcome Back
                                    </h1>
                                    <p className="text-gray-600 text-sm">Sign in to continue your journey</p>
                                </div>

                                {/* Form */}
                                <div className="space-y-5">
                                    {/* Username Input */}
                                    <div className="relative group">
                                        <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-purple-500" />
                                        <Input
                                            placeholder="Username"
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="pl-12 h-12 bg-white/50 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-white/70"
                                        />
                                    </div>

                                    {/* Password Input */}
                                    <div className="relative group">
                                        <Key className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-purple-500" />
                                        <Input
                                            placeholder="Password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-12 h-12 bg-white/50 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-white/70"
                                        />
                                    </div>

                                    {/* Remember Me */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="remember"
                                                checked={rememberMe}
                                                onCheckedChange={(checked) => setRememberMe(checked)}
                                                className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                                            />
                                            <label
                                                htmlFor="remember"
                                                className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                                            >
                                                Remember me
                                            </label>
                                        </div>
                                        <a href="#" className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
                                            Forgot password?
                                        </a>
                                    </div>

                                    {/* Login Button */}
                                    <Button
                                        onClick={handleLogin}
                                        className="w-full h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                                    >
                                        Sign In
                                    </Button>
                                </div>

                                {/* Footer */}
                                <div className="text-center pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600">
                                        Don't have an account?{" "}
                                        <a href="#" className="font-semibold text-purple-600 hover:text-purple-700 transition-colors">
                                            Sign up
                                        </a>
                                    </p>
                                </div>
                            </div>

                            {/* Bottom decorative text */}
                            <p className="text-center mt-6 text-sm text-gray-500">Join millions of users worldwide</p>
                        </div>
                    </div>
                )
                // </CHANGE>
            }
        </>
    )
}

export default LoginScreen