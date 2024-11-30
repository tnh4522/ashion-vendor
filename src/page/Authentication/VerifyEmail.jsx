import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import LogoAdmin from "../../component/LogoAdmin.jsx";

function VerifyEmail() {
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigate('/login');
        }, 5000);
    }, []);

    const [count, setCount] = useState(5);
    useEffect(() => {
        const interval = setInterval(() => {
            setCount(count - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [count]);

    return (
        <div className="card">
            <div className="card-body">
                <LogoAdmin/>
                <h4 className="mb-2">Your email is being verified</h4>
                <div className="m-2 text-center">
                    <img src="https://img.freepik.com/free-vector/green-double-circle-check-mark_78370-1749.jpg"
                         alt="verification" style={{width: "200px", height: "200px"}}/>
                </div>
                <p className="m-4 text-center">You will be redirected to the login page in {count} seconds</p>
            </div>
        </div>
    );
}

export default VerifyEmail;
