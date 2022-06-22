import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { AiFillCaretDown, AiOutlineLeft } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import axios, { AxiosResponse, AxiosError } from "axios";
import { toast } from "react-toastify";
import AppIcon from "../icons/Icon.png";

type User = {
    user?: {
        photo: string,
        username: string,
        bio: string,
        phone: string,
        email: string,
        password: string,
        authType: string
    } 
}

const EditInfo = () => {
    const [user, setUser] = useState({ photo: '',username: '', bio: '', phone: '', email: '', password: '', authType: '' });
    const { photo, username, bio, phone, email, password, authType } = user;
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const addPhotoRef = useRef<HTMLLabelElement>(null);
    const dropdownMenuRef = useRef<HTMLDivElement>(null);
    const showMenuBtnRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {

        if (location.state !== null) {
            const { user } = location.state as User;

            if (user) {
                setUser(user);
            }
        }

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

    const displayPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (!files || !files[0]) return;

        setUser(prevUser => ({ ...prevUser, photo: URL.createObjectURL(files[0])}));

        if (!addPhotoRef.current) return;

        addPhotoRef.current.style.opacity = '0';
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        setUser((prevUser) => ({...prevUser, [e.target.name]: e.target.value}));
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/users`, { photo , username , bio , phone, password }, { withCredentials: true });
            toast.success(response.data.message);
        } catch(error: AxiosError | any) {
            toast.error(error.response.data.error);
        }
    };

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
        <div className="edit-info-container">
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
            <div className="edit-info-section">
                <div className="back-to-dashboard-container">
                    <Link to="/dashboard" style={{ all: "unset" }}>
                        <p><AiOutlineLeft color="#2D9CDB" /><span>Back</span></p>
                    </Link>
                </div>
                <div className="edit-info-form-container">
                    <h3>Change Info</h3>
                    <p>Changes will be reflected to every services</p>
                    <form onSubmit={onSubmit}>
                        <div className="input-container photo">
                            {photo !== '' && photo ? (
                                <>
                                    <img src={photo} alt="Profile Picture" />
                                    <label htmlFor="photo" ref={addPhotoRef}></label>
                                </>
                            ) : <label htmlFor="photo" ref={addPhotoRef}>+</label>}
                            <input type="file" name="photo" id="photo" accept="image/*" onChange={displayPhoto} />
                            <p>CHANGE PHOTO</p>
                        </div>
                        <div className="input-container name">
                            <label htmlFor="username">Name</label>
                            <input type="text" name="username" id="username" placeholder="Enter your name..." autoComplete="off" value={username} onChange={onChange} />
                        </div>
                        <div className="input-container bio">
                            <label htmlFor="bio">Bio</label>
                            <textarea name="bio" id="bio" placeholder="Enter your bio..." autoComplete="off" value={bio} onChange={onChange} ></textarea>
                        </div>
                        <div className="input-container phone">
                            <label htmlFor="phone">Phone</label>
                            <input type="text" name="phone" id="phone" placeholder="Enter your phone..." autoComplete="off" value={phone} onChange={onChange} />
                        </div>
                        <div className="input-container email">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="email" placeholder="Enter your email..." autoComplete="off" value={email} readOnly />
                        </div>
                        {authType === 'local' ? (
                            <div className="input-container password">
                                <label htmlFor="password">Password</label>
                                <input type="password" name="password" id="password" placeholder="Enter your new password..." autoComplete="off" value={password} onChange={onChange} />
                            </div>
                        ) : null}
                        <button type="submit">Save</button>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default EditInfo;