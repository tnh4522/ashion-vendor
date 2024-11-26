import PropTypes from 'prop-types';

const OrderSummary = ({ orderData }) => {
    return (
        <div className="col-md-12">
            <div className="row justify-content-end">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h6 className="card-title">Order Summary</h6>
                            <div className="d-flex justify-content-between mb-1">
                                <span>Subtotal:</span>
                                <span>${orderData.subtotal_price}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-1">
                                <span>Shipping:</span>
                                <span>${orderData.shipping_cost}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-1">
                                <span>Tax:</span>
                                <span>${orderData.tax_amount}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-1">
                                <span>Discount:</span>
                                <span>${orderData.discount_amount}</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between">
                                <strong>Total:</strong>
                                <strong>${orderData.total_price}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

OrderSummary.propTypes = {
    orderData: PropTypes.shape({
        subtotal_price: PropTypes.number.isRequired,
        shipping_cost: PropTypes.number.isRequired,
        tax_amount: PropTypes.number.isRequired,
        discount_amount: PropTypes.number.isRequired,
        total_price: PropTypes.number.isRequired
    }).isRequired
};

export default OrderSummary;
