// src/Login.tsx
import React, {useEffect, useState} from 'react';
import '../Components/Login.tsx'
import 'firebase/compat/auth';
import {Link} from "react-router-dom";
import axios from "axios";

const RegisterForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [email, setEmail] = useState('');
    const [passwordError, setPasswordError] = useState('');


    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                handleRegister();
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []);
    const handlePasswordChange = (e:any) => {
        const newPassword = e.target.value;
        setPassword(newPassword);

        // Real-time password matching validation
        if (repeatPassword !== newPassword) {
            setPasswordError('Passwords do not match');
        } else {
            setPasswordError('');
        }
    };

    const handleRepeatPasswordChange = (e:any) => {
        const newRepeatPassword = e.target.value;
        setRepeatPassword(newRepeatPassword);

        // Real-time password matching validation
        if (password !== newRepeatPassword) {
            setPasswordError('Passwords do not match');
        } else {
            setPasswordError('');
        }
    };
    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:3001/register', {
                username,
                password,
                email
            });
            if (response.data.error) {
                alert('register successful');
                // You might want to store the token in a state or local storage for further use
            } else {
                alert(response.data.error);
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
        setUsername('');
        setEmail('');
        setPassword('');
        setRepeatPassword('');
    };

    return (
        <div className={'login-container'}>
            <h2>Sign Up</h2>
            <form>
                <div className={'input-container'}>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                </div>
                <h4></h4>
                <div className={'input-container'}>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={"E-mail"}
                    />
                </div>
                <h4></h4>
                <div className={'input-container'}>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder={"Password"}
                    />
                </div>
                <div className={'input-container'}>
                    <input
                        type="password"
                        id="repeat-password"
                        value={repeatPassword}
                        onChange={handleRepeatPasswordChange}
                        placeholder={"Repeat Password"}
                    />
                </div>
                {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
                <button type="button" onClick={handleRegister}>
                    Sign Up
                </button>
                <div className="separator">or</div>
                <button type="button" className={'b2'}>
                    Sign up using Google
                </button>
                <button type="button" className={'b2'}>
                    Sign Up using Facebook
                </button>
            </form>

            <h3>Already a member?  | <Link to="/auth/login">Sign In</Link></h3>
            <h4> <a href={'../'}>Forgot Password</a></h4>

        </div>
    );
};

export default RegisterForm;
