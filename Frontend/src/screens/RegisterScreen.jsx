import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { User, Key, Mail, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import axios from "axios"

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
    })
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.")
            return
        }
        setError("")

        try {
            const response = await axios.post("http://localhost:8000/api/sma/register", formData)

            setSuccess("Registration successful!")
            setError("")

            setTimeout(() => {
                navigate("/login")
            }, 1000)
        } catch (error) {
            console.error(error)

            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message)
            } else {
                setError("An unexpected error occurred. Please try again.")
            }
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>

            <div className="relative w-full max-w-md">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                    <div className="space-y-3 text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                                <Sparkles className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Create an account
                        </h1>
                        <p className="text-gray-600">Join nuntium and connect with the world</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                            <Input
                                placeholder="Username"
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-300 bg-white/50"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                            <Input
                                placeholder="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-300 bg-white/50"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                            <Input
                                placeholder="Password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-300 bg-white/50"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                            <Input
                                placeholder="Confirm Password"
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-300 bg-white/50"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
                        )}
                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
                                {success}
                            </div>
                        )}

                        <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl">
                            <Checkbox
                                id="terms"
                                checked={formData.acceptTerms}
                                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, acceptTerms: checked }))}
                                required
                                className="mt-0.5"
                            />
                            <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                                I accept the{" "}
                                <Link to="/terms" className="text-blue-600 hover:text-purple-600 font-medium transition-colors">
                                    terms and conditions
                                </Link>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                        >
                            Create Account
                        </Button>
                    </form>

                    <div className="text-center text-sm mt-6">
                        <span className="text-gray-600">Already have an account? </span>
                        <Link to="/login" className="text-blue-600 hover:text-purple-600 font-semibold transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterForm
