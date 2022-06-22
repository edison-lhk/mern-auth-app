import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import VerifyAccount from "./pages/VerifyAccount";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import EditInfo from "./pages/EditInfo";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    return (
        <div className="container">
            <Router basename="/">
                <Routes>
                    <Route path="/" element={<Register />} />
                    <Route path="/verify-account/:token" element={<VerifyAccount />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/edit-info" element={<EditInfo />} />
                </Routes>
                <ToastContainer />
            </Router>
        </div>
    );
};

export default App;
