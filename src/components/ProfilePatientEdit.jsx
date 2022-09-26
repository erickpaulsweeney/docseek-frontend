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
    Radio,
    RadioGroup,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import axiosClient from "../api-config";

export default function ProfilePatientEdit() {
    const [user, setUser] = useState(null);
    const [specialties, setSpecialties] = useState([]);
    const [checked, setChecked] = useState([]);
    const [issues, setIssues] = useState([{ issue: "", duration: "" }]);
    const [sex, setSex] = useState("female");
    const [bloodGroup, setBloodGroup] = useState("A");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const handleCheckChange = (id) => {
        setChecked({ ...checked, [id]: !checked[id] });
    };

    const handleSexChange = (event) => {
        setSex(event.target.value);
    };

    const handleBloodGroupChange = (event) => {
        setBloodGroup(event.target.value);
    };

    const handleIssueChange = (event, index) => {
        const { name, value } = event.target;
        const newList = [...issues];
        newList[index][name] = value;
        setIssues(newList);
    };

    const handleRemoveIssue = (index) => {
        const newList = [...issues];
        newList.splice(index, 1);
        setIssues(newList);
    };

    const handleAddIssue = () => {
        setIssues((prev) => [...prev, { issue: "", duration: "" }]);
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
                if (user.looking_for?.includes(curr.id)) {
                    accu[curr.id] = true;
                } else {
                    accu[curr.id] = false;
                }
                return accu;
            }, {});
            setChecked(newChecked);
        }
    };

    const saveProfile = async (input) => {
        const header = { headers: { "Content-Type": "application/json" } };
        const response = await axiosClient.post(
            "patient/profile/save",
            input,
            header
        );
        if (response.status !== 200) {
            alert(response.response.data.message);
            return;
        } else {
            alert("Profile saved successfully!");
            const data = JSON.parse(localStorage.getItem("docSeekUser"));
            data.data = response.data;
            localStorage.setItem("docSeekUser", JSON.stringify(data));
            navigate("/patient/profile");
        }
    };

    const handleProfileSave = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const location = data.get("location");
        const age = data.get("age");
        const weight = data.get("weight");

        const past_diseases = issues.map(
            (entry) => `${entry.issue} for ${entry.duration} years`
        );

        const looking_for = Object.keys(checked).reduce((accu, curr) => {
            if (checked[curr] === true) {
                accu.push(curr);
            }
            return accu;
        }, []);

        saveProfile({
            id: user.id,
            past_diseases,
            location,
            looking_for,
            blood_group: bloodGroup,
            weight,
            sex,
            age,
        });
    };

    useEffect(() => {
        if (user) {
            fetchSpecialties();
            setSex(user.sex);
        }
        // eslint-disable-next-line
    }, [user]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("docSeekUser"));
        if (!data) {
            navigate("/login");
        } else {
            if (data.data.role !== "patient") {
                navigate("/profile-doctor");
            }
            setUser(data.data);
            const issues = data.data.past_diseases?.reduce((accu, curr) => {
                const issue = curr.split(" for ")[0];
                const duration = curr.split(" for ")[1].split(" ")[0];
                accu.push({ issue, duration });
                return accu;
            }, []);
            setIssues(issues);
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
            {user && (
                <Container maxWidth="md" sx={{ my: "3em" }}>
                    <Typography variant="h3" align="center" gutterBottom>
                        Complete your profile
                    </Typography>
                    <Typography align="center" sx={{ mb: "2em" }}>
                        This will help us serve you better.
                    </Typography>
                    <Card sx={{ background: "#ffffffdd", width: "100%" }}>
                        <CardContent>
                            <Box component="form" onSubmit={handleProfileSave}>
                                <Grid container spacing={2} sx={{ mb: "1em" }}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">
                                            Health Information
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl>
                                            <FormLabel
                                                id="sex"
                                                sx={{ fontWeight: "500" }}
                                            >
                                                Sex:
                                            </FormLabel>
                                            <RadioGroup
                                                row
                                                aria-labelledby="sex"
                                                name="sex"
                                                value={sex}
                                                onChange={handleSexChange}
                                                defaultValue={user.sex}
                                            >
                                                <FormControlLabel
                                                    value="female"
                                                    control={<Radio />}
                                                    label="Female"
                                                />
                                                <FormControlLabel
                                                    value="male"
                                                    control={<Radio />}
                                                    label="Male"
                                                />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl>
                                            <FormLabel
                                                id="bloodGroup"
                                                sx={{ fontWeight: "500" }}
                                            >
                                                Blood Group:
                                            </FormLabel>
                                            <RadioGroup
                                                row
                                                aria-labelledby="bloodGroup"
                                                name="bloodGroup"
                                                value={bloodGroup}
                                                onChange={
                                                    handleBloodGroupChange
                                                }
                                                defaultValue={user.blood_group}
                                            >
                                                <FormControlLabel
                                                    value="A"
                                                    control={<Radio />}
                                                    label="A"
                                                />
                                                <FormControlLabel
                                                    value="B"
                                                    control={<Radio />}
                                                    label="B"
                                                />
                                                <FormControlLabel
                                                    value="AB"
                                                    control={<Radio />}
                                                    label="AB"
                                                />
                                                <FormControlLabel
                                                    value="O"
                                                    control={<Radio />}
                                                    label="O"
                                                />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            type="number"
                                            variant="outlined"
                                            name="age"
                                            label="Age"
                                            InputProps={{
                                                inputProps: { min: 0 },
                                            }}
                                            required
                                            fullWidth
                                            defaultValue={user.age}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            type="number"
                                            variant="outlined"
                                            name="weight"
                                            label="Weight"
                                            InputProps={{
                                                inputProps: { min: 0 },
                                            }}
                                            required
                                            fullWidth
                                            placeholder="in kilograms"
                                            defaultValue={user.weight}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">
                                            Residence
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined"
                                            name="location"
                                            label="Current Location"
                                            required
                                            fullWidth
                                            defaultValue={user.location}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} sx={{ mb: "1em" }}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">
                                            Past Health Issues
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            gutterBottom
                                        >
                                            Please provide at least one.
                                        </Typography>
                                        {issues?.map((entry, index) => (
                                            <Grid
                                                container
                                                key={index}
                                                spacing={1}
                                                sx={{ my: "1em" }}
                                            >
                                                <Grid item xs={11} md={7}>
                                                    <TextField
                                                        variant="outlined"
                                                        name="issue"
                                                        required={index === 0}
                                                        fullWidth
                                                        label={
                                                            "Issue " +
                                                            (index + 1)
                                                        }
                                                        value={
                                                            issues[index].issue
                                                        }
                                                        onChange={(event) =>
                                                            handleIssueChange(
                                                                event,
                                                                index
                                                            )
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={11} md={4}>
                                                    <TextField
                                                        type="number"
                                                        variant="outlined"
                                                        name="duration"
                                                        required={index === 0}
                                                        fullWidth
                                                        label={
                                                            "Duration " +
                                                            (index + 1)
                                                        }
                                                        value={
                                                            issues[index]
                                                                .duration
                                                        }
                                                        onChange={(event) =>
                                                            handleIssueChange(
                                                                event,
                                                                index
                                                            )
                                                        }
                                                        placeholder="Number of years"
                                                    />
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={1}
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "center",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <IconButton
                                                        disabled={index === 0}
                                                        onClick={() =>
                                                            handleRemoveIssue(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <CancelIcon color="error" />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        ))}
                                    </Grid>
                                    <Button
                                        onClick={handleAddIssue}
                                        sx={{ mt: "1em", ml: "auto" }}
                                    >
                                        Add Health Issue
                                    </Button>
                                </Grid>
                                <Grid container spacing={0}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">
                                            Looking for:
                                        </Typography>
                                    </Grid>
                                    <Grid container spacing={0}>
                                        <FormControl
                                            component="fieldset"
                                            variant="standard"
                                        >
                                            <FormLabel component="legend">
                                                <Typography variant="caption">
                                                    Please check those that are
                                                    relevant to your current
                                                    health issues.
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
                                        sx={{ mt: "2em", width: "100%" }}
                                    >
                                        Save Profile
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
