import { useEffect, useState } from 'react';
import NavBar from '../NavBar';
import axios from 'axios';
import { useNavigate, Outlet } from 'react-router-dom';



const ProtLayout = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();


    useEffect(()=>{

        const auth = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/blogs/isAuthenticated",  { withCredentials: true });
                // alert("token find");
                setIsAuthenticated(true);
                // console.log(response);
                
            } catch (err) {
                console.error(err);
                // alert("token is not find.");
                navigate('/login');
    
            }
        };
        
        auth();
    },[])

    return (
        <div>
            <NavBar />
            <div>                
                {isAuthenticated ? <Outlet />:<p>notauth</p>}
            </div>
        </div>
    );
};

export default ProtLayout;