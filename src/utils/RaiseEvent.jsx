import API from "../service/service.jsx";

async function RaiseEvent(userData, status, action, modelName, context = '', data = null) {
    const log = {
        user: userData.id,
        status: status,
        action: action,
        model: modelName,
        context: context,
        data: data,
    };

    try {
        const response = await API.post('activity/create/', log, {
            headers: {
                'Authorization': `Bearer ${userData.access}`,
            }
        });

        if (response.status === 201) {
            console.log('Activity log created successfully.');
        }

    } catch (error) {
        console.error('Error creating activity log:', error);
    }
}

export default RaiseEvent;
