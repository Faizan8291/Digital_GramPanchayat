import PanchayatSelect from "./pages/public/PanchayatSelect";

import './styles/App.css';
import { Routes, Route } from "react-router-dom";

/* ===== PUBLIC ===== */
import Home from "./pages/public/Home";
import Userlogin from "./pages/public/Userlogin";
import Register from "./pages/public/Register";
import Aboutus from "./pages/public/Aboutus";
import Contact from "./pages/public/Contact";
import LogOutComp from "./pages/public/LogOutComp";

/* ===== NEW ROLE DASHBOARDS ===== */
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import GramSevakDashboard from "./pages/gramsevak/GramSevakDashboard";

/* ===== VILLAGERS ===== */
import VillagersHome from "./pages/villagers/Villagers/VillagersHome";
import BrowseSchemes from "./pages/villagers/Villagers/BrowseSchemes";
import Register_problem from "./pages/villagers/Villagers/Register_problems";
import Viewproblems from "./pages/villagers/Villagers/Viewproblems";

/* ===== GRAMSEVAK ===== */
import GramSevakHome from "./pages/gramsevak/GramSevak/GramSevakHome";
import Problem_approval from "./pages/gramsevak/GramSevak/Problem_approval";
import Upload_scheme from "./pages/gramsevak/GramSevak/Upload_scheme";
import Browse_Schemes from "./pages/gramsevak/GramSevak/Browse_Schemes";
import Remove_scheme from "./pages/gramsevak/GramSevak/Remove_scheme";
import Report_Register from "./pages/gramsevak/GramSevak/Report_Register";

/* ===== PDO ===== */
import PDOHome from "./pages/pdo/PDO/PDOHome";
import Check_reports from "./pages/pdo/PDO/Check_reports";
import Upload_Scheme from "./pages/pdo/PDO/Upload_Scheme";
import Browse_scheme from "./pages/pdo/PDO/Browse_scheme";

import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<PanchayatSelect />} />
        <Route path="Home" element={<Home />} />

        <Route path="Userlogin" element={<Userlogin />} />
        <Route path="Register" element={<Register />} />
        <Route path="Aboutus" element={<Aboutus />} />
        <Route path="Contact" element={<Contact />} />
        <Route path="logout" element={<LogOutComp />} />
        <Route path="admin/login" element={<AdminLogin />} />

        <Route path="admin/dashboard" element={<AdminDashboard />} />
        <Route path="citizen/dashboard" element={<CitizenDashboard />} />
        <Route path="gramsevak/dashboard" element={<GramSevakDashboard />} />

        <Route path="VillagersHome" element={<VillagersHome />}>
          <Route path="BrowseSchemes" element={<BrowseSchemes />} />
          <Route path="Register_problem" element={<Register_problem />} />
          <Route path="Viewproblems" element={<Viewproblems />} />
        </Route>

        <Route path="GramSevakHome" element={<GramSevakHome />}>
          <Route path="Problem_approval" element={<Problem_approval />} />
          <Route path="Upload_scheme" element={<Upload_scheme />} />
          <Route path="Browse_Schemes" element={<Browse_Schemes />} />
          <Route path="Remove_scheme" element={<Remove_scheme />} />
          <Route path="Report_Register" element={<Report_Register />} />
        </Route>

        <Route path="PDOHome" element={<PDOHome />}>
          <Route path="Check_reports" element={<Check_reports />} />
          <Route path="Upload_Scheme" element={<Upload_Scheme />} />
          <Route path="Browse_scheme" element={<Browse_scheme />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
