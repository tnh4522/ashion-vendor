import {useState, useEffect} from 'react';
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import {useNavigate, useParams} from "react-router-dom";

const EditStock = () => {
    const {userData, logout} = useUserContext();
    const {openSuccessNotification, openErrorNotification} = useNotificationContext();
    const navigate = useNavigate();
    const {id} = useParams();

    const [stockData, setStockData] = useState({
        name: '',
        description: '',
        location: '',
    });

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const response = await API.get(`stocks/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${userData.access}`,
                    },
                });
                if (response.status === 200) {
                    setStockData(response.data);
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    openErrorNotification("Unauthorized access");
                    logout();
                    return;
                }
                console.error('There was an error fetching the stock data:', error);
                openErrorNotification('There was an error fetching the stock data');
            }
        };

        fetchStockData();
    }, [id, userData.access, openErrorNotification, logout]);

    const handleStockChange = (e) => {
        const {name, value} = e.target;
        setStockData({
            ...stockData,
            [name]: value,
        });
    };

    const handleStockSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await API.put(`stocks/${id}/`, stockData, {
                headers: {
                    'Authorization': `Bearer ${userData.access}`,
                },
            });
            if (response.status === 200) {
                openSuccessNotification('Stock updated successfully');
                navigate('/stocks');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                openErrorNotification("Unauthorized access");
                logout();
                return;
            }
            console.error('There was an error updating the stock:', error);
            openErrorNotification('There was an error updating the stock');
        }
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-4">
                        <h5 className="card-header">Edit Stock</h5>
                        <hr className="my-0"/>
                        <div className="card-body">
                            <form id="formEditStock" method="POST" onSubmit={handleStockSubmit}>
                                <div className="row">
                                    {/* Stock Name */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="name" className="form-label">Stock Name</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={stockData.name}
                                            onChange={handleStockChange}
                                            required
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="description"
                                            name="description"
                                            value={stockData.description}
                                            onChange={handleStockChange}
                                        />
                                    </div>

                                    {/* Address */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="location" className="form-label">Location</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={stockData.location}
                                            onChange={handleStockChange}
                                            required
                                        />
                                    </div>

                                    <div className="mt-2">
                                        <button type="submit" className="btn btn-primary me-2">Update Stock</button>
                                        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/stocks')}>Cancel</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditStock;
