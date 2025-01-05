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

export default function Drawer({ options }) {
  const router = useRouter();
  const authCtx = useContext(AuthContext);

  function generateList() {
    return (
        <Box sx={{ width: 250 }} role="presentation">
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
          variant="permanent"
          open
      >
        {generateList()}
      </SwipeableDrawer>
  );
}