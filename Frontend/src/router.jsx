import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import LoginScreen from "./screens/LoginScreen";
import RegisterForm from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import TagsScreen from "./screens/TagsScreen";
import AboutScreen from "./screens/AboutScreen";
import Profile from "./screens/profile/Profile";
import ProtLayout from "./components/layout/protLayout";
import WritePage from "./screens/WritePost";
import PostDetail from "./screens/PostDetail";
import EditPost from "./screens/EditPost";

const router = createBrowserRouter([
    {

        path: "/",
        element: <Layout />,
        children: [
            { path: "/login", element: <LoginScreen /> },
            { path: "/register", element: <RegisterForm /> },
            { path: "/home", element: <HomeScreen />, index: true },
            { path: "/Tags", element: <TagsScreen /> },
            { path: "/about", element: <AboutScreen /> },
        ],

    },

    {

        path: "/",
        element: <ProtLayout />,
        children: [
            { path: "/profile", element: <Profile />, index: true },
            { path: "/WritePost", element: <WritePage /> },
            { path: "/post/:postId", element: <PostDetail />},
            { path: "/edit/:id", element: <EditPost/>},

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
