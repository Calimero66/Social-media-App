import { useEffect, useState } from 'react';
import { User, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from "sonner"


const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);


    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:8000/api/blogs/login", { username, password }, { withCredentials: true });
            toast.success("Login successful", {
                duration: 1000,
                onAutoClose: () => {
                    navigate('/profile');
                }
            });
            // toast.success("Login successful");
            // navigate('/profile');
        } catch (err) {
            toast.error("Login failed. Please try again.");
            console.error(err);
        }
    };

    useEffect(() => {

        const auth = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/blogs/isAuthenticated", { withCredentials: true });
                // alert("token find");
                setIsAuthenticated(true);
                // console.log(response);
                navigate('/profile');

            } catch (err) {
                console.error(err);
                // alert("token is not find.");

            }
        };

        auth();
    }, [])

    return (
        <>
            <Toaster />
            {isAuthenticated ? <p>notauth</p> :

                <div className="mx-auto max-w-sm space-y-8 p-4 mt-60">
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold">Welcome back!</h1>
                        <p className="text-gray-500">Sign in to get the most out of.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="relative">
                            <Key className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => setRememberMe(checked)}
                                />
                                <label
                                    htmlFor="remember"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Remember me
                                </label>
                            </div>
                        </div>
                        <Button onClick={handleLogin} className="w-full">
                            Login
                        </Button>
                    </div>
                </div>
            }

        </>
    );
};

export default LoginScreen;
