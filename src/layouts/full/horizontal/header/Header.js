import * as React from 'react';
import { IconButton, Box, AppBar, useMediaQuery, Toolbar, styled, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { IconMenu2, IconMoon, IconSun } from '@tabler/icons';
import Notifications from '../../vertical/header/Notifications';
import Profile from '../../vertical/header/Profile';
import Language from '../../vertical/header/Language';
import Navigation from '../../vertical/header/Navigation';
import Logo from '../../shared/logo/Logo';
import config from 'src/context/config';
import { CustomizerContext } from 'src/context/CustomizerContext';

const HorizontalHeader = () => {
  const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  const { isLayout, setIsMobileSidebar, isMobileSidebar, activeMode, setActiveMode } = React.useContext(CustomizerContext);
  const TopbarHeight = config.topbarHeight;

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: { minHeight: TopbarHeight },
  }));

  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    margin: '0 auto',
    width: '100%',
    color: `${theme.palette.text.secondary} !important`,
  }));

  return (
    <AppBarStyled position="sticky" color="default" elevation={8}>
      <ToolbarStyled sx={{ maxWidth: isLayout === 'boxed' ? 'lg' : '100%!important' }}>
        {lgDown && (
          <IconButton color="inherit" aria-label="menu" onClick={() => setIsMobileSidebar(!isMobileSidebar)}>
            <IconMenu2 />
          </IconButton>
        )}
        {lgUp && <Navigation />}

        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          <Language />

          <IconButton size="large" color="inherit" onClick={() => setActiveMode(activeMode === 'light' ? 'dark' : 'light')}>
            {activeMode === 'light' ? <IconMoon size="21" stroke="1.5" /> : <IconSun size="21" stroke="1.5" />}
          </IconButton>

          <Notifications />
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

HorizontalHeader.propTypes = {
  sx: PropTypes.object,
  toggleSidebar: PropTypes.func,
};

export default HorizontalHeader;
