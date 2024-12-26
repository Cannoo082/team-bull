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
        <List>
          {Object.keys(options).map((key) => (
            <div key={key}>
              <ListItem disablePadding>
                <ListItemButton onClick={() => router.push(options[key].path)}>
                  <ListItemIcon>{options[key].icon}</ListItemIcon>
                  <ListItemText primary={options[key].name} />
                </ListItemButton>
              </ListItem>
              {options[key].divider && <Divider />}
            </div>
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
