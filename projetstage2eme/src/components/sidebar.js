import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // Icône pour les rendez-vous
import ListIcon from '@mui/icons-material/List';
import EventNoteIcon from '@mui/icons-material/EventNote'; // Icône pour l'affichage des rendez-vous
import './Sidebar.css'; // Assurez-vous d'importer le fichier CSS

function Sidebar() {
  return (
    <div className="sidebar">
      <List>
        <ListItem button component={Link} to="/dashboard">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/patients">
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary="Add Patients" />
        </ListItem>
        <ListItem button component={Link} to="/patientslist">
          <ListItemIcon><ListIcon /></ListItemIcon>
          <ListItemText primary="Patients List" />
        </ListItem>
        <ListItem button component={Link} to="/rendezvous/book">
          <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
          <ListItemText primary="Prise de rendez-vous" />
        </ListItem>
        <ListItem button component={Link} to="/rendezvous">
          <ListItemIcon><EventNoteIcon /></ListItemIcon>
          <ListItemText primary="Liste des Rendez-vous" />
        </ListItem>
        <ListItem button component={Link} to="/doctors">
          <ListItemIcon><LocalHospitalIcon /></ListItemIcon>
          <ListItemText primary="Doctors" />
        </ListItem>
      </List>
    </div>
  );
}

export default Sidebar;