'use strict';

import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Label from '../components/Label';

export default function ExamDetails() {
  const location = useLocation();
  const examId = location.state;
  const examList = useSelector((state) => {
    return state?.student?.exams?.examlist;
  });
  const userInfo = useSelector((state) => {
    return state?.user?.userInfo;
  });
  const studentId = userInfo?._id || userInfo?.id;

  const exam = examList?.find((el) => el._id === examId);

  const getStudentMark = () => {
    if (!exam?.marks || !studentId) {
      return null;
    }
    const marks = exam.marks;
    if (marks instanceof Map) {
      return marks.get(studentId);
    }
    if (typeof marks === 'object' && marks !== null) {
      return marks[studentId];
    }
    return null;
  };

  const studentMark = getStudentMark();
  const markValue = studentMark?.mark || studentMark;
  const hasMark = markValue !== undefined && markValue !== null;

  const today = new Date();
  const examDate = exam?.dateOf ? new Date(exam.dateOf) : null;
  const isActive = examDate && today.getTime() < examDate.getTime();
  const isPast = examDate && today.getTime() >= examDate.getTime();

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4" gutterBottom style={{ color: '#ff808b' }}>
          Exam Details
        </Typography>
      </Stack>

      <Card>
        <CardHeader
          title={exam?.name || 'Exam'}
          titleTypographyProps={{ variant: 'h4' }}
        />
        <br />
        <hr
          style={{
            border: '0px',
            height: '1px',
            background: '#333',
            backgroundImage:
              'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0))',
          }}
        />
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" style={{ color: '#6B5B95', marginBottom: '8px' }}>
              Exam Information:
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Name:</strong> {exam?.name || 'N/A'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Subject:</strong> {exam?.subjectId?.name || exam?.subject || 'N/A'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Class:</strong> {exam?.classId?.className || exam?.classname || 'N/A'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Total Marks:</strong> {exam?.totalMark || 'N/A'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Exam Date:</strong>{' '}
              {examDate
                ? examDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'N/A'}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Label
                variant="ghost"
                color={isActive ? 'success' : 'error'}
              >
                {isActive ? 'Active' : 'Done'}
              </Label>
            </Box>
          </Box>

          {hasMark && (
            <Box sx={{ mt: 3 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Your Exam Result:
                </Typography>
                <Typography variant="body1">
                  <strong>Marks Obtained:</strong> {markValue} / {exam?.totalMark}
                </Typography>
                {studentMark?.submittedAt && (
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    Graded on:{' '}
                    {new Date(studentMark.submittedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                )}
              </Alert>
            </Box>
          )}

          {!hasMark && isPast && (
            <Box sx={{ mt: 3 }}>
              <Alert severity="warning">
                Your exam has been completed. Marks are pending grading by your teacher.
              </Alert>
            </Box>
          )}

          {isActive && (
            <Box sx={{ mt: 3 }}>
              <Alert severity="info">
                This exam is currently active. Please wait for the exam date to pass before viewing results.
              </Alert>
            </Box>
          )}
        </CardContent>
      </Card>
    </>
  );
}

