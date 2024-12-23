import { Divider, ListItemIcon } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function AccountMenu({
  menuAnchorElement,
  menuOpen,
  items,
  divider,
  handleCloseMenu,
}) {
  return (
    <Menu
      anchorEl={menuAnchorElement}
      open={menuOpen}
      onClose={handleCloseMenu}
    >
      {items.map((item, index) => (
        <div key={item.id}>
          <MenuItem onClick={item.onClick}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            {item.name}
          </MenuItem>
          {divider.includes(index) && <Divider />}
        </div>
      ))}
    </Menu>
  );
}
