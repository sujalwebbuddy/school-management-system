import { filter } from "lodash";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Stack,
  Container,
  Typography,
  Box,
  OutlinedInput,
  InputAdornment,
  Chip,
} from "@mui/material";
import Page from "../components/Page";
import Iconify from "../components/Iconify";
import { useSelector } from "react-redux";
import GenericResponsiveTable, {
  getTableConfig,
} from "../../../../components/GenericResponsiveTable";

export default function Homework() {
  const navigate = useNavigate();
  const homeworkList = useSelector((state) => {
    return state?.student?.homeworks?.homeworkList || [];
  });
  const [filterName, setFilterName] = useState("");

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const filteredHomeworks = filterName
    ? filter(homeworkList, (homework) => {
        const searchQuery = filterName.toLowerCase();
        return (
          homework.name?.toLowerCase().indexOf(searchQuery) !== -1 ||
          homework.subjectId?.name?.toLowerCase().indexOf(searchQuery) !== -1
        );
      })
    : homeworkList;

  const config = getTableConfig("student-homework");

  const handleRowClick = (row) => {
    navigate(`/studentDashboard/homework/${row._id}`, { state: row._id });
  };

  return (
    <Page title="Class Homework">
      <Container maxWidth="xl">
        <Stack spacing={3} sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            My Class Homework
          </Typography>
        </Stack>

        <Card
          sx={{
            borderRadius: 2,
            boxShadow: (theme) =>
              theme.customShadows?.z16 ||
              "0 0 2px 0 rgba(145, 158, 171, 0.08), 0 12px 24px -4px rgba(145, 158, 171, 0.08)",
          }}
        >
          <Box
            sx={{
              p: 2.5,
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: "background.neutral",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ sm: "center" }}
              justifyContent="space-between"
              spacing={2}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Homework Information
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip
                  label={`Total: ${homeworkList.length}`}
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 600, bgcolor: "background.paper" }}
                />
                <OutlinedInput
                  value={filterName}
                  onChange={handleFilterByName}
                  placeholder="Search homework..."
                  startAdornment={
                    <InputAdornment position="start">
                      <Iconify
                        icon="eva:search-fill"
                        sx={{ color: "text.disabled", width: 20, height: 20 }}
                      />
                    </InputAdornment>
                  }
                  sx={{
                    width: { xs: "100%", sm: 320 },
                    bgcolor: "background.paper",
                  }}
                />
              </Stack>
            </Stack>
          </Box>

          <GenericResponsiveTable
            config={config}
            data={filteredHomeworks}
            actions={{
              onRowClick: handleRowClick,
            }}
            filters={{
              filterName,
            }}
            pagination={{}}
          />
        </Card>
      </Container>
    </Page>
  );
}
