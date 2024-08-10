import React from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';

function TopBar() {
  return (
    <AppBar position="fixed" style={{ zIndex: 1100 }}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Medical Dashboard
        </Typography>
        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
