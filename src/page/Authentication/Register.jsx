import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../service/service.jsx";
import { CONFIG_HEADER } from "../../service/config.jsx";
import LogoAdmin from "../../component/LogoAdmin.jsx";
import { Link } from "react-router-dom";

function Register() {
    document.title = "Register | Ashion";

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!termsAccepted) {
            setError("You must accept the terms and conditions");
            return;
        }
        if (email === "" || password === "" || userName === "") {
            setError("All fields are required");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        if (password !== confirmPassword) {
            setError("Password and Confirm Password do not match");
            return;
        }
        const data = {
            username: userName,
            email: email,
            password: password,
            password2: confirmPassword,
            role: 2
        };
        try {
            const response = await API.post("/register", data, CONFIG_HEADER);
            if (response.status === 201) {
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <LogoAdmin />
                <h4 className="mb-2">Adventure starts here 🚀</h4>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <p className="mb-4">Make your app management easy and fun!</p>

                <form id="formAuthentication" className="mb-3" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                            Username
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                            autoFocus
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3 form-password-toggle">
                        <label className="form-label" htmlFor="password">
                            Password
                        </label>
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
                    <div className="mb-3 form-password-toggle">
                        <label className="form-label" htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <div className="input-group input-group-merge">
                            <input
                                type="password"
                                id="confirmPassword"
                                className="form-control"
                                name="confirmPassword"
                                placeholder="••••••••"
                                aria-describedby="confirmPassword"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <span className="input-group-text cursor-pointer">
                <i className="bx bx-hide"></i>
              </span>
                        </div>
                    </div>

                    <div className="mb-3">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="terms-conditions"
                                name="terms"
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="terms-conditions">
                                I agree to
                                <a href="#"> privacy policy & terms</a>
                            </label>
                        </div>
                    </div>
                    <button className="btn btn-primary d-grid w-100">Sign up</button>
                </form>

                <p className="text-center">
                    <span>Already have an account? </span>
                    <Link to="/login">
                        <span>Sign in instead</span>
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
