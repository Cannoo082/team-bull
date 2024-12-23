"use client";

import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from "@mui/material";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function Drawer({ open, handleToggleDrawer, options }) {
  const router = useRouter();
  const authCtx = useContext(AuthContext);
  function generateList() {
    return (
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={(event) => handleToggleDrawer(event, false)}
        onKeyDown={(event) => handleToggleDrawer(event, false)}
      >
        {authCtx.userState.role === "admin" && (
          <>
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => router.push("/admin")}>
                  <ListItemIcon>
                    <SupervisorAccountIcon />
                  </ListItemIcon>
                  <ListItemText primary="Admin" />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
          </>
        )}
        <List>
          {Object.keys(options).map((key) => (
            <ListItem key={key} disablePadding>
              <ListItemButton onClick={() => router.push(options[key].path)}>
                <ListItemIcon>
                  <InsertDriveFileOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary={options[key].name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    );
  }

  return (
    <SwipeableDrawer
      open={open}
      onOpen={(event) => handleToggleDrawer(event, true)}
      onClose={(event) => handleToggleDrawer(event, false)}
    >
      {generateList()}
    </SwipeableDrawer>
  );
}
