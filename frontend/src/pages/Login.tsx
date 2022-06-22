import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios, { AxiosResponse, AxiosError } from "axios";
import { MdEmail } from "react-icons/md";
import { AiFillLock, AiOutlineClose } from "react-icons/ai";
import GoogleIcon from "../icons/Google.svg";
import FacebookIcon from "../icons/Facebook.svg";
import TwitterIcon from "../icons/Twitter.svg";
import GithubIcon from "../icons/Github.svg";
import AppIcon from "../icons/Icon.png";

type Message = {
    success?: string,
    error?: string
};

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { email, password } = formData;
    const [message, setMessage] = useState({text: '', color: ''});
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(() => {
        if (location.state !== null) {
            const { success, error } = location.state as Message;

            if (success) {
                setMessage({text: success , color: '#8BC34A'});
                setTimeout(() => setMessage({text: '', color: ''}), 2500);
            }
        
            if (error) {
                setMessage({text: error, color: '#df5950'});
                setTimeout(() => setMessage({text: '', color: ''}), 2500);
            }
        }
    }, []);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevFormData) => ({...prevFormData, [e.target.name]: e.target.value}));
        setMessage({text: '', color: ''});
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (email === '' || password === '') {
            setMessage({text: 'Please fill in all fields', color: '#df5950'});
            setTimeout(() => setMessage({text: '', color: ''}), 2500);
            return;
        }

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            setMessage({text: 'Please provide a valid email address', color: '#df5950'});
            setTimeout(() => setMessage({text: '', color: ''}), 2500);
            return;
        }

        try {
            const response: AxiosResponse = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/login`, { email, password }, { withCredentials: true });
            setMessage({text: response.data.message , color: '#8BC34A'});
            setFormData({ email: '', password: '' });
            setTimeout(() => navigate('/dashboard'), 800);
        } catch (error: AxiosError | any) {
            setMessage({text: error.response.data.error, color: '#df5950'});
            setTimeout(() => setMessage({text: '', color: ''}), 2500);
        }
    };

    return (
        <div className="login-form">
            <div className="login-container">
                <div className="logo-container">
                    <img src={AppIcon} alt="App Icon" className="app-logo" />
                    <h3 className="app-name" >Authentication App</h3>
                </div>
                <h3>Login</h3>
                {message.text !== '' ? (
                    <>
                        <div className="message-box" style={{background: `${message.color}`}}>
                            <p>{message.text}</p>
                            <div className="close-btn" onClick={() => setMessage({ text: '', color: '' })}><AiOutlineClose size="20px" color="white"/></div>
                        </div>
                    </>
                ): null}
                <form onSubmit={onSubmit}>
                    <div className="input-container">
                        <MdEmail size="25px" color="#828282" />
                        <input type="email" name="email" id="email" placeholder="Email" autoComplete="off" value={email} onChange={onChange} />
                    </div>
                    <div className="input-container">
                        <AiFillLock size="25px" color="#828282" />
                        <input type="password" name="password" id="password" placeholder="Password" autoComplete="off" value={password} onChange={onChange} />
                    </div>
                    <button type="submit">Login</button>
                </form>
                <Link to="/forgot-password" style={{textDecoration:"none", color: "white"}}><p className="navigate-link forgot">Forgot your password?</p></Link>
                <p>or continue with these social profile</p>
                <div className="icons-container">
                    <img src={GoogleIcon} alt="Google Icon" onClick={() => window.open(`${process.env.REACT_APP_SERVER_URL}/api/auth/google`, '_self')} />
                    <img src={FacebookIcon} alt="Facebook Icon" onClick={() => window.open(`${process.env.REACT_APP_SERVER_URL}/api/auth/facebook`, '_self')} />
                    <img src={TwitterIcon} alt="Twitter Icon" onClick={() => window.open(`${process.env.REACT_APP_SERVER_URL}/api/auth/twitter`, '_self')} />
                    <img src={GithubIcon} alt="Github Icon" onClick={() => window.open(`${process.env.REACT_APP_SERVER_URL}/api/auth/github`, '_self')} />
                </div>
                <p>Don't have an account yet? <Link to="/" style={{textDecoration:"none", color: "white"}}><span className="navigate-link">Register</span></Link></p>
            </div>
        </div>
    );
};

export default Login;