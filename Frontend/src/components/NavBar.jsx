import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SearchBtn from './SearchBtn';

const NavBar = () => {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const [data, setData] = useState([]);
    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8000/api/blogs/logout", {}, {
                withCredentials: true
            });
            setProfile(false);
            setIsOpen(false);
            navigate('/login');
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {

        const getUser = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/blogs/getUser", { withCredentials: true });
                // console.log(response);
                setData(response.data);
                console.log(response.data);

            } catch (err) {
                console.error(err);
            }
        };

        getUser();
    }, [])

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                await axios.get("http://localhost:8000/api/blogs/isAuthenticated", {
                    withCredentials: true
                });
                setProfile(true);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        const closeDropdown = () => {
            if (isOpen) setIsOpen(false);
        };

        document.addEventListener('click', closeDropdown);
        return () => document.removeEventListener('click', closeDropdown);
    }, [isOpen]);


    return (
        <header className="w-full border-b">
            <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-6">
                    <Link to={profile ? "/home" : "/login"} className="font-bold text-2xl">
                        nuntium.
                    </Link>
                    <nav className="hidden md:flex gap-6">
                        <Link to="/home" className="text-sm hover:text-primary">Home</Link>
                        <Link to="/tags" className="text-sm hover:text-primary">Tags</Link>
                        <Link to="/about" className="text-sm hover:text-primary">About</Link>
                    </nav>
                </div>

                {profile ? (
                    <div className="flex items-center gap-8">
                        <SearchBtn />
                        <div className="relative">
                            <button onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(!isOpen);
                            }} className="focus:outline-none">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </button>

                            {isOpen && (
                                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                    <div className="py-1">
                                        <div className="px-4 py-2 border-b">
                                            <p className="text-sm font-medium">{data.username}</p>
                                            <p className="text-xs text-gray-500">@{data.username}</p>
                                        </div>
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Profile
                                        </Link>
                                        <Link to="/WritePost" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Write a Post
                                        </Link>
                                        <div className="border-t">
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : loading ? (
                    <p>loading ...</p>
                ) : (
                    <div className="flex items-center gap-8">
                        <SearchBtn />
                        <div className="flex gap-2">
                            <Button variant="outline">
                                <Link to="/login" className="text-sm hover:text-primary">Login</Link>
                            </Button>
                            <Button>
                                <Link to="/Register" className="text-sm">Register</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default NavBar;