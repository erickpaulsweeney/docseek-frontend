import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Grid,
    Box,
    TextField,
    Container,
    Typography,
    Button,
    FormControl,
    FormLabel,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Card,
    CardContent,
    CardActions,
    Chip,
    Tabs,
    Tab,
} from "@mui/material";
import axiosClient from "../api-config";

export default function Doctors() {
    const [user, setUser] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [checked, setChecked] = useState({});
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState([]);
    const [showList, setShowList] = useState(false);
    const [maxCost, setMaxCost] = useState("");
    const navigate = useNavigate();

    const handleCheckChange = (id) => {
        const newChecked = { ...checked, [id]: !checked[id] };
        const newSelected = Object.keys(newChecked).reduce((accu, curr) => {
            if (newChecked[curr] === true) {
                accu.push(curr);
            }
            return accu;
        }, []);
        setChecked(newChecked);
        setSelected(newSelected);
    };

    const fetchSpecialties = async () => {
        const response = await axiosClient.get("doctor/specialties");
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            setSpecialties(response.data);
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
                        "url(https://img.freepik.com/premium-vector/healthcare-medical-background-with-flat-icons-symbols_120542-243.jpg?w=2000)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "hue-rotate(10deg)",
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
                        <Grid
                            item
                            xs={12}
                            sx={{
                                borderBottom: 1,
                                borderColor: "divider",
                                mb: "2em",
                            }}
                        >
                            <Tabs value={"Doctors"} centered>
                                <Tab
                                    label={"Home"}
                                    value={"Home"}
                                    href="/patient"
                                />
                                <Tab label={"Profile"} value={"Profile"} href="/patient/profile" />
                                <Tab label={"Doctors"} value={"Doctors"} />
                            </Tabs>
                        </Grid>
                        <Grid container spacing={1} sx={{ my: "2em" }}>
                            <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    mb: "2em",
                                }}
                            >
                                <TextField
                                    type="text"
                                    name="search"
                                    value={search}
                                    label="Search by name"
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    mb: "2em",
                                }}
                            >
                                <TextField
                                    type="number"
                                    name="maxCost"
                                    value={maxCost}
                                    label="Search by max consultation cost"
                                    onChange={(event) =>
                                        setMaxCost(event.target.value)
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={0} px="1em">
                                    <Button
                                        variant="contained"
                                        sx={{ mx: "auto", mb: "2em" }}
                                        onClick={() => setShowList(!showList)}
                                    >
                                        Specialties
                                    </Button>
                                    {showList && (
                                        <FormControl
                                            component="fieldset"
                                            variant="standard"
                                        >
                                            <FormLabel component="legend">
                                                <Typography
                                                    variant="body1"
                                                    fontWeight="600"
                                                >
                                                    Search by specialty
                                                </Typography>
                                            </FormLabel>
                                            <FormGroup>
                                                <Grid container spacing={0}>
                                                    {specialties.length > 0 &&
                                                        specialties.map(
                                                            (
                                                                specialty,
                                                                index
                                                            ) => (
                                                                <Grid
                                                                    key={index}
                                                                    item
                                                                    xs={12}
                                                                    sm={6}
                                                                    md={4}
                                                                >
                                                                    <FormControlLabel
                                                                        label={
                                                                            specialty.name
                                                                        }
                                                                        control={
                                                                            <Checkbox
                                                                                checked={
                                                                                    checked[
                                                                                        specialty
                                                                                            .id
                                                                                    ]
                                                                                }
                                                                                onChange={() =>
                                                                                    handleCheckChange(
                                                                                        specialty.id
                                                                                    )
                                                                                }
                                                                                name={
                                                                                    specialty.name
                                                                                }
                                                                            />
                                                                        }
                                                                    />
                                                                </Grid>
                                                            )
                                                        )}
                                                </Grid>
                                                {/* <FormHelperText>
                                            {errorMsg}
                                        </FormHelperText> */}
                                            </FormGroup>
                                        </FormControl>
                                    )}
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography
                                    variant="h4"
                                    color="rgb(34 86 138)"
                                    textTransform="uppercase"
                                    fontWeight="500"
                                    align="center"
                                    mb="1em"
                                >
                                    Our doctors
                                </Typography>
                                <Grid container spacing={3}>
                                    {doctors.length > 0 &&
                                        doctors.map((doctor) => {
                                            if (maxCost) {
                                                if (doctor.rate > maxCost) {
                                                    return null;
                                                }
                                            }
                                            if (search.length > 0) {
                                                if (
                                                    !doctor.name.includes(
                                                        search.toLowerCase()
                                                    )
                                                ) {
                                                    return null;
                                                }
                                            }
                                            if (selected.length > 0) {
                                                if (
                                                    !selected.every((item) =>
                                                        doctor.specialty.includes(
                                                            Number(item)
                                                        )
                                                    )
                                                ) {
                                                    return null;
                                                }
                                            }
                                            return (
                                                <Grid
                                                    key={
                                                        doctor.name + doctor.id
                                                    }
                                                    item
                                                    xs
                                                >
                                                    <Card
                                                        key={
                                                            doctor.name +
                                                            doctor.id
                                                        }
                                                    >
                                                        <CardContent
                                                            sx={{
                                                                display: "flex",
                                                                flexDirection:
                                                                    "column",
                                                                position:
                                                                    "relative",
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="h5"
                                                                fontWeight="500"
                                                            >
                                                                Dr.{" "}
                                                                {doctor.name}
                                                            </Typography>
                                                            <Typography variant="caption">
                                                                {
                                                                    doctor.hospital
                                                                }
                                                            </Typography>
                                                            <Typography variant="caption">
                                                                {
                                                                    doctor.location
                                                                }
                                                            </Typography>
                                                            {doctor.rate && (
                                                                <Typography
                                                                    variant="h6"
                                                                    sx={{
                                                                        position:
                                                                            "absolute",
                                                                        top: "1em",
                                                                        right: "1em",
                                                                    }}
                                                                >
                                                                    $
                                                                    {
                                                                        doctor.rate
                                                                    }
                                                                </Typography>
                                                            )}
                                                            <Grid
                                                                container
                                                                spacing={1}
                                                                sx={{
                                                                    mt: "1em",
                                                                    display:
                                                                        "flex",
                                                                    justifyContent:
                                                                        "center",
                                                                    flexWrap:
                                                                        "wrap",
                                                                    gap: "1em",
                                                                }}
                                                            >
                                                                {doctor.specialty.map(
                                                                    (item) => (
                                                                        <Chip
                                                                            key={
                                                                                doctor.id +
                                                                                specialties[
                                                                                    item -
                                                                                        1
                                                                                ]
                                                                                    .name
                                                                            }
                                                                            label={
                                                                                specialties[
                                                                                    item -
                                                                                        1
                                                                                ]
                                                                                    .name
                                                                            }
                                                                            size="small"
                                                                            variant="contained"
                                                                            color="info"
                                                                            sx={{
                                                                                textTransform:
                                                                                    "uppercase",
                                                                            }}
                                                                        />
                                                                    )
                                                                )}
                                                            </Grid>
                                                        </CardContent>
                                                        <CardActions
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent:
                                                                    "flex-end",
                                                            }}
                                                        >
                                                            <Button
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/doctor/${doctor.id}`
                                                                    )
                                                                }
                                                            >
                                                                View details
                                                            </Button>
                                                            <Button
                                                                variant="contained"
                                                                disabled={
                                                                    doctor.timeslots ===
                                                                    null
                                                                }
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/consultation/new/${doctor.id}`
                                                                    )
                                                                }
                                                            >
                                                                Book a consult
                                                            </Button>
                                                        </CardActions>
                                                    </Card>
                                                </Grid>
                                            );
                                        })}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            )}
        </Grid>
    );
}
