import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/sidebar';
import TopBar from './components/topbar';
import Dashboard from './pages/dashboard';
import Patients from './pages/patient';
import PatientsList from './pages/listpatient';
import DoctorsList from './pages/doctor';
import BookAppointment from './pages/BookAppointment';
import Appointments from './pages/Appointment';
import Details from './pages/patientdetails';
import './App.css'; // Importer les styles CSS



function App() {
  return (
    <Router>
      <div>
        <TopBar />
        <div className="main-container">
          <Sidebar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/patientsdetails" element={<Details />} />
              <Route path="/patientslist" element={<PatientsList />} /> 
              <Route path="/rendezvous/book" element={<BookAppointment />} />
              <Route path="/rendezvous" element={<Appointments />} />
              <Route path="/doctors" element={<DoctorsList />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
