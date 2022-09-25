import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import "flatpickr/dist/themes/airbnb.css";
import Flatpickr from "react-flatpickr";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Consultation() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [doctor, setDoctor] = useState(null);
    const [date, setDate] = useState(null);
    const [days, setDays] = useState(null);
    const [day, setDay] = useState(null);
    const [time, setTime] = useState(null);
    const [booked, setBooked] = useState([]);
    const navigate = useNavigate();

    const fetchConsults = async () => {
        const response = await axiosClient.get(`doctor/consultation?id=${id}`);
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            setBooked(response.data);
        }
    };

    const fetchDoctors = async () => {
        const response = await axiosClient.get("doctor/list");
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            const doctor = response.data.filter((el) => el.id == id)[0];
            setDoctor(doctor);
            const available = doctor.timeslots.slots.reduce(
                (accu, curr, idx) => {
                    if (curr.length > 0) {
                        accu.push(idx);
                    }
                    return accu;
                },
                []
            );
            setDays(available);
        }
    };

    const submitAppointment = async () => {
        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        };
        let formattedDate = date[0]
            .toLocaleDateString("en", options)
            .split("/");
        formattedDate.unshift(formattedDate.pop());
        formattedDate = formattedDate.join("-");

        const header = { headers: { "Content-Type": "application/json" } };
        const body = {
            doctor_id: Number(id),
            patient_id: user.id,
            date: formattedDate,
            time,
            status: "Pending",
            cost: doctor.rate,
        };

        const response = await axiosClient.post(
            "/patient/consultation/new",
            body,
            header
        );
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            alert("Appointment successfully set!");
            navigate("/");
        }
    };

    useEffect(() => {
        if (date) {
            const getDay = date[0].getDay();
            setDay(getDay);
        }
    }, [date]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("docSeekUser"));
        if (!data) {
            navigate("/login");
        } else {
            setUser(data.data);
            fetchDoctors();
            fetchConsults();
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
                        "url(https://www.energiepositiefleven.nu/wp-content/uploads/Energiepositief-Zorgen-scaled.jpeg)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    zIndex: "-1",
                }}
            />
            {user && doctor && (
                <Container maxWidth="sm" sx={{ my: "3em" }}>
                    <Typography variant="h3" align="center" gutterBottom>
                        Book your consult now
                    </Typography>
                    <Typography align="center" sx={{ mb: "2em" }}>
                        Your health matters to us.
                    </Typography>
                    <Card
                        sx={{
                            background: "#ffffffdd",
                            width: "100%",
                            position: "relative",
                        }}
                    >
                        <IconButton
                            sx={{
                                position: "absolute",
                                top: "0.5em",
                                left: "0.5em",
                            }}
                            onClick={() => navigate("/patient/list")}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <CardContent>
                            <Box component="form">
                                <Grid
                                    container
                                    spacing={2}
                                    flexDirection="column"
                                    justifyContent="center"
                                    alignItems="center"
                                    sx={{ mb: "1em" }}
                                >
                                    <Grid item xs={12} mb="-1em">
                                        <Typography
                                            variant="overline"
                                            fontSize="1em"
                                            align="center"
                                        >
                                            Your doctor is
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} mb="1em">
                                        <Typography variant="h4" align="center">
                                            Dr. {doctor.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} mb="-1em">
                                        <Typography
                                            variant="overline"
                                            fontSize="1em"
                                            align="center"
                                        >
                                            Consult cost is
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} mb="1em">
                                        <Typography variant="h4" align="center">
                                            ${doctor.rate}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} mb="-1em">
                                        <Typography
                                            variant="overline"
                                            fontSize="1em"
                                            align="center"
                                        >
                                            Date of consult is
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Flatpickr
                                            data-enable-time
                                            value={date}
                                            options={{
                                                enableTime: false,
                                                allowInput: true,
                                                minDate: new Date().setHours(
                                                    0,
                                                    0,
                                                    0,
                                                    0
                                                ),
                                                enable: [
                                                    function (date) {
                                                        return days.includes(
                                                            date.getDay()
                                                        );
                                                    },
                                                ],
                                            }}
                                            onChange={(date) => {
                                                setDate(date);
                                                setTime(null);
                                            }}
                                            style={{
                                                textAlign: "center",
                                                fontFamily: "Poppins",
                                                fontSize: "1.5em",
                                                padding: "0.1em",
                                            }}
                                        />
                                    </Grid>
                                    {date && day !== null && (
                                        <>
                                            <Grid item xs={12}>
                                                <Typography
                                                    variant="overline"
                                                    fontSize="1em"
                                                    align="center"
                                                >
                                                    Time of consult is
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                container
                                                spacing={0}
                                                flexWrap="wrap"
                                                justifyContent="center"
                                                alignItems="center"
                                                gap="1em"
                                                px="1em"
                                            >
                                                {doctor.timeslots.slots[
                                                    day
                                                ].map((timeslot) => {
                                                    const sameDate =
                                                        booked.find(
                                                            (item) =>
                                                                Date(
                                                                    item.date
                                                                ) ==
                                                                Date(date[0])
                                                        );
                                                    if (sameDate) {
                                                        if (
                                                            sameDate.time ===
                                                            timeslot
                                                        ) {
                                                            return;
                                                        }
                                                    }
                                                    return (
                                                        <Button
                                                            key={timeslot}
                                                            size="small"
                                                            variant={
                                                                timeslot ===
                                                                time
                                                                    ? "contained"
                                                                    : "outlined"
                                                            }
                                                            onClick={() =>
                                                                setTime(
                                                                    timeslot
                                                                )
                                                            }
                                                        >
                                                            {timeslot}
                                                        </Button>
                                                    );
                                                })}
                                            </Grid>
                                        </>
                                    )}
                                    {date && time && (
                                        <Grid item xs={12} mt="3em">
                                            <Button
                                                size="large"
                                                variant="contained"
                                                sx={{ width: "100%" }}
                                                onClick={() =>
                                                    submitAppointment()
                                                }
                                            >
                                                Book Consult
                                            </Button>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>
                        </CardContent>
                    </Card>
                </Container>
            )}
        </Grid>
    );
}
