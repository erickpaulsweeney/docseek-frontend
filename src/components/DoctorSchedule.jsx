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
    CardActions,
    Tabs,
    Tab,
    Chip,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import axiosClient from "../api-config";

export default function DoctorSchedule() {
    const [user, setUser] = useState(null);
    const [editRate, setEditRate] = useState(false);
    const [newRate, setNewRate] = useState("");
    const [checked, setChecked] = useState([]);
    const [editTimeslots, setEditTimeslots] = useState(false);
    const [scheduled, setScheduled] = useState(false);
    const navigate = useNavigate();

    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    const times = [
        "08:00",
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
    ];

    const handleCheckChange = (index, time) => {
        const newChecked = [...checked];
        newChecked[index][time] = !newChecked[index][time];
        setChecked(newChecked);
    };

    const saveRate = async () => {
        const body = { id: user.id, rate: newRate };
        const header = { headers: { "Content-Type": "application/json" } };
        const response = await axiosClient.post("doctor/rate", body, header);
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            alert("Rate saved succesffully!");
            const data = JSON.parse(localStorage.getItem("docSeekUser"));
            data.data = response.data;
            localStorage.setItem("docSeekUser", JSON.stringify(data));
            window.location.reload();
        }
    };

    const saveTimeslots = async () => {
        const timeslots = checked.map((day, idx) =>
            Object.keys(day).reduce((accu, curr) => {
                if (checked[idx][curr] === true) {
                    accu.push(curr);
                }
                return accu;
            }, [])
        );

        const body = { id: user.id, timeslots: { slots: timeslots } };
        const header = { headers: { "Content-Type": "application/json" } };
        const response = await axiosClient.post(
            "doctor/timeslots",
            body,
            header
        );
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            alert("Timeslots saved successfully!");
            const data = JSON.parse(localStorage.getItem("docSeekUser"));
            data.data = response.data;
            localStorage.setItem("docSeekUser", JSON.stringify(data));
            window.location.reload();
        }
    };

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("docSeekUser"));
        if (!data) {
            navigate("/login");
        } else {
            setUser(data.data);
            setNewRate(data.data.rate ? data.data.rate : "");
            let checked = [{}, {}, {}, {}, {}, {}, {}];
            if (data.data.timeslots?.slots) {
                for (let i = 0; i < 7; i++) {
                    times.forEach((time) => {
                        const available = data.data.timeslots?.slots[i];
                        if (available.includes(time)) {
                            checked[i][time] = true;
                        } else {
                            checked[i][time] = false;
                        }
                    });
                }
            }
            setChecked(checked);
            setScheduled(
                Boolean(data.data.timeslots) || Boolean(data.data.rate)
            );
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
                        "url(https://media-exp1.licdn.com/dms/image/C4E1BAQEwG4zlN38DEQ/company-background_10000/0/1646254447758?e=2147483647&v=beta&t=Ly_odGIZw_lrNe7pZd2wnvFFz4iafFW_JQZRJZaiIt8)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "hue-rotate(15deg)",
                    zIndex: "-1",
                }}
            />
            {user && checked.length > 0 && (
                <Container
                    maxWidth="lg"
                    sx={{
                        py: "3em",
                        backgroundColor: "#ffffff81",
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
                            <Tabs value={"Consultations"} centered>
                                <Tab
                                    label={"Home"}
                                    value={"Home"}
                                    href={"/doctor"}
                                />
                                <Tab
                                    label={"Profile"}
                                    value={"Profile"}
                                    href={"/doctor/profile"}
                                />
                                <Tab
                                    label={"Consultations"}
                                    value={"Consultations"}
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
                                <Box
                                    component="img"
                                    maxWidth="sm"
                                    src={
                                        "https://www.lakeb2b.com/wp-content/uploads/2021/02/healthcare-banner.png"
                                    }
                                    sx={{ width: "100%", mt: "2em", mb: "2em" }}
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
                                    variant="h6"
                                    fontWeight="500"
                                    gutterBottom
                                >
                                    Consultation Rate
                                </Typography>
                                {!editRate && (
                                    <>
                                        <Typography
                                            variant="h4"
                                            fontWeight="500"
                                        >
                                            {user.rate
                                                ? `$${user.rate}`
                                                : "No set rate yet"}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            sx={{ my: "3em" }}
                                            onClick={() => setEditRate(true)}
                                        >
                                            Edit rate
                                        </Button>
                                    </>
                                )}
                                {editRate && (
                                    <>
                                        <TextField
                                            name="rate"
                                            type="number"
                                            label="Enter your new rate"
                                            InputProps={{
                                                inputProps: { min: 0 },
                                            }}
                                            my="1em"
                                            value={newRate}
                                            onChange={(event) =>
                                                setNewRate(event.target.value)
                                            }
                                        />
                                        <Button
                                            variant="contained"
                                            sx={{ my: "2em" }}
                                            onClick={() => saveRate(newRate)}
                                        >
                                            Save rate
                                        </Button>
                                    </>
                                )}
                            </Grid>
                            <Grid item xs={12} container spacing={1}>
                                <Grid item xs={12}>
                                    <Typography
                                        variant="h5"
                                        align="center"
                                        fontWeight="500"
                                    >
                                        Timeslots
                                    </Typography>
                                </Grid>
                                {!editTimeslots &&
                                    user.timeslots?.slots &&
                                    user.timeslots?.slots?.map((day, index) => {
                                        if (day.length === 0) {
                                            return;
                                        }

                                        const dayName = days[index];
                                        return (
                                            <Grid
                                                item
                                                key={index}
                                                xs={12}
                                                sm={6}
                                                md={3}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    my="1em"
                                                    align="center"
                                                >
                                                    {dayName}
                                                </Typography>
                                                <Grid
                                                    container
                                                    spacing={0}
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "center",
                                                        flexWrap: "wrap",
                                                        gap: "1em",
                                                        p: "1em",
                                                    }}
                                                >
                                                    {day.map((time) => (
                                                        <Chip
                                                            key={index + time}
                                                            label={time}
                                                            color="info"
                                                        />
                                                    ))}
                                                </Grid>
                                            </Grid>
                                        );
                                    })}
                                {editTimeslots &&
                                    user.timeslots?.slots &&
                                    user.timeslots?.slots?.map((day, index) => {
                                        const dayName = days[index];
                                        return (
                                            <Grid
                                                key={day + index}
                                                item
                                                xs={12}
                                                sm={6}
                                            >
                                                <FormControl
                                                    component="fieldset"
                                                    variant="standard"
                                                >
                                                    <FormLabel component="legend">
                                                        <Typography
                                                            variant="h6"
                                                            my="1em"
                                                            fontWeight="500"
                                                        >
                                                            {dayName}
                                                        </Typography>
                                                    </FormLabel>
                                                    <FormGroup>
                                                        <Grid
                                                            container
                                                            spacing={0}
                                                        >
                                                            {times.map(
                                                                (time, idx) => (
                                                                    <Grid
                                                                        key={
                                                                            idx
                                                                        }
                                                                        item
                                                                        xs={6}
                                                                    >
                                                                        <FormControlLabel
                                                                            label={
                                                                                time
                                                                            }
                                                                            control={
                                                                                <Checkbox
                                                                                    checked={
                                                                                        checked[
                                                                                            index
                                                                                        ][
                                                                                            time
                                                                                        ]
                                                                                    }
                                                                                    onChange={() =>
                                                                                        handleCheckChange(
                                                                                            index,
                                                                                            time
                                                                                        )
                                                                                    }
                                                                                    name={
                                                                                        time
                                                                                    }
                                                                                />
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                )
                                                            )}
                                                        </Grid>
                                                    </FormGroup>
                                                </FormControl>
                                            </Grid>
                                        );
                                    })}
                                {!user.timeslots.slots && (
                                    <Grid item xs={12}>
                                        <Typography
                                            variant="h4"
                                            fontWeight="500"
                                            align="center"
                                        >
                                            No set timeslots yet
                                        </Typography>
                                    </Grid>
                                )}
                                <Grid
                                    item
                                    xs={12}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        my: "3em",
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => {
                                            if (editTimeslots) {
                                                saveTimeslots();
                                            }
                                            setEditTimeslots(!editTimeslots);
                                        }}
                                    >
                                        {editTimeslots
                                            ? "Save timeslots"
                                            : "Edit timeslots"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            )}
        </Grid>
    );
}
