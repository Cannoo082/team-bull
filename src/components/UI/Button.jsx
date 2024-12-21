"use client";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Btn from "@mui/material/Button";
export default function Button({
  title = "Click",
  variant = "contained",
  onClick = () => {},
  loading,
  sx = { width: "100%", fontSize: "1.2rem" },
  boxSx = {},
  loadingSx = { color: "white" },
  thickness = 3,
}) {
  return (
    <Btn variant={variant} onClick={onClick} sx={{ ...sx }}>
      {loading ? (
        <Box sx={{ display: "flex", ...boxSx }}>
          <CircularProgress sx={{ ...loadingSx }} thickness={thickness} />
        </Box>
      ) : (
        title
      )}
    </Btn>
  );
}
