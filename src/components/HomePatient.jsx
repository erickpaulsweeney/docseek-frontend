import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Grid,
    Box,
    Container,
    Typography,
    Button,
    Avatar,
    Card,
    CardContent,
    Tabs,
    Tab,
} from "@mui/material";
import axiosClient from "../api-config";

export default function HomePatient() {
    const [user, setUser] = useState(null);
    const [consults, setConsults] = useState({ past: [], upcoming: [] });
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate();

    const fetchConsults = async () => {
        const response = await axiosClient.get("patient/consultation");
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            const upcoming = response.data.filter(
                (el) => el.status === "Approved"
            );
            const past = response.data.filter(
                (el) => el.status === "Completed"
            );
            setConsults({ past, upcoming });
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
            fetchConsults();
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
            {user && doctors.length > 0 && (
                <Container
                    maxWidth="lg"
                    sx={{
                        py: "3em",
                        backgroundColor: "#ffffffb7",
                        minHeight: "100vh",
                    }}
                >
                    <Grid container spacing={1}>
                        <Grid
                            item
                            xs={12}
                            sx={{
                                borderBottom: 1,
                                borderColor: "divider",
                                mb: "2em",
                            }}
                        >
                            <Tabs value={"Home"} centered>
                                <Tab label={"Home"} value={"Home"} />
                                <Tab
                                    label={"Profile"}
                                    value={"Profile"}
                                    href="/patient/profile"
                                />
                                <Tab
                                    label={"Doctors"}
                                    value={"Doctors"}
                                    href="/patient/list"
                                />
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
                                    maxWidth="sm"
                                    src={
                                        "https://www.brainvire.com/wp/wp-content/uploads/2020/05/Healthcare-banner.png"
                                    }
                                    sx={{ width: "100%", mb: "1em" }}
                                />
                                <Grid item xs={12}>
                                    <Typography
                                        variant="h5"
                                        align="center"
                                        fontWeight="600"
                                        mb="0.5em"
                                    >
                                        Upcoming Consults
                                    </Typography>
                                </Grid>

                                {consults.upcoming.length === 0 && (
                                    <Grid item xs={12}>
                                        <Typography vaariant="overline" mb="2em">
                                            No upcoming consults
                                        </Typography>
                                    </Grid>
                                )}
                                {consults.upcoming.length > 0 &&
                                    consults.upcoming.map((consult) => {
                                        const doctor = doctors.find(
                                            (el) => el.id === consult.doctor_id
                                        );
                                        return (
                                            <Grid item xs={12} m="2em">
                                                <Card sx={{ p: "1em" }}>
                                                    <CardContent>
                                                        <Typography variant="overline">
                                                            Your doctor:
                                                        </Typography>
                                                        <Typography variant="h6" gutterBottom>
                                                            Dr. {doctor.name}
                                                        </Typography>
                                                        <Typography variant="overline">
                                                            Date of consult:
                                                        </Typography>
                                                        <Typography variant="h6" gutterBottom>
                                                            {consult.date.slice(0, 10)}
                                                        </Typography>
                                                        <Typography variant="overline">
                                                            Time of consult:
                                                        </Typography>
                                                        <Typography variant="h6" gutterBottom>
                                                            {consult.time}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        );
                                    })}
                                
                                <Grid item xs={12}>
                                    <Typography
                                        variant="h5"
                                        align="center"
                                        fontWeight="600"
                                        mb="0.5em"
                                    >
                                        Past Consults
                                    </Typography>
                                </Grid>

                                {consults.past.length === 0 && (
                                    <Grid item xs={12}>
                                        <Typography vaariant="overline" mb="2em">
                                            No upcoming consults
                                        </Typography>
                                    </Grid>
                                )}
                                {consults.past.length > 0 &&
                                    consults.past.map((consult) => {
                                        const doctor = doctors.find(
                                            (el) => el.id === consult.doctor_id
                                        );
                                        return (
                                            <Grid item xs={12} m="2em">
                                                <Card sx={{ p: "1em" }}>
                                                    <CardContent>
                                                        <Typography variant="overline">
                                                            Your doctor:
                                                        </Typography>
                                                        <Typography variant="h6" gutterBottom>
                                                            Dr. {doctor.name}
                                                        </Typography>
                                                        <Typography variant="overline">
                                                            Date of consult:
                                                        </Typography>
                                                        <Typography variant="h6" gutterBottom>
                                                            {consult.date.slice(0, 10)}
                                                        </Typography>
                                                        <Typography variant="overline">
                                                            Time of consult:
                                                        </Typography>
                                                        <Typography variant="h6" gutterBottom>
                                                            {consult.time}
                                                        </Typography>
                                                        <Typography variant="overline">
                                                            Prescription:
                                                        </Typography>
                                                        <Typography variant="h6" gutterBottom>
                                                            {consult.prescription}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        );
                                    })}
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
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => logOut()}
                            >
                                Logout
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            )}
        </Grid>
    );
}
