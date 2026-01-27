import { filter } from "lodash";
import { useState } from "react";
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

export default function Exam() {
  const examList = useSelector((state) => {
    return state?.student?.exams?.examlist || [];
  });
  const [filterName, setFilterName] = useState("");

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const filteredExams = filterName
    ? filter(examList, (exam) => {
        const searchQuery = filterName.toLowerCase();
        return (
          exam.name?.toLowerCase().indexOf(searchQuery) !== -1 ||
          exam.subject?.toLowerCase().indexOf(searchQuery) !== -1
        );
      })
    : examList;

  const config = getTableConfig("student-exams");

  return (
    <Page title="My Exams">
      <Container maxWidth="xl">
        <Stack spacing={3} sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            List of my Exams
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
                Exams Information
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip
                  label={`Total: ${examList.length}`}
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 600, bgcolor: "background.paper" }}
                />
                <OutlinedInput
                  value={filterName}
                  onChange={handleFilterByName}
                  placeholder="Search exams..."
                  startAdornment={
                    <InputAdornment position="start">
                      <Iconify
                        icon="eva:search-fill"
                        sx={{ color: "text.disabled", width: 20, height: 20 }}
                      />
                    </InputAdornment>
                  }
                  sx={{
                    width: { xs: "100%", sm: 300 },
                    bgcolor: "background.paper",
                  }}
                />
              </Stack>
            </Stack>
          </Box>

          <GenericResponsiveTable
            config={config}
            data={filteredExams}
            actions={{}}
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
