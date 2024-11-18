import {useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import API from "../../service/service.jsx";
import {CONFIG_HEADER} from "../../service/config.jsx";
import LogoAdmin from "../../component/LogoAdmin.jsx";


function CreatePassword() {
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const userName = useParams().username;
    const token = useParams().token;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password1 === '' || password2 === '') {
            setError('All fields are required');
            return;
        }
        if (password1 !== password2) {
            setError('Passwords do not match');
            return;
        }
        const data = {
            username: userName,
            password: password1,
            password2: password2,
        };

        try {
            const response = await API.post('/users/create-password/', data, {
                headers: {'Authorization': `Bearer ${token}`,}
            });

            if (response.status === 201) {
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <LogoAdmin/>
                <h4 className="mb-2">Welcome to Ashion Admin! 👋</h4>
                <p className="mb-4">Please create your password</p>
                {error && <p style={{color: 'red'}}>{error}</p>}
                <form id="formAuthentication" className="mb-3" onSubmit={handleSubmit}>
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
                                onChange={(e) => setPassword1(e.target.value)}
                            />
                            <span className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
                        </div>
                    </div>
                    <div className="mb-3 form-password-toggle">
                        <div className="d-flex justify-content-between">
                            <label className="form-label" htmlFor="confirm-password">Confirm Password</label>
                        </div>
                        <div className="input-group input-group-merge">
                            <input
                                type="password"
                                id="confirm-password"
                                className="form-control"
                                name="confirm-password"
                                placeholder="••••••••"
                                aria-describedby="confirm-password"
                                onChange={(e) => setPassword2(e.target.value)}
                            />
                            <span className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
                        </div>
                    </div>
                    <div className="mb-3">
                        <button className="btn btn-primary d-grid w-100" type="submit">Create Password</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreatePassword;
