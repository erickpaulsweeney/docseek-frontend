import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Grid,
    Card,
    CardContent,
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
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import axiosClient from "../api-config";

export default function HomeDoctor() {
    const [user, setUser] = useState(null);
    const [specialties, setSpecialties] = useState([]);
    const [checked, setChecked] = useState({});
    const navigate = useNavigate();

    const fetchSpecialties = async () => {
        const response = await axiosClient.get("doctor/specialties");
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            setSpecialties(
                response.data.sort((a, b) => {
                    if (a.name < b.name) {
                        return -1;
                    }
                    if (a.name > b.name) {
                        return 1;
                    }
                    return 0;
                })
            );
            const newChecked = response.data.reduce((accu, curr) => {
                accu[curr.id] = false;
                return accu;
            }, {});
            setChecked(newChecked);
        }
    };

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("docSeekUser"));
        if (!data) {
            navigate("/login");
        } else {
            setUser(data.data);
            fetchSpecialties();
        }
        // eslint-disable-next-line
    }, []);

    return (
        <Grid
            component="main"
            sx={{
                minHeight: "100vh",
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "100vh",
                    width: "100vw",
                    backgroundImage:
                        "url(https://img.freepik.com/vetores-gratis/medicina-e-saude-na-cor-azul_1017-26807.jpg?w=2000)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "hue-rotate(25deg)",
                    zIndex: "-1",
                }}
            />
            {user && (
                <Container
                    maxWidth="lg"
                    sx={{
                        py: "3em",
                        backgroundColor: "#ffffff81",
                        minHeight: "100vh",
                    }}
                >
                    <Grid container spacing={1}>
                        <Grid item container spacing={1} xs={12}>
                            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                                <Avatar
                                    src="/images/med_logo.png"
                                    sx={{ width: 150, height: 150, border: "0.25em solid rgb(34 86 138)" }}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: "500",
                                        color: "rgb(34 86 138)",
                                    }}
                                >
                                    DocSeek
                                </Typography>
                                <Typography variant="overline" align="center" color="rgb(34 86 138)">Where we provide a one-stop solution to patients and doctors alike</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            )}
        </Grid>
    );
}
