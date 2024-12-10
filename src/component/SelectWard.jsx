import { useEffect, useState } from "react";
import { getWardInformation } from "./Helper.jsx";

// eslint-disable-next-line react/prop-types
function SelectWard({ district_id, selectedWard, onSelectWard = () => {} }) {
    const [wards, setWards] = useState([]);

    useEffect(() => {
        if (district_id) {
            getWardInformation(district_id).then((wards) => {
                if (Array.isArray(wards)) {
                    console.log(wards);
                    setWards(wards);
                } else {
                    setWards([]);
                }
            });
        } else {
            setWards([]);
        }
    }, [district_id]);

    return (
        <select
            className="form-select"
            value={selectedWard || ""}
            onChange={(e) => onSelectWard(e.target.value)}
        >
            <option value="" disabled>
                Please select a ward
            </option>
            {Array.isArray(wards) &&
                wards.map((ward) => (
                    <option key={ward.WardCode} value={ward.WardCode}>
                        {ward.WardName}
                    </option>
                ))}
        </select>
    );
}

export default SelectWard;
