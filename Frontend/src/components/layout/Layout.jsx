import NavBar from '../NavBar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div>
            <NavBar />
            <div>
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
