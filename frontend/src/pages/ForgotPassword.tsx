import { useState } from "react";
import { Link } from "react-router-dom";
import axios, { AxiosResponse, AxiosError } from "axios";
import { MdEmail } from "react-icons/md";
import { AiOutlineLeft, AiOutlineClose } from "react-icons/ai";
import AppIcon from "../icons/Icon.png";

const ForgotPassword = () => {
    const [formData, setFormData] = useState({ email: '' });
    const [message, setMessage] = useState({text: '', color: ''});

    const { email } = formData;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevFormData) => ({...prevFormData, [e.target.name]: e.target.value}));
        setMessage({text: '', color: ''});
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (email === '') {
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
            const response: AxiosResponse = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/forgot-password`, { email }, { withCredentials: true });
            setMessage({text: response.data.message, color: '#8BC34A'});
            setTimeout(() => setMessage({text: '', color: ''}), 2500);
            setFormData({ email: '' });
        } catch (error: AxiosError | any) {
            setMessage({text: error.response.data.error, color: '#df5950'});
            setTimeout(() => setMessage({text: '', color: ''}), 2500);
        }
    }

    return (
        <div className="forgot-password-form">
            <div className="forgot-password-container">
                <div className="logo-container">
                    <img src={AppIcon} alt="App Icon" className="app-logo" />
                    <h3 className="app-name" >Authentication App</h3>
                </div>
                <h3>Forgot Password</h3>
                <p className="forgot-password-description">Enter your email and we'll send you a link to reset your password</p>
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
                    <button type="submit">Submit</button>
                </form>
                <div className="back-to-login-container">
                    <Link to="/login" style={{textDecoration:"none", color: "white"}}><p className="navigate-link"><AiOutlineLeft size="12px" />Back to Login</p></Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;