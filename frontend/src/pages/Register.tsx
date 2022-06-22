import { useState } from "react";
import { Link } from "react-router-dom";
import axios, { AxiosResponse, AxiosError } from "axios";
import { AiOutlineUser, AiOutlineClose } from "react-icons/ai";
import { MdEmail } from "react-icons/md";
import { AiFillLock } from "react-icons/ai";
import GoogleIcon from "../icons/Google.svg";
import FacebookIcon from "../icons/Facebook.svg";
import TwitterIcon from "../icons/Twitter.svg";
import GithubIcon from "../icons/Github.svg";
import AppIcon from "../icons/Icon.png";

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirm_password: '' });
    const { username, email, password, confirm_password } = formData;
    const [message, setMessage] = useState({text: '', color: ''});

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevFormData) => ({...prevFormData, [e.target.name]: e.target.value}));
        setMessage({text: '', color: ''});
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (username === '' || email === '' || password === '' || confirm_password === '') {
            setMessage({text: 'Please fill in all fields', color: '#df5950'});
            setTimeout(() => setMessage({text: '', color: ''}), 2500);
            return;
        }

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            setMessage({text: 'Please provide a valid email address', color: '#df5950'});
            setTimeout(() => setMessage({text: '', color: ''}), 2500);
            return;
        }

        if (password !== confirm_password) {
            setMessage({text: 'Passwords do not match', color: '#df5950'});
            setTimeout(() => setMessage({text: '', color: ''}), 2500);
            return;
        }

        if (password.length < 6) {
            setMessage({text: 'Password should contain at least 6 characters', color: '#df5950'});
            setTimeout(() => setMessage({text: '', color: ''}), 2500);
            return;
        }

        try {
            const response: AxiosResponse  = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/register`, { username, email, password }, { withCredentials: true });
            setMessage({text: response.data.message, color: '#8BC34A'});
            setFormData({ username: '', email: '', password: '', confirm_password: '' });
            setTimeout(() => setMessage({text: '', color: ''}), 2500);
        } catch (error: AxiosError | any) {
            setMessage({text: error.response.data.error, color: '#df5950'});
            setTimeout(() => setMessage({text: '', color: ''}), 2500);
        }
    }

    return (
        <div className="register-form">
            <div className="register-container">
                <div className="logo-container">
                    <img src={AppIcon} alt="App Icon" className="app-logo" />
                    <h3 className="app-name" >Authentication App</h3>
                </div>
                <h3>Join thousands of learners from around the world</h3>
                <p className="register-description">Master web development by making real-life projects. There are multiple paths for you to choose</p>
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
                        <AiOutlineUser size="25px" color="#828282" />
                        <input type="text" name="username" id="username" placeholder="Username" autoComplete="off" value={username} onChange={onChange} />
                    </div>
                    <div className="input-container">
                        <MdEmail size="25px" color="#828282" />
                        <input type="email" name="email" id="email" placeholder="Email" autoComplete="off" value={email} onChange={onChange} />
                    </div>
                    <div className="input-container">
                        <AiFillLock size="25px" color="#828282" />
                        <input type="password" name="password" id="password" placeholder="Password" autoComplete="off" value={password} onChange={onChange} />
                    </div>
                    <div className="input-container">
                        <AiFillLock size="25px" color="#828282" />
                        <input type="password" name="confirm_password" id="confirm_password" placeholder="Confirm Password" autoComplete="off" value={confirm_password} onChange={onChange} />
                    </div>
                    <button type="submit">Start coding now</button>
                </form>
                <p>or continue with these social profile</p>
                <div className="icons-container">
                    <img src={GoogleIcon} alt="Google Icon" onClick={() => window.open(`${process.env.REACT_APP_SERVER_URL}/api/auth/google`, '_self')} />
                    <img src={FacebookIcon} alt="Facebook Icon" onClick={() => window.open(`${process.env.REACT_APP_SERVER_URL}/api/auth/facebook`, '_self')} />
                    <img src={TwitterIcon} alt="Twitter Icon" onClick={() => window.open(`${process.env.REACT_APP_SERVER_URL}/api/auth/twitter`, '_self')} />
                    <img src={GithubIcon} alt="Github Icon" onClick={() => window.open(`${process.env.REACT_APP_SERVER_URL}/api/auth/github`, '_self')} />
                </div>
                <p>Already a member? <Link to="/login" style={{textDecoration:"none", color: "white"}}><span className="navigate-link">Login</span></Link></p>
            </div>
        </div>
    );
};

export default Register;