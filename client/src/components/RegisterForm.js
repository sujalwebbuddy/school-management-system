import React, { useState, useCallback, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import api from "../utils/api";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        const response = await api.get("/organizations/search", {
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

      setIsSubmitting(true);
      const registrationData = {
        ...data,
        organizationDomain: selectedOrganization.domain,
      };

      await api.post("/users/register", registrationData);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="sign-up-form">
      <div className="form-header">
        <h2 className="title">Create Your Account</h2>
        <p className="form-subtitle">Join us and get started today</p>
      </div>

      <div className="form-section">
        <h3 className="section-title">Personal Information</h3>
        <div className="form-row">
          <div className="form-group">
            <div className={`input-field ${errors.firstName ? "error" : ""}`}>
              <i className="fas fa-user" />
              <input
                name="firstName"
                type="text"
                placeholder="First Name"
                {...register("firstName", { required: true })}
              />
            </div>
            {errors.firstName?.type === "required" && (
              <span className="error-message">First Name is required</span>
            )}
          </div>

          <div className="form-group">
            <div className={`input-field ${errors.lastName ? "error" : ""}`}>
              <i className="fas fa-user" />
              <input
                name="lastName"
                type="text"
                placeholder="Last Name"
                {...register("lastName", { required: true })}
              />
            </div>
            {errors.lastName?.type === "required" && (
              <span className="error-message">Last Name is required</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <div className={`input-field ${errors.email ? "error" : ""}`}>
            <i className="fas fa-envelope" />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              {...register("email", {
                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                required: true,
              })}
            />
          </div>
          {errors.email?.type === "required" && (
            <span className="error-message">Email is required</span>
          )}
          {errors.email?.type === "pattern" && (
            <span className="error-message">Please enter a valid email</span>
          )}
        </div>

        <div className="form-group">
          <div className={`input-field ${errors.phoneNumber ? "error" : ""}`}>
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
          {errors.phoneNumber?.type === "required" && (
            <span className="error-message">Phone Number is required</span>
          )}
          {errors.phoneNumber?.type === "pattern" && (
            <span className="error-message">Please enter a valid phone number</span>
          )}
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">Account Details</h3>
        <div className="form-group">
          <div className={`input-field ${errors.role ? "error" : ""}`}>
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
          {errors.role?.type === "required" && (
            <span className="error-message">Please select a role</span>
          )}
        </div>

        <div className="form-group">
          <div className={`input-field ${!selectedOrganization ? "warning" : ""}`}>
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
                <li {...props} key={option.id} className="org-option">
                  <div className="org-option-content">
                    <div className="org-name">{option.name}</div>
                    <div className="org-domain">@{option.domain}</div>
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
          {selectedOrganization && (
            <span className="success-message">
              Selected: {selectedOrganization.name}
            </span>
          )}
        </div>
      </div>

      <button
        type="submit"
        className={`btnauth btn-primary ${isSubmitting ? "loading" : ""}`}
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span>Creating Account...</span>
            <i className="fas fa-spinner fa-spin" />
          </>
        ) : (
          <>
            <span>Create Account</span>
            <i className="fas fa-arrow-right" />
          </>
        )}
      </button>
    </form>
  );
};

export default RegisterForm;



