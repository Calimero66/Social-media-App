import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import LoginScreen from "./screens/LoginScreen";
import RegisterForm from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import AboutScreen from "./screens/AboutScreen";
import Profile from "./screens/profile/Profile";
import UserProfile from "./screens/profile/UserProfile";
import ProtLayout from "./components/layout/protLayout";
import EditPost from "./screens/EditPost";

const router = createBrowserRouter([
    {

        path: "/",
        element: <Layout />,
        children: [
            { path: "/login", element: <LoginScreen /> },
            { path: "/register", element: <RegisterForm /> },
            { path: "/home", element: <HomeScreen />, index: true },

            { path: "/about", element: <AboutScreen /> },
            { path: "/user/:userId", element: <UserProfile /> },
        ],

    },

    {

        path: "/",
        element: <ProtLayout />,
        children: [
            { path: "/profile", element: <Profile />, index: true },
            { path: "/edit-post/:postId", element: <EditPost/>},

        ],

    },
    {
        path: "*",
        element: <Navigate to="/login" replace />,
    },
    {
        index: true,
        element: <Navigate to="/home" replace />,
    },

]);

export default router;
