import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Box, Menu, Avatar, Typography, Divider, Button, IconButton } from '@mui/material';
import { AccountCircle, MailOutline } from '@mui/icons-material';
import { Stack } from '@mui/system';
import Scrollbar from 'src/components/custom-scroll/Scrollbar';

const Profile = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth/login');
  };

  const userName = user.first_name ? `${user.first_name} ${user.last_name}` : 'Utilisateur';

  return (
    <Box>
      {/* Avatar petit bouton */}
      <IconButton size="large" color="inherit" onClick={handleClick}>
        <AccountCircle fontSize="large" color="primary" />
      </IconButton>

      {/* Menu déroulant */}
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{ '& .MuiMenu-paper': { width: 360 } }}
      >
        <Scrollbar sx={{ height: '100%', maxHeight: '85vh' }}>
          <Box p={3}>
            <Typography variant="h5">Profile</Typography>

            <Stack direction="row" py={3} spacing={2} alignItems="center">
              {/* Avatar grand avec icône utilisateur */}
              <Avatar
                sx={{
                  bgcolor: '#1976d2', // Couleur du fond
                  width: 95,
                  height: 95,
                }}
              >
                <AccountCircle sx={{ fontSize: 60, color: '#fff' }} />
              </Avatar>

              <Box>
                <Typography variant="subtitle2" color="textPrimary" fontWeight={600}>
                  {userName}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Développeur
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <MailOutline fontSize="small" />
                  {user.email || 'email@example.com'}
                </Typography>
              </Box>
            </Stack>

            <Divider />

            <Box mt={2}>
              <Button variant="outlined" color="primary" fullWidth onClick={handleLogout}>
                Se déconnecter
              </Button>
            </Box>
          </Box>
        </Scrollbar>
      </Menu>
    </Box>
  );
};

export default Profile;
