import React, { useState } from 'react';
import { Modal, Radio, Button } from 'antd';

const ExportModal = ({ open, onClose, onExport }) => {
    const [fileType, setFileType] = useState('csv');

    const handleExport = () => {
        onExport(fileType);
    };

    return (
        <Modal
            title="Export Categories"
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="export" type="primary" onClick={handleExport}>
                    Export
                </Button>,
            ]}
        >
            <Radio.Group
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                style={{ display: 'flex', flexDirection: 'column' }}
            >
                <Radio value="csv">CSV</Radio>
                <Radio value="excel">Excel</Radio>
                <Radio value="json">JSON</Radio>
                <Radio value="pdf">PDF</Radio>
            </Radio.Group>
        </Modal>
    );
};

export default ExportModal;