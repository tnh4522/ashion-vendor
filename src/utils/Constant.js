export const  orderStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELED: 'CANCELED',
  RETURNED: 'RETURNED'
};

export const paymentMethods = [
  {value: 'COD', label: 'Cash on Delivery'},
  {value: 'BANK_TRANSFER', label: 'Bank Transfer'},
  {value: 'CREDIT_CARD', label: 'Credit Card'},
  {value: 'PAYPAL', label: 'PayPal'}
];
export const paymentStatus = [
  {value: 'UNPAID', label: 'Unpaid'},
  {value: 'PAID', label: 'Paid'},
  {value: 'REFUNDED', label: 'Refuned'}
];

export const shippingMethods = [
  {value: 'STANDARD', label: 'Standard Shipping'},
  {value: 'EXPRESS', label: 'Express Shipping'}
];

export const sizes = [
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' }
];