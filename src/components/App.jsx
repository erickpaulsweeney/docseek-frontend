import React from "react";
import { Routes, Route } from "react-router-dom";
import LogIn from "./Login";
import ProfileDoctorEdit from "./ProfileDoctorEdit";
import ProfilePatientEdit from "./ProfilePatientEdit";
import Signup from "./Signup";
import Error from "./Error";
import HomePatient from "./HomePatient";
import HomeDoctor from "./HomeDoctor";
import DoctorDetails from "./DoctorDetails";
import Consultation from "./Consultation";
import Doctors from "./Doctors";
import ProfilePatient from "./ProfilePatient";
import ForgotPassword from "./ForgotPassword";
import PasswordReset from "./PasswordReset";
import ProfileDoctor from "./ProfileDoctor";
import DoctorSchedule from "./DoctorSchedule";

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/password-reset/:userId/:token" element={<PasswordReset />} />

            <Route path="/patient" element={<HomePatient />} />
            <Route path="/patient/profile" element={<ProfilePatient />} />
            <Route path="/profile-patient" element={<ProfilePatientEdit />} />
            <Route path="/patient/list" element={<Doctors />} />
            <Route path="/doctor/:id" element={<DoctorDetails />} />  
            <Route path="/consultation/new/:id" element={<Consultation />} />

            <Route path="/doctor" element={<HomeDoctor />} />
            <Route path="/doctor/profile" element={<ProfileDoctor />} />
            <Route path="/doctor/schedule" element={<DoctorSchedule />} />
            <Route path="/profile-doctor" element={<ProfileDoctorEdit />} />

            <Route path="*" element={<Error />} />
        </Routes>
    );
}
