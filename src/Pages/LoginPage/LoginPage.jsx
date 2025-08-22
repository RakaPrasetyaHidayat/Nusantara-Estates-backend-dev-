import React, { useRef } from "react";
import './login.css';
import LoginForm from "../../Components/loginForm/loginForm";

const LoginPage = () => {

    return (
        <div className="login-page">
            <LoginForm />
        </div>
    );
};

export default LoginPage;