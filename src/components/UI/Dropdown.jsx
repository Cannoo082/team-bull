import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function Dropdown({
  id = "1",
  label,
  currentValue,
  options,
  onChange,
  optionKey,
  optionValue,
  optionFormattedValue,
  sx = {},
}) {
  return (
    <Box sx={{ minWidth: 120, ...sx }}>
      <FormControl fullWidth>
        <InputLabel id={`select-label-${id}`}>{label}</InputLabel>
        <Select
          labelId={`select-label-${id}`}
          id={`select-element-${id}`}
          value={currentValue}
          label={label}
          onChange={onChange}
        >
          {options.map((option) => (
            <MenuItem key={option[optionKey]} value={option[optionValue]}>
              {option[optionFormattedValue]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
