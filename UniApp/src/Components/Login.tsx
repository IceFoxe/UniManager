import React, { useState, useEffect } from 'react';
import './CompStyles/Login.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    login: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  };
}

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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
        if (!username || !password) {
            setLoginError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post<LoginResponse>('http://localhost:3001/api/auth/login', {
                login: username,
                password,
            }, {
                withCredentials: true,
            });

            const { token, user } = response.data;

            // Store token in localStorage
            localStorage.setItem('authToken', token);
            
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(user));

            // Set authorization header for future requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Redirect based on user role
            switch (user.role) {
                case 'admin':
                    navigate('/admin/dashboard');
                    break;
                case 'teacher':
                    navigate('/teacher/dashboard');
                    break;
                case 'student':
                    navigate('/student/dashboard');
                    break;
                default:
                    navigate('/dashboard');
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.error || 'Invalid credentials';
                setLoginError(message);
            } else {
                setLoginError('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Sign In</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
                <div className="input-container">
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => {setUsername(e.target.value); setLoginError("");}}
                        placeholder="Username or Email"
                        disabled={isLoading}
                    />
                </div>
                <div className="input-container">
                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {setPassword(e.target.value); setLoginError("");}}
                        disabled={isLoading}
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={isLoading}
                >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
                <div className="separator">or</div>
                <button type="button" className="b2" disabled={isLoading}>
                    Continue with Google
                </button>
                <button type="button" className="b2" disabled={isLoading}>
                    Continue with Facebook
                </button>
            </form>

            <h3>Not a member yet? | <Link to="/auth/register">Sign Up</Link></h3>
            <h4><Link to="/auth/forgot-password">Forgot Password</Link></h4>
        </div>
    );
};

export default Login;