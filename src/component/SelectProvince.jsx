import { useState, useEffect } from "react";
import provincesData from "../constant/province.json";

// eslint-disable-next-line react/prop-types
function SelectProvince({ selectedProvince, onSelectProvince }) {
    const [provinces, setProvinces] = useState([]);

    useEffect(() => {
        const fetchedProvinces = provincesData.data.map((item) => item);
        setProvinces(fetchedProvinces);
    }, []);



    return (
        <select className="form-select" value={selectedProvince} onChange={(e) => onSelectProvince(e.target.value)}>
            <option>Please select a province</option>
            {provinces.map((province, index) => (
                <option key={index} value={province.ProvinceID}>
                    {province.ProvinceName}
                </option>
            ))}
        </select>
    );
}

export default SelectProvince;
