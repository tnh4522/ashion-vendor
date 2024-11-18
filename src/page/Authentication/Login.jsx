import {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import API from "../../service/service.jsx";
import { CONFIG_HEADER } from "../../service/config.jsx";
import LogoAdmin from "../../component/LogoAdmin.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";


function Login() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {setUserData} = useUserContext();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userName === '' || password === '') {
            setError('All fields are required');
            return;
        }
        const data = {
            username: userName,
            password: password,
        };
        try {
            const response = await API.post('/login', data, CONFIG_HEADER);
            if (response.status === 200) {
                if(response.data.role) {
                    setUserData(response.data);
                    localStorage.setItem('data', JSON.stringify(response.data));
                    navigate('/');
                } else {
                    setError('Username or password is incorrect');
                }
            }
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <LogoAdmin />
                <h4 className="mb-2">Welcome to Ashion Admin! 👋</h4>
                <p className="mb-4">Please sign-in to your account and start the adventure</p>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form id="formAuthentication" className="mb-3" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email or Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="email"
                            name="email-username"
                            placeholder="Enter your email or username"
                            autoFocus
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3 form-password-toggle">
                        <div className="d-flex justify-content-between">
                            <label className="form-label" htmlFor="password">Password</label>
                            <Link to="">
                                <small>Forgot Password?</small>
                            </Link>
                        </div>
                        <div className="input-group input-group-merge">
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                name="password"
                                placeholder="••••••••"
                                aria-describedby="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span className="input-group-text cursor-pointer">
                <i className="bx bx-hide"></i>
              </span>
                        </div>
                    </div>
                    <div className="mb-3">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="remember-me" />
                            <label className="form-check-label" htmlFor="remember-me"> Remember Me </label>
                        </div>
                    </div>
                    <div className="mb-3">
                        <button className="btn btn-primary d-grid w-100" type="submit">Sign in</button>
                    </div>
                </form>

                <p className="text-center">
                    <span>New on our platform? </span>
                    <Link to="/register">
                        <span>Create an account</span>
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
