import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ListIcon from '@mui/icons-material/List';
import EventNoteIcon from '@mui/icons-material/EventNote';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import './Sidebar.css';

function Sidebar() {
  const [openPatients, setOpenPatients] = React.useState(false);
  const [openRendezvous, setOpenRendezvous] = React.useState(false);

  const handlePatientsClick = () => {
    setOpenPatients(!openPatients);
  };

  const handleRendezvousClick = () => {
    setOpenRendezvous(!openRendezvous);
  };

  return (
      <div className="sidebar">
        <List>
          <ListItem button component={Link} to="/dashboard">
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>

          <ListItem button onClick={handlePatientsClick}>
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary="Gestion Patients" />
            {openPatients ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openPatients} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button component={Link} to="/patients">
                <ListItemIcon><PeopleIcon /></ListItemIcon>
                <ListItemText primary="Ajouter Patients" />
              </ListItem>
              <ListItem button component={Link} to="/patientsdetails">
                <ListItemIcon><InfoOutlinedIcon /></ListItemIcon>
                <ListItemText primary="Details Du Patients" />
              </ListItem>
              <ListItem button component={Link} to="/patientslist">
                <ListItemIcon><ListIcon /></ListItemIcon>
                <ListItemText primary="Liste Des Patients" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button onClick={handleRendezvousClick}>
            <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
            <ListItemText primary="Gestion Rendez-vous" />
            {openRendezvous ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openRendezvous} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button component={Link} to="/rendezvous/book">
                <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
                <ListItemText primary="Prise De Rendez-vous" />
              </ListItem>
              <ListItem button component={Link} to="/rendezvous">
                <ListItemIcon><EventNoteIcon /></ListItemIcon>
                <ListItemText primary="Liste Des Rendez-vous" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button component={Link} to="/doctors">
            <ListItemIcon><LocalHospitalIcon /></ListItemIcon>
            <ListItemText primary="Liste Des Medecins" />
          </ListItem>
          <ListItem button component={Link} to="/recommandation">
            <ListItemIcon><ThumbUpIcon /></ListItemIcon>
            <ListItemText primary="Recommandations" />
          </ListItem>
        </List>
      </div>
  );
}

export default Sidebar;