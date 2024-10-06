
import React, { useState, useEffect } from 'react';
import './CompStyles/Login.css'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios';
const Login: React.FC = ()=> {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                handleLogin();
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []);
    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3001/login', {
                username,
                password,
            });

            if (response.data.token) {
                alert('Login successful');
                navigate('/dashboard');
                // You might want to store the token in a state or local storage for further use
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            setLoginError('Invalid credentials');
        }
        setUsername('');
        setPassword('');
    };
    return (
        <div className={'login-container'}>
            <h2>Sign In</h2>
            <form>
                {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
                <div className={'input-container'}>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => {setUsername(e.target.value); setLoginError("")}}
                        placeholder="Username"
                    />
                </div>
                <div className={'input-container'}>
                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {setPassword(e.target.value); setLoginError("")}}

                    />
                </div>
                <button type="button" onClick={handleLogin}>
                    Sign In
                </button>
                <div className="separator">or</div>
                <button type="button" className={'b2'}>
                    Continue with Google
                </button>
                <button type="button" className={'b2'}>
                    Continue with Facebook
                </button>
            </form>

            <h3>Not a member yet?  | <Link to={'/auth/register'}>Sign Up</Link></h3>
            <h4> <a href={'./Navigation.tsx'}>Forgot Password</a></h4>
        </div>
    );
};

export default Login;
