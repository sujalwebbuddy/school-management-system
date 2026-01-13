import { Select, Autocomplete } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledSelect = styled(Select)({
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiSelect-select": {
    padding: "0",
    paddingRight: "24px !important",
    background: "none",
    outline: "none",
    border: "none",
    lineHeight: "1",
    fontWeight: 600,
    fontSize: "1.1rem",
    color: "#333",
    fontFamily: '"Poppins", sans-serif',
  },
  "& .MuiSvgIcon-root": {
    color: "#acacac",
  },
});

export const StyledAutocomplete = styled(Autocomplete)({
  "& .MuiOutlinedInput-root": {
    padding: "0",
    "& fieldset": {
      border: "none",
    },
    "&:hover fieldset": {
      border: "none",
    },
    "&.Mui-focused fieldset": {
      border: "none",
    },
  },
  "& .MuiInputBase-input": {
    padding: "0",
    background: "none",
    outline: "none",
    border: "none",
    lineHeight: "1",
    fontWeight: 600,
    fontSize: "1.1rem",
    color: "#333",
    fontFamily: '"Poppins", sans-serif',
    "&::placeholder": {
      color: "#aaa",
      fontWeight: 500,
      opacity: 1,
    },
  },
  "& .MuiAutocomplete-endAdornment": {
    right: "10px",
    "& .MuiSvgIcon-root": {
      color: "#acacac",
    },
  },
});


