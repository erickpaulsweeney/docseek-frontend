import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("docSeekUser"));
        if (!data) {
            navigate("/login");
        } else {
            if (data.data.role === "patient") {
                navigate("/patient");
            } else {
                navigate("/doctor");
            }
        }
        // eslint-disable-next-line
    }, []);

    return <></>;
}
