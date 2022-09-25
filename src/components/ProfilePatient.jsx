import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    Tab,
    Tabs,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import axiosClient from "../api-config";

export default function ProfilePatient() {
    const [user, setUser] = useState(null);
    const [doctors, setDoctors] = useState(null);
    const [appointments, setAppointments] = useState(null);
    const navigate = useNavigate();

    const fetchDoctors = async () => {
        const response = await axiosClient.get("doctor/list");
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            setDoctors(response.data);
        }
    };

    const fetchAppointments = async () => {
        const response = await axiosClient.get("patient/consultation");
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            setAppointments(response.data);
        }
    };

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("docSeekUser"));
        if (!data) {
            navigate("/login");
        } else {
            setUser(data.data);
            fetchDoctors();
            fetchAppointments();
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
                        "url(https://media-exp1.licdn.com/dms/image/C4D1BAQHfJGTbk_PrGQ/company-background_10000/0/1603803348388?e=2147483647&v=beta&t=5RJW1d8tVPg2gO_7Wfakp8hVBZh_DPyiHzwB_2OgjDc)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "hue-rotate(30deg)",
                    zIndex: "-1",
                }}
            />
            <Container
                maxWidth="lg"
                sx={{
                    py: "3em",
                    backgroundColor: "#ffffff81",
                    minHeight: "100vh",
                    position: "relative",
                }}
            >
                {user && (
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
                            <Tabs value={"Profile"} centered>
                                <Tab
                                    label={"Home"}
                                    value={"Home"}
                                    href="/patient"
                                />
                                <Tab label={"Profile"} value={"Profile"} />
                                <Tab
                                    label={"Doctors"}
                                    value={"Doctors"}
                                    href="/patient/list"
                                />
                            </Tabs>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    display: "flex",
                                    justifyCenter: "center",
                                    mb: "2em",
                                }}
                            >
                                <Box
                                    component="img"
                                    maxWidth="sm"
                                    mx="auto"
                                    src={
                                        "https://cegeress.fr/wp-content/uploads/2021/02/cegeress-centre-formation-gestion-stress-anxiete-professionnel-sante-toulouse-1.png"
                                    }
                                    sx={{ width: "100%" }}
                                />
                            </Grid>

                            <Typography
                                variant="h4"
                                align="center"
                                fontWeight="600"
                            >
                                {user.name}
                            </Typography>

                            <Grid container spacing={2} my="2em">
                                <Grid item xs mx="2em">
                                    <Typography variant="h6" align="center">
                                        Sex
                                    </Typography>
                                    <Typography variant="body2" align="center">
                                        {user.sex[0].toUpperCase() + user.sex.slice(1)}
                                    </Typography>
                                </Grid>

                                <Grid item xs mx="2em">
                                    <Typography variant="h6" align="center">
                                        Age
                                    </Typography>
                                    <Typography variant="body2" align="center">
                                        {user.age} years
                                    </Typography>
                                </Grid>

                                <Grid item xs mx="2em">
                                    <Typography variant="h6" align="center">
                                        Weight
                                    </Typography>
                                    <Typography variant="body2" align="center">
                                        {user.weight} kilograms
                                    </Typography>
                                </Grid>

                                <Grid item xs mx="2em">
                                    <Typography variant="h6" align="center">
                                        Blood Group
                                    </Typography>
                                    <Typography variant="body2" align="center">
                                        {user.blood_group}
                                    </Typography>
                                </Grid>

                                <Grid item xs mx="2em">
                                    <Typography variant="h6" align="center">
                                        Location
                                    </Typography>
                                    <Typography variant="body2" align="center">
                                        {user.location}
                                    </Typography>
                                </Grid>
                            </Grid>

                            {user.past_diseases && (
                                <>
                                    <Typography
                                        variant="h6"
                                        fontWeight="500"
                                        textTransform="uppercase"
                                        align="center"
                                        sx={{
                                            width: "100%",
                                            mt: "3em",
                                            mb: "1em",
                                        }}
                                    >
                                        Past health issues
                                    </Typography>
                                    {user.past_diseases.map((item) => {
                                        const [issue, duration] =
                                            item.split(" for ");
                                        return (
                                            <>
                                                <Typography
                                                    variant="h6"
                                                    align="center"
                                                >
                                                    {issue}
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    align="center"
                                                >
                                                    {duration}
                                                </Typography>
                                            </>
                                        );
                                    })}
                                </>
                            )}
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                my: "2em",
                            }}
                        >
                            <Button
                                size="large"
                                variant="contained"
                                sx={{ borderRadius: "2em" }}
                                onClick={() => navigate("/profile-patient")}
                            >
                                Edit your profile
                            </Button>
                        </Grid>
                    </Grid>
                )}
            </Container>
        </Grid>
    );
}
