import {useState} from 'react';
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import {useNavigate} from "react-router-dom";

const CreateStock = () => {
    const {userData, logout} = useUserContext();
    const {openSuccessNotification, openErrorNotification} = useNotificationContext();
    const navigate = useNavigate();

    const [stockData, setStockData] = useState({
        name: '',
        description: '',
        location: '',
    });

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
            const response = await API.post('stocks/create/', stockData, {
                headers: {
                    'Authorization': `Bearer ${userData.access}`,
                },
            });
            if (response.status === 201) {
                openSuccessNotification('Stock created successfully');
                navigate('/stocks');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                openErrorNotification("Unauthorized access");
                logout();
                return;
            }
            console.error('There was an error creating the stock:', error);
            openErrorNotification('There was an error creating the stock');
        }
    };


    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-4">
                        <h5 className="card-header">Create Stock</h5>
                        <hr className="my-0"/>
                        <div className="card-body">
                            <form id="formCreateStock" method="POST" onSubmit={handleStockSubmit}>
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
                                        <button type="submit" className="btn btn-primary me-2">Create Stock</button>
                                        <button type="reset" className="btn btn-outline-secondary">Cancel</button>
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

export default CreateStock;
