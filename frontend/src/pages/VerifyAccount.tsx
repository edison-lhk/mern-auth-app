import axios, { AxiosResponse, AxiosError } from "axios";
import { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineLeft } from "react-icons/ai";
import { Link } from "react-router-dom";
import AppIcon from "../icons/Icon.png";

const VerifyAccount = () => {
    const [message, setMessage] = useState({text: '', color: ''});

    const token = window.location.href.split('/').pop();

    useEffect(() => {

        const verifyAccount = async () => {
            try {
                const response: AxiosResponse = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/verify-account`, { token }, { withCredentials: true });
                setMessage({text: response.data.message, color: '#8BC34A'});
                setTimeout(() => setMessage({text: '', color: ''}), 2500);
            } catch (error: AxiosError | any) {
                setMessage({text: error.response.data.error, color: '#df5950'});
                setTimeout(() => setMessage({text: '', color: ''}), 2500);
            }
        };

        verifyAccount();

    }, []);

    const resendVerificationEmail = async () => {
        try {
            const response: AxiosResponse = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/resend-verification-email`, { token }, { withCredentials: true });
            setMessage({text: response.data.message, color: '#8BC34A'});
            setTimeout(() => setMessage({text: '', color: ''}), 2500);
        } catch (error: AxiosError | any) {
            setMessage({text: error.response.data.error, color: '#df5950'});
            setTimeout(() => setMessage({text: '', color: ''}), 2500);
        }
    }

    return (
        <div className="verify-account-form">
            <div className="verify-account-container">
                <div className="logo-container">
                    <img src={AppIcon} alt="App Icon" className="app-logo" />
                    <h3 className="app-name" >Authentication App</h3>
                </div>
                <h3>Verify Account</h3>
                <p className="resend-email-description">If your token has expired, <span className="resend-email-link" onClick={resendVerificationEmail} >click here</span> to resend the verification email.</p>
                {message.text !== '' ? (
                    <>
                        <div className="message-box" style={{background: `${message.color}`}}>
                            <p>{message.text}</p>
                            <div className="close-btn" onClick={() => setMessage({ text: '', color: '' })}><AiOutlineClose size="20px" color="white"/></div>
                        </div>
                    </>
                ): null}
                <div className="back-to-login-container">
                    <Link to="/login" style={{textDecoration:"none", color: "white"}}><p className="navigate-link"><AiOutlineLeft size="12px" />Back to Login</p></Link>
                </div>
            </div>
        </div>
    )
}

export default VerifyAccount;