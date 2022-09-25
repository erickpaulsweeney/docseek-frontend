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
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import axiosClient from "../api-config";

export default function ProfileDoctorEdit() {
    const [user, setUser] = useState(null);
    const [specialties, setSpecialties] = useState([]);
    const [checked, setChecked] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    const [qualiInputs, setQualiInputs] = useState([
        { training: "", institution: "" },
        { training: "", institution: "" },
    ]);
    const [expInputs, setExpInputs] = useState([
        { experience: "", institution: "", start: "", end: "" },
    ]);
    const navigate = useNavigate();

    const checkDates = (input) => {
        const [month, year] = input.split("/");
        if (month > 12 || year < 1900 || year > 2022) {
            alert("Invalid date entry.");
            return false;
        }
        return true;
    };

    const handleCheckChange = (id) => {
        setChecked({ ...checked, [id]: !checked[id] });
    };

    const handleAddExpInput = () => {
        setExpInputs((prev) => [
            ...prev,
            { experience: "", institution: "", start: "", end: "" },
        ]);
    };

    const handleRemoveExpInput = (index) => {
        const newList = [...expInputs];
        newList.splice(index, 1);
        setExpInputs(newList);
    };

    const handleExpInputChange = (event, index) => {
        const { name, value } = event.target;
        const newList = [...expInputs];
        newList[index][name] = value;
        setExpInputs(newList);
    };

    const handleAddQualiInput = () => {
        setQualiInputs((prev) => [...prev, { training: "", institution: "" }]);
    };

    const handleRemoveQualiInput = (index) => {
        const newList = [...qualiInputs];
        newList.splice(index, 1);
        setQualiInputs(newList);
    };

    const handleQualiInputChange = (event, index) => {
        const { name, value } = event.target;
        const newList = [...qualiInputs];
        newList[index][name] = value;
        setQualiInputs(newList);
    };

    const saveProfile = async (input) => {
        const header = { headers: { "Content-Type": "application/json" } };
        const response = await axiosClient.post(
            "doctor/profile/save",
            input,
            header
        );
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            alert("Profile saved successfully!");
            localStorage.setItem("docSeekUser", JSON.stringify(response.data));
            navigate("/home");
        }
    }

    const handleProfileSave = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const location = data.get("location");
        const hospital = data.get("hospital");

        for (const { start, end } of expInputs) {
            if (!checkDates(start) || !checkDates(end)) {
                return;
            }
        }

        const qualification = qualiInputs.map(
            (entry) => `${entry.training} in ${entry.institution}`
        );


        const experience = expInputs.map(
            (entry) =>
                `${entry.experience} in ${entry.institution} from ${entry.start} to ${entry.end}`
        );
        
        const specialty = Object.keys(checked).reduce((accu, curr) => {
            if (checked[curr] === true) {
                accu.push(curr);
            }
            return accu;
        }, [])

        saveProfile({ id: user.id, qualification, experience, hospital, location, specialty });
    };

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
            if (data.data.role !== "doctor") {
                navigate("/profile-patient");
            }
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
                        "url(https://www.energiepositiefleven.nu/wp-content/uploads/Energiepositief-Zorgen-scaled.jpeg)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    // filter: "saturate(80%) blur(1px)",
                    zIndex: "-1",
                }}
            />
            {user && (
                <Container maxWidth="md" sx={{ my: "3em" }}>
                    <Typography variant="h3" align="center" gutterBottom>
                        Complete your profile
                    </Typography>
                    <Typography align="center" sx={{ mb: "2em" }}>
                        This will help serve our patient's trust.
                    </Typography>
                    <Card sx={{ background: "#ffffffdd", width: "100%" }}>
                        <CardContent>
                            <Box component="form" onSubmit={handleProfileSave}>
                                <Grid container spacing={2} sx={{ mb: "1em" }}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">
                                            Residence
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            variant="outlined"
                                            name="hospital"
                                            label="Current Hospital"
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            variant="outlined"
                                            name="location"
                                            label="Current Location"
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={0}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">
                                            Medical Qualifications
                                        </Typography>
                                        <Typography variant="caption">
                                            Please provide at least two.
                                        </Typography>
                                    </Grid>
                                    {qualiInputs.map((item, index) => (
                                        <Grid
                                            key={index}
                                            container
                                            spacing={2}
                                            sx={{ my: "0.25em" }}
                                        >
                                            <Grid item xs={11} md={6}>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    required={index < 2}
                                                    name={"training"}
                                                    label={
                                                        "Training " +
                                                        (index + 1)
                                                    }
                                                    value={
                                                        qualiInputs[index]
                                                            .training
                                                    }
                                                    onChange={(event) =>
                                                        handleQualiInputChange(
                                                            event,
                                                            index
                                                        )
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={11} md={5}>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    required={index < 2}
                                                    name={"institution"}
                                                    label={
                                                        "Institution " +
                                                        (index + 1)
                                                    }
                                                    value={
                                                        qualiInputs[index]
                                                            .institution
                                                    }
                                                    onChange={(event) =>
                                                        handleQualiInputChange(
                                                            event,
                                                            index
                                                        )
                                                    }
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                xs={1}
                                                md={1}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <IconButton
                                                    disabled={index < 2}
                                                    onClick={() =>
                                                        handleRemoveQualiInput(
                                                            index
                                                        )
                                                    }
                                                >
                                                    <CancelIcon color="error" />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    ))}
                                    <Button
                                        sx={{ mt: "1em", ml: "auto" }}
                                        onClick={handleAddQualiInput}
                                    >
                                        Add Training
                                    </Button>
                                </Grid>

                                <Grid container spacing={0}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">
                                            Medical Experience
                                        </Typography>
                                        <Typography variant="caption">
                                            Please provide at least one.
                                        </Typography>
                                    </Grid>
                                    {expInputs.map((item, index) => (
                                        <Grid
                                            key={index}
                                            container
                                            spacing={2}
                                            sx={{ my: "0.25em" }}
                                        >
                                            <Grid item xs={12} md={3.5}>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    required={index < 1}
                                                    name={"experience"}
                                                    label={
                                                        "Experience " +
                                                        (index + 1)
                                                    }
                                                    value={
                                                        expInputs[index]
                                                            .experience
                                                    }
                                                    onChange={(event) =>
                                                        handleExpInputChange(
                                                            event,
                                                            index
                                                        )
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={3.5}>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    required={index < 1}
                                                    name={"institution"}
                                                    label={
                                                        "Institution " +
                                                        (index + 1)
                                                    }
                                                    value={
                                                        expInputs[index]
                                                            .institution
                                                    }
                                                    onChange={(event) =>
                                                        handleExpInputChange(
                                                            event,
                                                            index
                                                        )
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={5} md={2}>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    required={index < 1}
                                                    name={"start"}
                                                    label={
                                                        "Start Date " +
                                                        (index + 1)
                                                    }
                                                    value={
                                                        expInputs[index].start
                                                    }
                                                    onChange={(event) =>
                                                        handleExpInputChange(
                                                            event,
                                                            index
                                                        )
                                                    }
                                                    placeholder="MM/YYYY"
                                                />
                                            </Grid>
                                            <Grid item xs={5} md={2}>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    required={index < 1}
                                                    name={"end"}
                                                    label={
                                                        "End Date " +
                                                        (index + 1)
                                                    }
                                                    value={expInputs[index].end}
                                                    onChange={(event) =>
                                                        handleExpInputChange(
                                                            event,
                                                            index
                                                        )
                                                    }
                                                    placeholder="MM/YYYY"
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                xs={1}
                                                md={1}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <IconButton
                                                    disabled={index < 1}
                                                    onClick={() =>
                                                        handleRemoveExpInput(
                                                            index
                                                        )
                                                    }
                                                >
                                                    <CancelIcon color="error" />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    ))}
                                    <Button
                                        sx={{ mt: "1em", ml: "auto" }}
                                        onClick={handleAddExpInput}
                                    >
                                        Add Experience
                                    </Button>
                                </Grid>

                                <Grid container spacing={0}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">
                                            Specialty
                                        </Typography>
                                    </Grid>
                                    <Grid container spacing={0}>
                                        <FormControl
                                            component="fieldset"
                                            variant="standard"
                                        >
                                            <FormLabel component="legend">
                                                <Typography variant="caption">
                                                    Please select at least one
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
                                                <FormHelperText>
                                                    {errorMsg}
                                                </FormHelperText>
                                            </FormGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{ width: "100%", mt: "2em" }}
                                    >
                                        Save profile
                                    </Button>
                                </Grid>
                            </Box>
                        </CardContent>
                    </Card>
                </Container>
            )}
        </Grid>
    );
}
