import { Select, Autocomplete } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledSelect = styled(Select)({
  height: "100%",
  width: "100%",
  display: "flex",
  alignItems: "center",
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
    padding: "0 !important",
    paddingRight: "36px !important",
    paddingLeft: "0 !important",
    background: "none",
    outline: "none",
    border: "none",
    lineHeight: "55px",
    height: "55px",
    fontWeight: 500,
    fontSize: "0.95rem",
    color: "#212b36",
    fontFamily: '"Poppins", sans-serif',
    boxSizing: "border-box",
  },
  "& .MuiSelect-select[aria-disabled='true']": {
    color: "#919eab",
  },
  "& .MuiSelect-icon": {
    right: "16px",
    color: "#919eab",
    transition: "color 0.3s ease",
    fontSize: "1.25rem",
    width: "20px",
    height: "20px",
  },
  "&:hover .MuiSelect-icon": {
    color: "#4481eb",
  },
  "&.Mui-focused .MuiSelect-icon": {
    color: "#4481eb",
  },
});

export const StyledAutocomplete = styled(Autocomplete)({
  height: "100%",
  width: "100%",
  display: "flex",
  alignItems: "center",
  "& .MuiOutlinedInput-root": {
    padding: "0 !important",
    height: "100%",
    display: "flex",
    alignItems: "center",
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
    padding: "0 !important",
    paddingRight: "36px !important",
    paddingLeft: "0 !important",
    background: "none",
    outline: "none",
    border: "none",
    lineHeight: "55px",
    height: "55px",
    fontWeight: 500,
    fontSize: "0.95rem",
    color: "#212b36",
    fontFamily: '"Poppins", sans-serif',
    boxSizing: "border-box",
    "&::placeholder": {
      color: "#919eab",
      fontWeight: 400,
      opacity: 1,
    },
  },
  "& .MuiAutocomplete-endAdornment": {
    right: "16px",
    position: "absolute",
    "& .MuiSvgIcon-root": {
      color: "#919eab",
      transition: "color 0.3s ease",
      fontSize: "1.25rem",
      width: "20px",
      height: "20px",
    },
  },
  "&:hover .MuiAutocomplete-endAdornment .MuiSvgIcon-root": {
    color: "#4481eb",
  },
  "&.Mui-focused .MuiAutocomplete-endAdornment .MuiSvgIcon-root": {
    color: "#4481eb",
  },
  "& .MuiAutocomplete-listbox": {
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e8e8e8",
    marginTop: "4px",
  },
  "& .MuiAutocomplete-noOptions": {
    padding: "16px",
    fontSize: "0.9rem",
    color: "#637381",
    fontFamily: '"Poppins", sans-serif',
  },
});



