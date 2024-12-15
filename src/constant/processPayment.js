import axios from 'axios';
import getModuleConfig from './moduleConfig.js';
import getAccessToken from './getAccessToken';

/**
 * Processes a payment by creating a payment order with VivaPayments.
 *
 * @param {object} paymentDetails - The details required to process the payment.
 * @param {number} paymentDetails.amount - The amount to be paid (in the smallest currency unit, e.g., cents).
 * @param {object} paymentDetails.customer - The customer information.
 * @param {string} paymentDetails.customer.email - Customer's email.
 * @param {string} paymentDetails.customer.fullName - Customer's full name.
 * @param {string} paymentDetails.customer.phone - Customer's phone number.
 * @param {string} paymentDetails.customer.countryCode - Customer's country code (ISO 3166-1 alpha-2).
 * @param {string} paymentDetails.customer.requestLang - Language code (e.g., "en-US").
 * @param {string} paymentDetails.sourceCode - The source code for VivaPayments.
 * @param {string} paymentDetails.merchantTrns - The merchant transaction reference.
 *
 * @returns {object} - The response from VivaPayments API.
 */
const processPayment = async (paymentDetails) => {
    try {
        const MODULE_NAME = 'vivapayments';
        const config = getModuleConfig(MODULE_NAME);

        const isTestMode = config.test_mode.toLowerCase() === 'on';

        const baseUrl = isTestMode ? config.base_url_test : config.base_url_prod;
        const merchantId = isTestMode ? config.merchant_id_test : config.merchant_id_prod;
        const paymentFormColor = config.payment_form_color || '';

        if (!baseUrl || !merchantId) {
            throw new Error('Missing necessary configuration for processing payment.');
        }

        let endpoint = `/api-viva-checkout/checkout/v2/orders?merchantId=${encodeURIComponent(merchantId)}`;

        if (paymentFormColor) {
            endpoint += `&color=${encodeURIComponent(paymentFormColor)}`;
        }

        const data = {
            amount: Math.round(paymentDetails.amount),
            customer: {
                email: paymentDetails.customer.email,
                fullName: paymentDetails.customer.fullName,
                phone: paymentDetails.customer.phone,
                countryCode: paymentDetails.customer.countryCode,
                requestLang: paymentDetails.customer.requestLang,
            },
            sourceCode: paymentDetails.sourceCode || 'Default',
            merchantTrns: paymentDetails.merchantTrns,
        };

        const accessToken = await getAccessToken();

        const response = await axios.post(endpoint, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Failed to process payment:', error);
        throw error;
    }
};

export default processPayment;
