import React, { useContext } from 'react';
import Menuitems from './MenuItems';
import { useLocation } from 'react-router';
import { Box, List, useMediaQuery } from '@mui/material';
import { CustomizerContext } from 'src/context/CustomizerContext';

import NavItem from './NavItem';
import NavCollapse from './NavCollapse';
import NavGroup from './NavGroup/NavGroup';

const SidebarItems = () => {
  const { pathname } = useLocation();
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf('/'));
  const { isSidebarHover, isCollapse, isMobileSidebar, setIsMobileSidebar } = useContext(CustomizerContext);

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? isCollapse === "mini-sidebar" && !isSidebarHover : false;

  const renderMenu = (items, level = 0) => {
    return items.map((item) => {
      // Subheader
      if (item.subheader) {
        return <NavGroup item={item} hideMenu={hideMenu} key={item.subheader} />;
      }

      // Menu with children (collapsible)
      if (item.children && item.children.length > 0) {
        return (
          <NavCollapse
            key={item.id}
            menu={item}
            level={level + 1} // incrémentation pour indentation
            pathDirect={pathDirect}
            pathWithoutLastPart={pathWithoutLastPart}
            hideMenu={hideMenu}
            onClick={() => setIsMobileSidebar(false)}
          >
            {/* Récursion pour enfants */}
            {renderMenu(item.children, level + 1)}
          </NavCollapse>
        );
      }

      // Simple menu item
      return (
        <NavItem
          key={item.id}
          item={item}
          level={level} // pour indentation
          pathDirect={pathDirect}
          hideMenu={hideMenu}
          onClick={() => setIsMobileSidebar(false)}
        />
      );
    });
  };

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {renderMenu(Menuitems)}
      </List>
    </Box>
  );
};

export default SidebarItems;
