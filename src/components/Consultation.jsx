import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Grid,
    Box,
    TextField,
    Container,
    Typography,
    IconButton,
    Button,
    FormControl,
    FormLabel,
    FormGroup,
    FormControlLabel,
    FormHelperText,
    Checkbox,
    Avatar,
    Card,
    CardContent,
    CardActions,
    Chip,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import axiosClient from "../api-config";

export default function Consultation() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("docSeekUser"));
        if (!data) {
            navigate("/login");
        } else {
            setUser(data.data);
        }
        // eslint-disable-next-line
    }, []);
    
    return (
        <></>
    )
}