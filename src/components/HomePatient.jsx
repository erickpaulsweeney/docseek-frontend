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
    Tabs, 
    Tab, 
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import axiosClient from "../api-config";

export default function HomePatient() {
    const [user, setUser] = useState(null);
    const [doctors, setDoctors] = useState([]);
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

    const fetchDoctors = async () => {
        const response = await axiosClient.get("doctor/list");
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            setDoctors(response.data);
        }
    };

    const logOut = () => {
        localStorage.removeItem("docSeekUser");
        alert("Log out successful!");
        navigate("/login");
    };

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("docSeekUser"));
        if (!data) {
            navigate("/login");
        } else {
            setUser(data.data);
            fetchSpecialties();
            fetchDoctors();
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
                        "url(https://wallpaperaccess.com/full/1282794.jpg)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "hue-rotate(25deg)",
                    zIndex: "-1",
                }}
            />
            {user && doctors.length > 0 && specialties.length > 0 && (
                <Container
                    maxWidth="lg"
                    sx={{
                        py: "3em",
                        backgroundColor: "#ffffffb7",
                        minHeight: "100vh",
                    }}
                >
                    <Grid container spacing={1}>
                        <Grid item xs={12} sx={{ borderBottom: 1, borderColor: "divider", mb: "2em" }}>
                            <Tabs value={"Home"} centered>
                                <Tab label={"Home"} value={"Home"} />
                                <Tab label={"Profile"} value={"Profile"} href="/patient/profile" />
                                <Tab label={"Doctors"} value={"Doctors"} href="/patient/list"/>
                            </Tabs>
                        </Grid>
                        <Grid item container spacing={1} xs={12}>
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Avatar
                                    src="/images/med_logo.png"
                                    sx={{
                                        width: 150,
                                        height: 150,
                                        border: "0.25em solid rgb(34 86 138)",
                                    }}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: "500",
                                        color: "rgb(34 86 138)",
                                    }}
                                >
                                    DocSeek
                                </Typography>
                                <Typography
                                    variant="overline"
                                    align="center"
                                    color="rgb(34 86 138)"
                                >
                                    Where we provide a one-stop solution to
                                    patients and doctors alike
                                </Typography>
                                <Box
                                    component="img"
                                    maxWidth="md"
                                    src={
                                        "https://www.brainvire.com/wp/wp-content/uploads/2020/05/Healthcare-banner.png"
                                    }
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Button variant="outlined" size="large" onClick={() => logOut()}>
                                Logout
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            )}
        </Grid>
    );
}
