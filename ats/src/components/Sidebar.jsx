import React from 'react';
import PropTypes from 'prop-types';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText
} from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StoreIcon from '@mui/icons-material/Store';
import InventoryIcon from '@mui/icons-material/Inventory';
import PaymentIcon from '@mui/icons-material/Payment';
import MessageIcon from '@mui/icons-material/Message';
import StarIcon from '@mui/icons-material/Star';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import VerifiedIcon from '@mui/icons-material/Verified';
import ScienceIcon from '@mui/icons-material/Science';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Farmers & Suppliers', icon: <GroupIcon />, path: '/farmers-suppliers' },
  { text: 'Milk Collection', icon: <LocalShippingIcon />, path: '/milk-collection' },
  { text: 'Logistics & Distribution', icon: <StoreIcon />, path: '/logistics-distribution' },
  { text: 'Processing Units', icon: <AssignmentTurnedInIcon />, path: '/processing-units' },
  { text: 'Sales & Retailers', icon: <StoreIcon />, path: '/sales-retailers' },
  { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
  { text: 'Workforce Management', icon: <PeopleAltIcon />, path: '/workforce-management' },
  { text: 'Payments & Bills', icon: <PaymentIcon />, path: '/payments-bills' },
  { text: 'Compliance & Certification', icon: <VerifiedIcon />, path: '/compliance-certification' },
  { text: 'Quality Test', icon: <ScienceIcon />, path: '/quality-test' },
  { text: 'Review', icon: <StarIcon />, path: '/review' },
  { text: 'Message', icon: <MessageIcon />, path: '/message' },
];

const SIDEBAR_WIDTH = 220;

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  return (
    <Drawer
      variant="persistent"
      open={isOpen}
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          bgcolor: '#f8fbff', // Very light blue background
          color: '#1565c0', // Medium blue text
          borderRight: '2px solid #e3f2fd',
          top: '64px', // Height of the AppBar
          height: 'calc(100% - 64px)',
          transition: 'left 0.3s',
          background: 'linear-gradient(180deg, #f8fbff 0%, #f3f9ff 50%, #f8fbff 100%)', // Very light blue gradient
        },
        display: isOpen ? 'block' : 'none',
      }}
      anchor="left"
    >
      <List sx={{ width: '100%', mt: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={NavLink}
            to={item.path}
            sx={{
              borderRadius: 4,
              width: '100%',
              height: 48,
              bgcolor: location.pathname === item.path ? '#e3f2fd' : '#ffffff', // Active: light blue, Inactive: white
              justifyContent: 'flex-start',
              mb: 1,
              px: 2,
              transition: 'all 0.2s',
              boxShadow: location.pathname === item.path ? 2 : 1,
              '&:hover': { 
                bgcolor: '#f0f8ff', // Very light blue on hover
                transform: 'translateX(4px)',
                boxShadow: 2,
              },
              display: 'flex',
              alignItems: 'center',
              border: location.pathname === item.path ? '2px solid #bbdefb' : '1px solid #e8f4fd',
            }}
          >
            <ListItemIcon
              sx={{
                color: location.pathname === item.path ? '#1976d2' : '#42a5f5', // Dark blue for active, medium blue for inactive
                minWidth: 0,
                mr: 2,
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {React.cloneElement(item.icon, { fontSize: 'medium' })}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontWeight: 600,
                fontSize: 15,
                '& .MuiListItemText-primary': {
                  fontWeight: location.pathname === item.path ? 700 : 600,
                  fontSize: 15,
                  color: location.pathname === item.path ? '#1976d2' : '#42a5f5', // Dark blue for active, medium blue for inactive
                },
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

export default Sidebar;
