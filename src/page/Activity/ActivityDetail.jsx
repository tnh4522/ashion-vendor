import { useEffect, useState } from 'react';
import { Descriptions, Spin, Button } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../service/service';
import useUserContext from '../../hooks/useUserContext';
import useNotificationContext from '../../hooks/useNotificationContext';

const ActivityDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userData, logout } = useUserContext();
    const { openErrorNotification } = useNotificationContext();

    const [loading, setLoading] = useState(true);
    const [activity, setActivity] = useState(null);

    const fetchActivityDetail = async () => {
        setLoading(true);
        try {
            const response = await API.get(`activity/detail/${id}/`, {
                headers: {
                    Authorization: `Bearer ${userData.access}`,
                },
            });
            setActivity(response.data);
        } catch (error) {
            console.error('Error fetching activity detail:', error);
            openErrorNotification('Error fetching activity details.');
            if (error.response && error.response.status === 401) {
                openErrorNotification('Unauthorized access');
                logout();
                return;
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id && userData.access) {
            fetchActivityDetail();
        }
    }, [id, userData.access]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!activity) {
        return <div>No activity found.</div>;
    }

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 className="card-title" style={{ color: '#696cff' }}>Activity Detail</h4>
                    <Button type="primary" onClick={() => navigate('/activity')}>
                        Back to Activity Logs
                    </Button>
                </div>
                <div className="card-body">
                    <Descriptions
                        bordered
                        column={1}
                    >
                        <Descriptions.Item label="User">{activity.user?.username || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Status">{activity.status || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Action">{activity.action || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Model">{activity.model || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Context">{activity.context || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Data">
                            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {JSON.stringify(activity.data, null, 2)}
                            </pre>
                        </Descriptions.Item>
                        <Descriptions.Item label="Time">
                            {new Date(activity.created_at).toLocaleString() || 'N/A'}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            </div>
        </div>
    );
};

export default ActivityDetail;
