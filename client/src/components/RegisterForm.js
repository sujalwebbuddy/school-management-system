import React, { useState, useCallback, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import swal from "sweetalert";
import { MenuItem, FormControl, TextField } from "@mui/material";
import { StyledSelect, StyledAutocomplete } from "./authStyledComponents";
import "./auth.css";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [orgLoading, setOrgLoading] = useState(false);
  const orgDebounceRef = useRef(null);

  const searchOrganizations = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setOrganizations([]);
      return;
    }

    if (orgDebounceRef.current) {
      clearTimeout(orgDebounceRef.current);
    }

    orgDebounceRef.current = setTimeout(async () => {
      setOrgLoading(true);
      try {
        const response = await axios.get("/api/v1/organizations/search", {
          params: { q: query.trim(), limit: 20 },
        });
        setOrganizations(response?.data?.organizations || []);
      } catch (err) {
        console.error("Error searching organizations:", err);
        setOrganizations([]);
      } finally {
        setOrgLoading(false);
      }
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      if (orgDebounceRef.current) {
        clearTimeout(orgDebounceRef.current);
      }
    };
  }, []);

  const onSubmit = async (data) => {
    try {
      if (!selectedOrganization) {
        await swal("Oops!", "Please select an organization to continue", "error");
        return;
      }

      const registrationData = {
        ...data,
        organizationDomain: selectedOrganization.domain,
      };

      await axios.post("/api/v1/users/register", registrationData);
      await swal(
        "Done!",
        `Your register request has been sent to ${selectedOrganization.name}! Wait to be approved`,
        "success"
      );
      window.location.reload(false);
    } catch (err) {
      const message =
        err && err.response && err.response.data && err.response.data.msg
          ? err.response.data.msg
          : "Registration failed due to an unknown error";
      await swal("Oops!", message, "error");
      reset({ email: "" });
    }
  };

  return (
    <form className="sign-up-form">
      <h2 className="title" style={{ fontFamily: "poppins" }}>
        Sign up
      </h2>
      <div className="input-field">
        <i className="fas fa-user" />
        <input
          name="firstName"
          type="text"
          placeholder="First Name"
          {...register("firstName", { required: true })}
        />
      </div>
      <p style={{ color: "red" }}>
        {errors.firstName?.type === "required" && "First Name is required"}
      </p>
      <div className="input-field">
        <i className="fas fa-user" />
        <input
          name="lastName"
          type="text"
          placeholder="Last Name"
          {...register("lastName", { required: true })}
        />
      </div>
      <p style={{ color: "red" }}>
        {errors.lastName?.type === "required" && "Last Name is required"}
      </p>
      <div className="input-field">
        <i className="fas fa-envelope" />
        <input
          name="email"
          type="email"
          placeholder="Email"
          {...register("email", {
            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            required: true,
          })}
        />
      </div>
      <p style={{ color: "red" }}>
        {errors.email?.type === "required" && "Email is required"}
        {errors.email?.type === "pattern" && "Unvalid email"}
      </p>

      <div className="input-field">
        <i className="fas fa-phone" />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Contact Number"
          {...register("phoneNumber", {
            required: true,
            pattern: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[\s\./0-9]*$/g,
          })}
        />
      </div>
      <p style={{ color: "red" }}>
        {errors.phoneNumber?.type === "required" &&
          "Phone Number is required"}
        {errors.phoneNumber?.type === "pattern" && "Unvalid phone number"}
      </p>
      <div className="input-field">
        <i className="fas fa-user-tag" />
        <FormControl fullWidth>
          <StyledSelect
            {...register("role", { required: true })}
            displayEmpty
            value={watch("role") || ""}
            onChange={(e) => {
              setValue("role", e.target.value, { shouldValidate: true });
            }}
            inputProps={{ "aria-label": "Select Role" }}
          >
            <MenuItem value="" disabled>
              Select Role
            </MenuItem>
            <MenuItem value="teacher">Teacher</MenuItem>
            <MenuItem value="student">Student</MenuItem>
          </StyledSelect>
        </FormControl>
      </div>
      <p style={{ color: "red" }}>
        {errors.role?.type === "required" && "Role is required"}
      </p>

      {/* Organization Selection */}
      <div className="input-field">
        <i className="fas fa-building" />
        <StyledAutocomplete
          options={organizations}
          getOptionLabel={(option) => {
            if (typeof option === "string") return option;
            return option.name || option.domain || "";
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          filterOptions={(options) => options}
          loading={orgLoading}
          value={selectedOrganization}
          onChange={(event, newValue) => {
            setSelectedOrganization(newValue);
          }}
          onInputChange={(event, newInputValue, reason) => {
            if (reason === "input") {
              searchOrganizations(newInputValue);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search organizations by name or domain..."
              variant="outlined"
            />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.id} style={{ padding: "8px 16px" }}>
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    color: "#333",
                    fontSize: "0.95rem",
                  }}
                >
                  {option.name}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#666",
                    marginTop: "2px",
                  }}
                >
                  @{option.domain}
                </div>
              </div>
            </li>
          )}
          noOptionsText={
            orgLoading
              ? "Searching..."
              : "Start typing to search for organizations..."
          }
          sx={{
            width: "100%",
            "& .MuiAutocomplete-listbox": {
              maxHeight: "200px",
              padding: "4px 0",
            },
            "& .MuiAutocomplete-option": {
              minHeight: "auto",
              padding: "8px 16px",
            },
            "& .MuiAutocomplete-noOptions": {
              padding: "12px 16px",
              fontSize: "0.9rem",
              color: "#666",
            },
          }}
        />
      </div>
      <input
        type="submit"
        className="btnauth"
        value="Sign up"
        onClick={handleSubmit(onSubmit)}
      />
    </form>
  );
};

export default RegisterForm;

