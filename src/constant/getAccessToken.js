import axios from 'axios';
import getModuleConfig from './moduleConfig.js';

const MODULE_NAME = 'vivapayments';

const getAccessToken = async () => {
    try {
        const config = getModuleConfig(MODULE_NAME);

        const isTestMode = config.test_mode.toLowerCase() === 'on';

        const clientId = isTestMode ? config.client_id_test : config.client_id_prod;
        const clientSecret = isTestMode ? config.client_secret_test : config.client_secret_prod;
        const connectTokenUrl = isTestMode ? config.connect_token_url_test : config.connect_token_url_prod;

        if (!clientId || !clientSecret || !connectTokenUrl) {
            throw new Error('Missing necessary configuration for access token retrieval.');
        }

        const storedToken = sessionStorage.getItem('viva_access_token');
        if (storedToken) {
            const accessToken = JSON.parse(storedToken);
            if (accessToken.expires_time > Math.floor(Date.now() / 1000)) {
                return accessToken.access_token;
            }
        }

        const params = new URLSearchParams();
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);
        params.append('grant_type', 'client_credentials');

        const response = await axios.post('/api-viva-accounts/connect/token', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': '*',
            },
        });

        const data = response.data;

        if (!data.access_token) {
            throw new Error('Error Processing Request: No Access Token');
        }

        const expiresTime = Math.floor(Date.now() / 1000) + data.expires_in;

        const tokenData = {
            access_token: data.access_token,
            expires_time: expiresTime,
        };
        sessionStorage.setItem('viva_access_token', JSON.stringify(tokenData));

        return data.access_token;
    } catch (error) {
        console.error('Failed to get access token:', error);
        throw error;
    }
};

export default getAccessToken;
