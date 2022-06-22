import { useState } from "react";
import { AiFillLock, AiOutlineClose, AiOutlineLeft } from "react-icons/ai";
import axios, { AxiosResponse, AxiosError } from "axios";
import { Link } from "react-router-dom";
import AppIcon from "../icons/Icon.png";

const ResetPassword = () => {
    const [formData, setFormData] = useState({ password: '', confirm_password: '' });
    const [message, setMessage] = useState({text: '', color: ''});

    const { password, confirm_password } = formData;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevFormData) => ({...prevFormData, [e.target.name]: e.target.value}));
        setMessage({text: '', color: ''});
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password === '' || confirm_password === '') {
            setMessage({text: 'Please fill in all fields', color: '#df5950'});
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

        const token = window.location.href.split('/').pop(); 

        try {
            const response: AxiosResponse = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/auth/reset-password/${token}`, { password }, { withCredentials: true });
            setMessage({text: response.data.message, color: '#8BC34A'});
            setFormData({ password: '', confirm_password: '' });
            setTimeout(() => setMessage({text: '', color: ''}), 2500);
        } catch (error: AxiosError | any) {
            setMessage({text: error.response.data.error, color: '#df5950'});
            setTimeout(() => setMessage({text: '', color: ''}), 2500);
        }

    }

    return (
            <div className="reset-password-form">
                    <div className="reset-password-container">
                        <div className="logo-container">
                            <img src={AppIcon} alt="App Icon" className="app-logo" />
                            <h3 className="app-name" >Authentication App</h3>
                        </div>
                        <h3>Reset Password</h3>
                        <p className="reset-password-description">Enter a new password for your account</p>
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
                                <AiFillLock size="25px" color="#828282" />
                                <input type="password" name="password" id="password" placeholder="Password" autoComplete="off" value={password} onChange={onChange} />
                            </div>
                            <div className="input-container">
                                <AiFillLock size="25px" color="#828282" />
                                <input type="password" name="confirm_password" id="confirm_password" placeholder="Confirm Password" autoComplete="off" value={confirm_password} onChange={onChange} />
                            </div>
                            <button type="submit">Reset Password</button>
                        </form>
                        <div className="back-to-login-container">
                            <Link to="/login" style={{textDecoration:"none", color: "white"}}><p className="navigate-link"><AiOutlineLeft size="12px" />Back to Login</p></Link>
                        </div>
                    </div>
            </div>
    );
};

export default ResetPassword;