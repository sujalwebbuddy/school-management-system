import { filter } from "lodash";
import { useEffect, useState } from "react";
import {
  Card,
  Stack,
  Container,
  Typography,
  Box,
  OutlinedInput,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import Page from "../components/Page";
import Iconify from "../components/Iconify";
import { useSelector } from "react-redux";
import api from "../../../../utils/api";
import GenericResponsiveTable, {
  getTableConfig,
} from "../../../../components/GenericResponsiveTable";

export default function MyStudents() {
  const classroom = useSelector((state) => {
    return state.teacher?.teacherclass?.classroom;
  });

  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterName, setFilterName] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      if (classroom?._id) {
        try {
          setLoading(true);
          const res = await api.get("/admin/students");
          const allStudents = res.data.students || [];
          const classStudents = allStudents
            .filter((student) => {
              const studentClassId = student.classIn?._id || student.classIn;
              return (
                studentClassId === classroom._id ||
                studentClassId?.toString() === classroom._id?.toString()
              );
            })
            .map((student, index) => ({
              ...student,
              rollNumber: student.rollNumber || index + 1,
            }));
          setUserList(classStudents);
        } catch (error) {
          setUserList([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchStudents();
  }, [classroom]);

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const filteredUsers = filterName
    ? filter(userList, (user) => {
        const name = `${user.firstName} ${user.lastName}`;
        const roll = `#${String(user.rollNumber || "").padStart(2, "0")}`;
        return (
          name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
          roll.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
        );
      })
    : userList;

  const config = getTableConfig("my-students");

  return (
    <Page title="Students List">
      <Container maxWidth="xl">
        <Stack spacing={3} sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Students List
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
              <OutlinedInput
                value={filterName}
                onChange={handleFilterByName}
                placeholder="Search students..."
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
          </Box>

          <GenericResponsiveTable
            config={config}
            data={filteredUsers}
            loading={loading}
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
