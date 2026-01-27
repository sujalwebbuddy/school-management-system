import React from 'react';
import {
  Stack,
  Avatar,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import Label from '../../../pages/AdminPage/src/components/Label';
import TeacherMoreMenu from '../../../pages/AdminPage/src/components/TeacherMoreMenu';
import PendingUserMoreMenu from '../../../pages/AdminPage/src/components/PendingUserMoreMenu';

const createUserCardRenderer = (user) => (
  <Box>
    <Stack direction="row" alignItems="center" spacing={2} mb={2}>
      <Avatar
        alt={`${user.firstName} ${user.lastName}`}
        src={user.profileImage}
        sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}
      >
        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" noWrap>
          {`${user.firstName} ${user.lastName}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user.role}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {user.isApproved !== undefined && (
          <Label
            variant="ghost"
            color={user.isApproved === false ? 'error' : 'success'}
          >
            {user.isApproved ? 'Approved' : 'Pending'}
          </Label>
        )}
        <PendingUserMoreMenu
          id={user._id}
          role={user.role}
          userData={{
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber
          }}
        />
      </Box>
    </Stack>

    <Stack spacing={1}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <EmailIcon fontSize="small" color="action" />
        <Typography variant="body2" noWrap>
          {user.email || 'N/A'}
        </Typography>
      </Stack>

      {user.phoneNumber && (
        <Stack direction="row" alignItems="center" spacing={1}>
          <PhoneIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {user.phoneNumber}
          </Typography>
        </Stack>
      )}
    </Stack>
  </Box>
);

const createTeacherCardRenderer = (teacher) => (
  <Box>
    <Stack direction="row" alignItems="center" spacing={2} mb={2}>
      <Avatar
        alt={`${teacher.firstName} ${teacher.lastName}`}
        src={teacher.profileImage}
        sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}
      >
        {teacher.firstName?.charAt(0)}{teacher.lastName?.charAt(0)}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" noWrap>
          {`${teacher.firstName} ${teacher.lastName}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {teacher.gender || 'N/A'}
        </Typography>
      </Box>
      <Box>
        <TeacherMoreMenu teacherId={teacher._id} teacher={teacher} />
      </Box>
    </Stack>

    <Stack spacing={1}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <EmailIcon fontSize="small" color="action" />
        <Typography variant="body2" noWrap>
          {teacher.email || 'N/A'}
        </Typography>
      </Stack>

      {teacher.phoneNumber && (
        <Stack direction="row" alignItems="center" spacing={1}>
          <PhoneIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {teacher.phoneNumber}
          </Typography>
        </Stack>
      )}

      <Stack direction="row" alignItems="center" spacing={1}>
        <SchoolIcon fontSize="small" color="action" />
        <Box>
          {(() => {
            let subjectName = 'N/A';
            if (teacher.subject) {
              if (typeof teacher.subject === 'object' && teacher.subject.name) {
                subjectName = teacher.subject.code ? `${teacher.subject.name} (${teacher.subject.code})` : teacher.subject.name;
              } else if (typeof teacher.subject === 'string') {
                subjectName = teacher.subject;
              }
            }
            return (
              <Chip
                size="small"
                label={subjectName}
                color="default"
                variant="outlined"
              />
            );
          })()}
        </Box>
      </Stack>
    </Stack>
  </Box>
);

export const adminTableConfigs = {
  users: {
    entityType: 'users',
    title: 'Users',
    searchableFields: ['firstName', 'lastName', 'email', 'phoneNumber'],
    features: {
      sortable: true,
      filterable: true,
      paginated: true,
      rowClickable: false,
    },
    columns: [
      {
        id: 'name',
        label: 'Name',
        render: (value, user) => (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={`${user.firstName} ${user.lastName}`} src={user.profileImage} sx={{ width: 40, height: 40 }}>
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" noWrap>
                {`${user.firstName} ${user.lastName}`}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                ID: {user._id?.slice(-6)}
              </Typography>
            </Box>
          </Stack>
        ),
      },
      {
        id: 'email',
        label: 'Email',
        render: (value) => (
          <Typography variant="body2" noWrap>
            {value}
          </Typography>
        ),
      },
      {
        id: 'role',
        label: 'Role',
        render: (value) => (
          <Chip
            size="small"
            label={value}
            color="primary"
            variant="outlined"
          />
        ),
      },
      {
        id: 'phoneNumber',
        label: 'Phone Number',
        render: (value) => (
          <Typography variant="body2" noWrap>
            {value || 'N/A'}
          </Typography>
        ),
      },
      {
        id: 'status',
        label: 'Status',
        render: (value, user) => (
          <Label
            variant="ghost"
            color={user.isApproved === false ? 'error' : 'success'}
          >
            {user.isApproved ? 'Approved' : 'Pending'}
          </Label>
        ),
      },
      {
        id: 'actions',
        label: 'Actions',
        sortable: false,
        align: 'right',
        render: (value, user) => (
          <PendingUserMoreMenu
            id={user._id}
            role={user.role}
            userData={{
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phoneNumber: user.phoneNumber
            }}
          />
        ),
      },
    ],
    cardRenderer: createUserCardRenderer,
    emptyMessage: 'No users found',
  },

  teachers: {
    entityType: 'teachers',
    title: 'Teachers',
    searchableFields: ['firstName', 'lastName', 'email', 'phoneNumber', 'subject', 'gender'],
    features: {
      sortable: true,
      filterable: true,
      paginated: true,
      rowClickable: false,
    },
    columns: [
      {
        id: 'name',
        label: 'Teacher Name',
        render: (value, teacher) => (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={`${teacher.firstName} ${teacher.lastName}`} src={teacher.profileImage} sx={{ width: 40, height: 40 }}>
              {teacher.firstName?.charAt(0)}{teacher.lastName?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" noWrap>
                {`${teacher.firstName} ${teacher.lastName}`}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                ID: {teacher._id?.slice(-6)}
              </Typography>
            </Box>
          </Stack>
        ),
      },
      {
        id: 'email',
        label: 'Email',
        render: (value) => (
          <Typography variant="body2" noWrap>
            {value}
          </Typography>
        ),
      },
      {
        id: 'gender',
        label: 'Gender',
        render: (value, teacher) => (
          <Typography variant="body2" color="text.secondary">
            {teacher.gender || 'N/A'}
          </Typography>
        ),
      },
      {
        id: 'phoneNumber',
        label: 'Phone Number',
        render: (value) => (
          <Typography variant="body2" noWrap>
            {value || 'N/A'}
          </Typography>
        ),
      },
      {
        id: 'subject',
        label: 'Subject',
        render: (value, teacher) => {
          let subjectName = 'N/A';
          if (teacher.subject) {
            if (typeof teacher.subject === 'object' && teacher.subject.name) {
              subjectName = teacher.subject.code ? `${teacher.subject.name} (${teacher.subject.code})` : teacher.subject.name;
            } else if (typeof teacher.subject === 'string') {
              subjectName = teacher.subject;
            }
          }
          return (
            <Chip label={subjectName} size="small" variant="outlined" />
          );
        },
      },
      {
        id: 'actions',
        label: 'Actions',
        sortable: false,
        align: 'right',
        render: (value, teacher) => (
          <TeacherMoreMenu teacherId={teacher._id} teacher={teacher} />
        ),
      },
    ],
    cardRenderer: createTeacherCardRenderer,
    emptyMessage: 'No teachers found',
  },

  studentAttendance: {
    entityType: 'students',
    title: 'Student Attendance',
    searchableFields: ['firstName', 'lastName', 'email', 'classIn'],
    features: {
      sortable: false,
      filterable: false,
      paginated: false,
      rowClickable: false,
    },
    columns: [
      {
        id: 'name',
        label: 'Student Name',
        render: (value, student) => (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={`${student.firstName} ${student.lastName}`} src={student.profileImage} sx={{ width: 40, height: 40 }}>
              {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" noWrap>
                {`${student.firstName} ${student.lastName}`}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                ID: {student._id?.slice(-6)}
              </Typography>
            </Box>
          </Stack>
        ),
      },
      {
        id: 'email',
        label: 'Email',
        render: (value) => (
          <Typography variant="body2" noWrap>
            {value || 'N/A'}
          </Typography>
        ),
      },
      {
        id: 'class',
        label: 'Class',
        render: (value, student) => (
          <Typography variant="body2" noWrap>
            {student.classIn?.className || student.classIn || 'N/A'}
          </Typography>
        ),
      },
      {
        id: 'status',
        label: 'Status',
        align: 'center',
        render: (value, student, index, props) => {
          const attendanceData = props?.attendanceData || {};
          const onAttendanceChange = props?.onAttendanceChange;
          const currentStatus = attendanceData[student._id] || 'present';

          const handleStatusChange = (event, newStatus) => {
            if (newStatus !== null && onAttendanceChange) {
              onAttendanceChange(student._id, newStatus);
            }
          };

          return (
            <ToggleButtonGroup
              value={currentStatus}
              exclusive
              onChange={handleStatusChange}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  px: 2,
                  py: 0.5,
                  fontWeight: 600,
                },
              }}
            >
              <ToggleButton
                value="present"
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'success.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'success.dark',
                    },
                  },
                }}
              >
                <CheckCircleIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Present
              </ToggleButton>
              <ToggleButton
                value="absent"
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'error.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'error.dark',
                    },
                  },
                }}
              >
                <CancelIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Absent
              </ToggleButton>
            </ToggleButtonGroup>
          );
        },
      },
    ],
    cardRenderer: (student, actions, props) => {
      const attendanceData = props?.attendanceData || {};
      const onAttendanceChange = props?.onAttendanceChange;
      const currentStatus = attendanceData[student._id] || 'present';

      const handleStatusChange = (event, newStatus) => {
        if (newStatus !== null && onAttendanceChange) {
          onAttendanceChange(student._id, newStatus);
        }
      };

      return (
        <Box>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Avatar
              alt={`${student.firstName} ${student.lastName}`}
              src={student.profileImage}
              sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}
            >
              {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" noWrap>
                {`${student.firstName} ${student.lastName}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {student.classIn?.className || student.classIn || 'N/A'}
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <EmailIcon fontSize="small" color="action" />
              <Typography variant="body2" noWrap>
                {student.email || 'N/A'}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <SchoolIcon fontSize="small" color="action" />
              <Typography variant="body2">
                Class: {student.classIn?.className || student.classIn || 'N/A'}
              </Typography>
            </Stack>
          </Stack>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              Attendance Status:
            </Typography>
            <ToggleButtonGroup
              value={currentStatus}
              exclusive
              onChange={handleStatusChange}
              size="small"
              sx={{
                width: '100%',
                '& .MuiToggleButton-root': {
                  flex: 1,
                  px: 2,
                  py: 1,
                  fontWeight: 600,
                },
              }}
            >
              <ToggleButton
                value="present"
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'success.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'success.dark',
                    },
                  },
                }}
              >
                <CheckCircleIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Present
              </ToggleButton>
              <ToggleButton
                value="absent"
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'error.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'error.dark',
                    },
                  },
                }}
              >
                <CancelIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Absent
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      );
    },
    emptyMessage: 'No students available for attendance',
  },

  teacherAttendance: {
    entityType: 'teachers',
    title: 'Teacher Attendance',
    searchableFields: ['firstName', 'lastName', 'email', 'subject'],
    features: {
      sortable: false,
      filterable: false,
      paginated: false,
      rowClickable: false,
    },
    columns: [
      {
        id: 'name',
        label: 'Teacher Name',
        render: (value, teacher) => (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={`${teacher.firstName} ${teacher.lastName}`} src={teacher.profileImage} sx={{ width: 40, height: 40 }}>
              {teacher.firstName?.charAt(0)}{teacher.lastName?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" noWrap>
                {`${teacher.firstName} ${teacher.lastName}`}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                ID: {teacher._id?.slice(-6)}
              </Typography>
            </Box>
          </Stack>
        ),
      },
      {
        id: 'email',
        label: 'Email',
        render: (value) => (
          <Typography variant="body2" noWrap>
            {value || 'N/A'}
          </Typography>
        ),
      },
      {
        id: 'subject',
        label: 'Subject',
        render: (value, teacher) => {
          let subjectName = 'N/A';
          if (teacher.subject) {
            if (typeof teacher.subject === 'object' && teacher.subject.name) {
              subjectName = teacher.subject.code ? `${teacher.subject.name} (${teacher.subject.code})` : teacher.subject.name;
            } else if (typeof teacher.subject === 'string') {
              subjectName = teacher.subject;
            }
          }
          return (
            <Typography variant="body2" noWrap>
              {subjectName}
            </Typography>
          );
        },
      },
      {
        id: 'status',
        label: 'Status',
        align: 'center',
        render: (value, teacher, index, props) => {
          const attendanceData = props?.attendanceData || {};
          const onAttendanceChange = props?.onAttendanceChange;
          const currentStatus = attendanceData[teacher._id] || 'present';

          const handleStatusChange = (event, newStatus) => {
            if (newStatus !== null && onAttendanceChange) {
              onAttendanceChange(teacher._id, newStatus);
            }
          };

          return (
            <ToggleButtonGroup
              value={currentStatus}
              exclusive
              onChange={handleStatusChange}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  px: 2,
                  py: 0.5,
                  fontWeight: 600,
                },
              }}
            >
              <ToggleButton
                value="present"
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'success.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'success.dark',
                    },
                  },
                }}
              >
                <CheckCircleIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Present
              </ToggleButton>
              <ToggleButton
                value="absent"
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'error.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'error.dark',
                    },
                  },
                }}
              >
                <CancelIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Absent
              </ToggleButton>
            </ToggleButtonGroup>
          );
        },
      },
    ],
    cardRenderer: (teacher, actions, props) => {
      const attendanceData = props?.attendanceData || {};
      const onAttendanceChange = props?.onAttendanceChange;
      const currentStatus = attendanceData[teacher._id] || 'present';

      const handleStatusChange = (event, newStatus) => {
        if (newStatus !== null && onAttendanceChange) {
          onAttendanceChange(teacher._id, newStatus);
        }
      };

      let subjectName = 'N/A';
      if (teacher.subject) {
        if (typeof teacher.subject === 'object' && teacher.subject.name) {
          subjectName = teacher.subject.code ? `${teacher.subject.name} (${teacher.subject.code})` : teacher.subject.name;
        } else if (typeof teacher.subject === 'string') {
          subjectName = teacher.subject;
        }
      }

      return (
        <Box>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Avatar
              alt={`${teacher.firstName} ${teacher.lastName}`}
              src={teacher.profileImage}
              sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}
            >
              {teacher.firstName?.charAt(0)}{teacher.lastName?.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" noWrap>
                {`${teacher.firstName} ${teacher.lastName}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {subjectName}
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <EmailIcon fontSize="small" color="action" />
              <Typography variant="body2" noWrap>
                {teacher.email || 'N/A'}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <SchoolIcon fontSize="small" color="action" />
              <Typography variant="body2">
                Subject: {subjectName}
              </Typography>
            </Stack>
          </Stack>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              Attendance Status:
            </Typography>
            <ToggleButtonGroup
              value={currentStatus}
              exclusive
              onChange={handleStatusChange}
              size="small"
              sx={{
                width: '100%',
                '& .MuiToggleButton-root': {
                  flex: 1,
                  px: 2,
                  py: 1,
                  fontWeight: 600,
                },
              }}
            >
              <ToggleButton
                value="present"
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'success.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'success.dark',
                    },
                  },
                }}
              >
                <CheckCircleIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Present
              </ToggleButton>
              <ToggleButton
                value="absent"
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'error.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'error.dark',
                    },
                  },
                }}
              >
                <CancelIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Absent
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      );
    },
    emptyMessage: 'No teachers available for attendance',
  },
};