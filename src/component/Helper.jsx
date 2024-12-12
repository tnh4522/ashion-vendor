import axios from "axios";

const GTTK_TOKEN = 'ac51542f-b632-11ef-81b6-5e2e958f07fa';
const SHOP_ID =	5512583;

async function getDistrictInformation(province_id) {
    const endpoint = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/district';
    try {
        const response = await axios.get(endpoint, {
            headers: {
                token: GTTK_TOKEN,
            },
            params: {
                province_id: province_id,
            },
        });
        const districts = response.data.data;
        return Array.isArray(districts) ? districts : [];
    } catch (error) {
        console.error("Error fetching district information:", error);
        return [];
    }
}



async function getWardInformation(district_id) {
    const endpoint = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward';
    try {
        const response = await axios.get(endpoint, {
            headers: {
                token: GTTK_TOKEN,
            },
            params: {
                district_id: district_id,
            },
        });

        const wards = response.data.data;
        return Array.isArray(wards) ? wards : [];
    } catch (error) {
        console.error('Error fetching ward information:', error);
        return [];
    }
}

function getAvailableService(from_district, to_district) {
    const endpoint = 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services';
    try {
        const response = axios.get(endpoint, {
            headers: {
                'token': GTTK_TOKEN,
            },
            params: {
                shop_id: SHOP_ID,
                from_district: from_district,
                to_district: to_district,
            },
        })

        return response.data;

    } catch (error) {
        console.error('Error fetching available service:', error);
    }
}


export { getDistrictInformation, getWardInformation, getAvailableService , GTTK_TOKEN, SHOP_ID};