import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
  Chip,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  Cake,
  Wc,
  CloudUpload,
  CheckCircle,
} from "@mui/icons-material";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import swal from "sweetalert";
import axios from "axios";

import { LoadingButton } from "@mui/lab";
import { getUserInfo } from "../../../../slices/studentSlice";
const EditAccount = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const states = [
    {
      value: "Male",
      label: "Male",
    },
    {
      value: "Female",
      label: "Female",
    },
  ];
  const dispatch = useDispatch();

  const userf = useSelector((state) => {
    return state?.student?.userInfo?.user;
  });
  const { isAuth, userInfo } = useSelector((state) => state?.user);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("age", data.age);
    formData.append("gender", data.gender);
    console.log(file);
    setLoading(true);
    axios
      .put(`/api/v1/teacher/update/${userf?._id}`, formData, {
        headers: { token: localStorage.getItem("token") }
      })
      .then((res) => {
        swal("Done!", "User has been updated successfully !", "success").then(
          () => {
            setLoading(false);
            dispatch(getUserInfo(userInfo));
            navigate("/studentDashboard");
          }
        );
      })
      .catch((err) => {
        swal("Oops!", err.response.data.msg, "error");
        setLoading(false);
        console.log(err.response.data);
      });
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={4}
        >
          <Typography variant="h4" fontWeight={600} color="text.primary">
            Edit Profile
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid item lg={4} md={6} xs={12}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ flexGrow: 1, pt: 4 }}>
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      mb: 3,
                    }}
                  >
                    <Avatar
                      src={preview || userf?.profileImage}
                      sx={{
                        height: 120,
                        width: 120,
                        border: "4px solid",
                        borderColor: "primary.main",
                        boxShadow: 4,
                      }}
                    />
                    <IconButton
                      component="label"
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        bgcolor: "primary.main",
                        color: "white",
                        "&:hover": {
                          bgcolor: "primary.dark",
                        },
                        border: "3px solid white",
                      }}
                      size="small"
                    >
                      <CloudUpload fontSize="small" />
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={handleFileChange}
                      />
                    </IconButton>
                  </Box>
                  <Typography
                    color="textPrimary"
                    gutterBottom
                    variant="h5"
                    fontWeight={600}
                    textAlign="center"
                  >
                    {`${userf?.firstName || ""} ${userf?.lastName || ""}`.trim().toUpperCase() || "Student"}
                  </Typography>
                  <Chip
                    label={userf?.role || "student"}
                    size="small"
                    sx={{
                      mt: 1,
                      mb: 1,
                      textTransform: "capitalize",
                      bgcolor: "primary.lighter",
                      color: "primary.dark",
                      fontWeight: 500,
                    }}
                  />
                  <Chip
                    icon={<CheckCircle sx={{ fontSize: 16 }} />}
                    label="Approved"
                    color="success"
                    size="small"
                    sx={{
                      mt: 1,
                      fontWeight: 500,
                    }}
                  />
                </Box>
              </CardContent>
              <Divider />
              <CardActions sx={{ p: 2 }}>
                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  startIcon={<CloudUpload />}
                  sx={{
                    textTransform: "none",
                    py: 1.5,
                  }}
                >
                  {file ? "Change Photo" : "Upload Photo"}
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleFileChange}
                  />
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item lg={8} md={6} xs={12}>
            <form autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)}>
              <Card
                sx={{
                  boxShadow: 3,
                  borderRadius: 2,
                }}
              >
                <CardHeader
                  title={
                    <Typography variant="h5" fontWeight={600}>
                      Profile Information
                    </Typography>
                  }
                  subheader={
                    <Typography variant="body2" color="text.secondary">
                      Update your personal information. All fields marked with * are required.
                    </Typography>
                  }
                  sx={{ pb: 2 }}
                />
                <Divider />
                <CardContent sx={{ pt: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        defaultValue={userf?.firstName || ""}
                        variant="outlined"
                        error={!!errors.firstName}
                        helperText={
                          errors.firstName?.type === "required" && "First Name is required"
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color="action" />
                            </InputAdornment>
                          ),
                        }}
                        {...register("firstName", { required: true })}
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        defaultValue={userf?.lastName || ""}
                        variant="outlined"
                        error={!!errors.lastName}
                        helperText={
                          errors.lastName?.type === "required" && "Last Name is required"
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color="action" />
                            </InputAdornment>
                          ),
                        }}
                        {...register("lastName", { required: true })}
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        defaultValue={userf?.email || ""}
                        variant="outlined"
                        error={!!errors.email}
                        helperText={
                          errors.email?.type === "required"
                            ? "Email is required"
                            : errors.email?.type === "pattern"
                            ? errors.email?.message
                            : ""
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email color="action" />
                            </InputAdornment>
                          ),
                        }}
                        {...register("email", {
                          required: true,
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phoneNumber"
                        type="tel"
                        defaultValue={userf?.phoneNumber || ""}
                        variant="outlined"
                        error={!!errors.phoneNumber}
                        helperText={
                          errors.phoneNumber?.type === "required" && "Phone Number is required"
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone color="action" />
                            </InputAdornment>
                          ),
                        }}
                        {...register("phoneNumber", { required: true })}
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label="Age"
                        name="age"
                        type="number"
                        defaultValue={userf?.age || ""}
                        variant="outlined"
                        error={!!errors.age}
                        helperText={errors.age?.type === "required" && "Age is required"}
                        inputProps={{ min: 1, max: 120 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Cake color="action" />
                            </InputAdornment>
                          ),
                        }}
                        {...register("age", { required: true })}
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label="Gender"
                        name="gender"
                        select
                        defaultValue={userf?.gender || ""}
                        SelectProps={{ native: true }}
                        variant="outlined"
                        error={!!errors.gender}
                        helperText={
                          errors.gender?.type === "required" && "Gender is required"
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Wc color="action" />
                            </InputAdornment>
                          ),
                        }}
                        {...register("gender", { required: true })}
                      >
                        <option value="">Select Gender</option>
                        {states.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </CardContent>
                <Divider />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    p: 3,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/studentDashboard")}
                    sx={{ textTransform: "none" }}
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    type="submit"
                    loading={loading}
                    variant="contained"
                    sx={{
                      textTransform: "none",
                      px: 4,
                    }}
                  >
                    Save Changes
                  </LoadingButton>
                </Box>
              </Card>
            </form>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default EditAccount;
