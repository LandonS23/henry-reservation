import { useState, forwardRef } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import BookIcon from "@mui/icons-material/Book";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { NavLink, useLocation } from "react-router-dom";

export default function Navbar({ userType }) {
  const location = useLocation();
  const menuItems =
    userType === "client"
      ? [
          { label: "Home", route: "/", icon: <HomeIcon /> },
          { label: "Reserve Time", route: "/reserve", icon: <BookIcon /> },
          {
            label: "My Reservations",
            route: "/my-reservations",
            icon: <WatchLaterIcon />,
          },
        ]
      : [
          { label: "Home", route: "/", icon: <HomeIcon /> },
          {
            label: "Update Schedule",
            route: "/provider",
            icon: <CalendarMonthIcon />,
          },
        ];

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const menuId = "primary-menu";

  const Link = forwardRef(function Link(itemProps, ref) {
    return <NavLink ref={ref} {...itemProps} role={undefined} />;
  });

  const list = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleMenu}
      onKeyDown={toggleMenu}>
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.route}
            button
            component={Link}
            to={item.route}
            style={({ isActive }) => ({
              color: isActive ? "#2196f3" : "inherit",
            })}>
            <ListItemButton>
              {item.icon ? (
                <ListItemIcon
                  style={{
                    color:
                      location.pathname === item.route ? "#2196f3" : "inherit",
                  }}>
                  {item.icon}
                </ListItemIcon>
              ) : null}
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  const isProfileMenuOpen = Boolean(profileAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const profileMenuId = "primary-profile-menu";
  const renderProfileMenu = (
    <Menu
      anchorEl={profileAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={profileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isProfileMenuOpen}
      onClose={handleProfileMenuClose}>
      {/* TODO: add these functionalities as well as auth */}
      <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleProfileMenuClose}>Logout</MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={toggleMenu}
            sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Drawer anchor="left" open={menuOpen} onClose={toggleMenu}>
            {list}
          </Drawer>
          <Typography variant="h6" noWrap component="div">
            Scheduling
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "flex" } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={profileMenuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit">
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderProfileMenu}
    </Box>
  );
}
