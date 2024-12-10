import { useEffect, useState } from "react";
import { getDistrictInformation } from "./Helper.jsx";

// eslint-disable-next-line react/prop-types
function SelectDistrict({ province_id, selectedDistrict, onSelectDistrict = () => {} }) {
    const [districts, setDistricts] = useState([]);

    useEffect(() => {
        if (province_id) {
            getDistrictInformation(province_id).then((districts) => {
                if (Array.isArray(districts)) {
                    setDistricts(districts);
                } else {
                    setDistricts([]);
                }
            });
        } else {
            setDistricts([]);
        }
    }, [province_id]);

    return (
        <select
            className="form-select"
            value={selectedDistrict || ""}
            onChange={(e) => onSelectDistrict(e.target.value)}
        >
            <option value="" disabled>
                Please select a district
            </option>
            {Array.isArray(districts) &&
                districts.map((district) => (
                    <option key={district.DistrictID} value={district.DistrictID}>
                        {district.DistrictName}
                    </option>
                ))}
        </select>
    );
}

export default SelectDistrict;
