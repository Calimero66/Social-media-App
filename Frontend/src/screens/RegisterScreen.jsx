import React, { useState } from "react";
import { Link , useNavigate } from "react-router-dom";
import { User, Key, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setError("");

        try {
            const response = await axios.post(
                "http://localhost:8000/api/blogs/register",
                formData
            );

            
            setSuccess("Registration successful!");
            setError(""); 

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {
            console.error(error);

            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="mx-auto max-w-sm space-y-8 p-4 mt-52">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Create an account</h1>
                <p className="text-gray-500">
                    Enter your details to get started with nuntium.
                </p>
            </div>
            <form onSubmit={handleRegister} className="space-y-4">
                <div className="relative">
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="Username"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="pl-10"
                        required
                    />
                </div>
                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10"
                        required
                    />
                </div>
                <div className="relative">
                    <Key className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-10"
                        required
                    />
                </div>
                <div className="relative">
                    <Key className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="pl-10"
                        required
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="terms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) =>
                            setFormData((prev) => ({ ...prev, acceptTerms: checked }))
                        }
                        required
                    />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        I accept the{" "}
                        <Link href="/terms" className="text-primary hover:underline">
                            terms and conditions
                        </Link>
                    </label>
                </div>
                <Button type="submit" className="w-full">
                    Register
                </Button>
            </form>
            <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                    Sign in
                </Link>
            </div>
        </div>
    );
};

export default RegisterForm;
