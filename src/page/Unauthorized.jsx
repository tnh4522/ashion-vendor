import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div className="container">
            <h1>403 - Không Có Quyền Truy Cập</h1>
            <p>Bạn không có quyền truy cập vào trang này.</p>
            <Link to="/">Quay lại Trang Chủ</Link>
        </div>
    );
};

export default Unauthorized;
