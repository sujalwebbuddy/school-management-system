import React from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import { Person, Email, Phone, Cake, Wc, MenuBook } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Page from "../components/Page";

const Teacher = () => {
  const location = useLocation();
  const teacherid = location.state;
  const teachers = useSelector((state) => {
    return state?.student?.teachers?.teacherlist;
  });
  const teacher = teachers?.find((el) => el._id === teacherid);

  if (!teacher) {
    return (
      <Page title="Teacher Profile">
        <Container maxWidth="lg">
          <Typography
            variant="h6"
            color="text.secondary"
            align="center"
            sx={{ mt: 5 }}
          >
            Teacher information not found.
          </Typography>
        </Container>
      </Page>
    );
  }

  const InfoRow = ({ icon: Icon, label, value }) => (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 1.5 }}>
      <Box
        sx={{
          bgcolor: "primary.lighter",
          color: "primary.main",
          p: 1,
          borderRadius: 1,
          display: "flex",
        }}
      >
        <Icon sx={{ fontSize: 20 }} />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {label}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {value || "Not specified"}
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <Page title="Teacher Profile">
      <Container maxWidth="lg">
        <Stack spacing={3} sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Teacher Profile
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                textAlign: "center",
                p: 5,
                borderRadius: 2,
                boxShadow: (theme) => theme.customShadows?.z16,
              }}
            >
              <Avatar
                src={teacher?.profileImage}
                sx={{
                  width: 140,
                  height: 140,
                  mx: "auto",
                  border: "4px solid",
                  borderColor: "primary.main",
                  boxShadow: (theme) => theme.customShadows?.primary,
                }}
              />
              <Typography variant="h5" sx={{ mt: 3, fontWeight: 700 }}>
                {`${teacher?.firstName} ${teacher?.lastName}`}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {teacher?.role || "Teacher"}
              </Typography>
              <Chip
                label="Approved Teacher"
                color="success"
                size="small"
                variant="soft"
                sx={{ fontWeight: 600 }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: (theme) => theme.customShadows?.z16,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                  General Information
                </Typography>

                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      icon={Person}
                      label="First Name"
                      value={teacher?.firstName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      icon={Person}
                      label="Last Name"
                      value={teacher?.lastName}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1, borderStyle: "dashed" }} />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <InfoRow
                      icon={Email}
                      label="Email Address"
                      value={teacher?.email}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      icon={Phone}
                      label="Phone Number"
                      value={teacher?.phoneNumber}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      icon={MenuBook}
                      label="Assigned Subject"
                      value={
                        typeof teacher?.subject === "object"
                          ? teacher?.subject?.name
                          : teacher?.subject
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1, borderStyle: "dashed" }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoRow icon={Cake} label="Age" value={teacher?.age} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoRow icon={Wc} label="Gender" value={teacher?.gender} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Teacher;
