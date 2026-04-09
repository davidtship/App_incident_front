import * as React from 'react';
import { IconButton, Box, AppBar, useMediaQuery, Toolbar, styled, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { IconMenu2, IconMoon, IconSun } from '@tabler/icons';
import Notifications from './Notifications';
import Profile from './Profile';
import Language from './Language';
import Navigation from './Navigation';
import Logo from '../../shared/logo/Logo';
import config from 'src/context/config';
import { CustomizerContext } from 'src/context/CustomizerContext';

const VerticalHeader = () => {
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

      <ToolbarStyled sx={{ maxWidth: isLayout === 'boxed' ? 'lg' : '100%!important' }}>
     
        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
    

          <IconButton size="large" color="inherit" onClick={() => setActiveMode(activeMode === 'light' ? 'dark' : 'light')}>
            {activeMode === 'light' ? <IconMoon size="21" stroke="1.5" /> : <IconSun size="21" stroke="1.5" />}
          </IconButton>

        
          <Profile />
        </Stack>
      </ToolbarStyled>
  );
};

VerticalHeader.propTypes = {
  sx: PropTypes.object,
  toggleSidebar: PropTypes.func,
};

export default VerticalHeader;
