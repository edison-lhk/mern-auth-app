import { FaUserCircle } from "react-icons/fa";
import { AiFillCaretDown } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { useEffect, useState, useRef } from "react";
import axios, { AxiosResponse, AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AppIcon from "../icons/Icon.png";

const Dashboard = () => {
    const [user, setUser] = useState({ photo: '', username: '', bio: '', phone: '', email: '', authType: '' });
    const { photo, username, bio, phone, email, authType } = user;
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const navigate = useNavigate();
    const dropdownMenuRef = useRef<HTMLDivElement>(null);
    const showMenuBtnRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/api/users`, { withCredentials: true })
             .then((response: AxiosResponse) => {
                setIsAuthorized(true);
                setUser(response.data.user);
            })
             .catch((error: AxiosError) => {
                setIsAuthorized(false);
                setTimeout(() => navigate('/login', {state: {error: 'Please login first to access the dashboard'}}), 150);
            });
    }, []);

    const showMenu = () => {
        if (!dropdownMenuRef.current) return;
        
        dropdownMenuRef.current.classList.add('show');
    }

    document.onclick = (e: any) => {
        if (!dropdownMenuRef.current?.contains(e.target) && !showMenuBtnRef.current?.contains(e.target)) {
            dropdownMenuRef.current?.classList.remove('show');
        }
    }

    const logout = async () => {
        try {
            const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/auth/logout`, { withCredentials: true });
            setTimeout(() => navigate('/login', { state: { success: response.data.message } }), 800);
        } catch (error: AxiosError | any) {
            toast.error(error.response.data.error);
        }
    };

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="dashboard-container">
            <nav>
                <div className="logo-container">
                    <img src={AppIcon} alt="App Icon" />
                    <h3>Authentication App</h3>
                </div>
                <div className="user-container">
                    {photo !== '' && photo ? <img src={photo} alt="Profile Picture" /> : <FaUserCircle size="35px" color="#33333" />}
                    <h3>{username}</h3>
                    <div className="popup-menu-btn" onClick={showMenu} ref={showMenuBtnRef} ><AiFillCaretDown size="12px" color="#33333" /></div>
                    <div className="popup-menu-container" ref={dropdownMenuRef} >
                        <div className="logout" onClick={logout}><FiLogOut size="20px" color="#EB5757" /><h4>Logout</h4></div>   
                    </div>
                </div>
            </nav>
            <div className="personal-info-section">
                <h1>Personal Info</h1>
                <h3>Basic info, like your name and photo</h3>
                <div className="personal-info-container">
                    <div className="header">
                        <div className="description">
                            <h4>Profile</h4>
                            <p>Some info may be visible to other people</p>
                        </div>
                        <button onClick={() => navigate('/dashboard/edit-info', { state: { user: user } })}>Edit</button>
                    </div>
                    <div className="photo">
                        <h5>PHOTO</h5>
                        {photo !== '' && photo ? <h5 className="photo"><img src={photo} alt="Profile Picture" /></h5> : <h5 className="photo"><FaUserCircle size="65px" color="#4F4F4F" /></h5> }
                    </div>
                    <div className="name">
                        <h5>NAME</h5>
                        <h5>{username}</h5>
                    </div>
                    <div className="bio">
                        <h5>BIO</h5>
                        {bio && bio !== '' ? bio.length >= 25 ? <h5 style={{justifyContent: "start"}}>{bio}</h5> : <h5>{bio}</h5> : <h5>N/A</h5>}
                    </div>
                    <div className="phone">
                        <h5>PHONE</h5>
                        <h5>{phone|| "N/A"}</h5>
                    </div>
                    <div className="email">
                        <h5>EMAIL</h5>
                        <h5>{email || "N/A"}</h5>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;