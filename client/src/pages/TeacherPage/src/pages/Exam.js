import { useState } from "react";
import {
  Card,
  Stack,
  Button,
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
import AddExamModal from "../components/AddExamModal";
import { filter } from "lodash";

export default function Exam() {
  const [open, setOpen] = useState(false);
  const [filterName, setFilterName] = useState("");

  const exams = useSelector((state) => {
    return state.teacher?.exams?.exams || [];
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const filteredExams = filterName
    ? filter(exams, (exam) => {
        const searchQuery = filterName.toLowerCase();
        const subject = exam.subjectId?.name || exam.subjectId || "";
        const className = exam.classId?.className || exam.classId || "";
        return (
          exam.name?.toLowerCase().indexOf(searchQuery) !== -1 ||
          subject.toLowerCase().indexOf(searchQuery) !== -1 ||
          className.toLowerCase().indexOf(searchQuery) !== -1
        );
      })
    : exams;

  const config = getTableConfig("exams");

  return (
    <Page title="Exams">
      <Container maxWidth="xl">
        <Stack spacing={3} sx={{ mb: 3 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={2}
          >
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Exam List
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpen}
              sx={{
                px: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 1,
              }}
            >
              New Exam
            </Button>
          </Stack>
        </Stack>

        <AddExamModal open={open} onClose={handleClose} />

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
                  label={`Total: ${exams.length}`}
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
                    width: { xs: "100%", sm: 280 },
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
