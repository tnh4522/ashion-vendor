import {useNavigate} from "react-router-dom";

const EditPaymentMethod = () => {
    const navigator = useNavigate();
    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-4">
                        <div className="card-body">
                            <form id="formCreateStock" method="POST">
                                <div className="row">
                                    {/* Stock Name */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="name" className="form-label">Payment Method</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="name"
                                            name="name"
                                            value="Card Payment"
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
                                            value="Payment method for card payment"
                                            name="description"
                                        />
                                    </div>

                                    {/* Module Payment */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="module_payment" className="form-label">Module Payment</label>
                                        <select
                                            className="form-select"
                                            id="module_payment"
                                            name="module_payment"
                                        >
                                            <option value="1">Viva</option>
                                            <option value="2">Module 2</option>
                                        </select>
                                    </div>

                                    {/* Status */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="status" className="form-label">Status</label>
                                        <select className="form-select" id="status" name="status">
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </select>
                                    </div>

                                    <div className="mt-2 text-end">
                                        <button type="reset" className="btn btn-outline-secondary me-2" onClick={() => {navigator('/payment')}}>Cancel
                                        </button>
                                        <button type="button" className="btn btn-primary">Confirm changes</button>
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

export default EditPaymentMethod;
