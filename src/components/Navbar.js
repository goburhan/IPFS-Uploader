import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import styled from "styled-components";
import { Web3Button } from "@web3modal/react";
import Image from "next/image";
const drawerWidth = 240;

const StyledToolbar = styled(Toolbar)`
  display: flex;
  place-content: flex-end;
`;
const sideBarItems = [
  {
    name: "Trading",
    icon: <InboxIcon />,
    path: "/",
  },
  {
    name: "Swap",
    icon: <InboxIcon />,
    path: "/",
  },
  {
    name: "Liquidity",
    icon: <InboxIcon />,
    path: "/",
  },
  {
    name: "Farms",
    icon: <InboxIcon />,
    path: "/",
  },
  {
    name: "Pools",
    icon: <InboxIcon />,
    path: "/",
  },
];

const drawer = (
  <div>
    <Toolbar />
    <Divider />
    <List>
      {sideBarItems.map((item, index) => (
        <ListItem key={item} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
    <Divider />
  </div>
);

export default function Navbar({ props, children }) {
  const window = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        {/* TOPBAR */}
        <StyledToolbar>
          <Web3Button />
        </StyledToolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* MOBILE SIDEBAR */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              zIndex: "1000 !important",
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* SIDEBAR */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              zIndex: 1000,
            },
          }}
          open
        >
          <div
            style={{
              width: "100%",
              height: "20px",
              padding: "1rem",
            }}
          >
            <Image src={"/assets/lightlogo.svg"} width={180} height={60} />
          </div>

          {drawer}
        </Drawer>
      </Box>

      {/* MAIN CONTENT */}
      {children}
    </Box>
  );
}
