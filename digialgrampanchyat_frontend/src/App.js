import './App.css';
import { Routes, Route } from "react-router-dom";

/* ===== PUBLIC ===== */
import Home from "./Mycomponents/Home";
import Userlogin from "./Mycomponents/Userlogin";
import Register from "./Mycomponents/Register";
import Aboutus from "./Mycomponents/Aboutus";
import Contact from "./Mycomponents/Contact";
import LogOutComp from "./Mycomponents/LogOutComp";

/* ===== VILLAGERS ===== */
import VillagersHome from "./Mycomponents/Villagers/VillagersHome";
import BrowseSchemes from "./Mycomponents/Villagers/BrowseSchemes";
import Register_problem from "./Mycomponents/Villagers/Register_problems";
import Viewproblems from "./Mycomponents/Villagers/Viewproblems";
import ApplyCertificate from "./Mycomponents/ApplyCertificate";

/* ===== CERTIFICATE FORMS ===== */
import BirthCertificateForm from "./Mycomponents/Certificates/BirthCertificateForm";
import WaterConnectionForm from "./Mycomponents/Certificates/WaterConnectionForm";
import PropertyTaxForm from "./Mycomponents/Certificates/PropertyTaxForm";
import RationCardForm from "./Mycomponents/Certificates/RationCardForm";
import MainLayout from './Layout/MainLayout';

function App() {
  return (
    <Routes>

      
      <Route path="/" element={<MainLayout />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Userlogin" element={<Userlogin />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Aboutus" element={<Aboutus />} />
      <Route path="/Contact" element={<Contact />} />
      <Route path="/logout" element={<LogOutComp />} />

      {/* 👤 VILLAGERS LAYOUT */}
      <Route path="/VillagersHome" element={<VillagersHome />}>

        <Route path="BrowseSchemes" element={<BrowseSchemes />} />
        <Route path="Register_problem" element={<Register_problem />} />
        <Route path="Viewproblems" element={<Viewproblems />} />

        {/* 🔹 APPLY CERTIFICATE (BOXES) */}
        <Route path="apply-certificate" element={<ApplyCertificate />}>
          {/* 🔹 FORMS */}
          <Route path="birth" element={<BirthCertificateForm />} />
          <Route path="water" element={<WaterConnectionForm />} />
          <Route path="property" element={<PropertyTaxForm />} />
          <Route path="ration" element={<RationCardForm />} />
        </Route>

      </Route>

    </Routes>
  );
}

export default App;
 