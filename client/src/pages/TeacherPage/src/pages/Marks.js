'use strict';

import { useEffect, useState } from 'react';
import { Card, Stack, Container, Typography } from '@mui/material';
import Page from '../components/Page';
import { useSelector } from 'react-redux';
import ExamSelector from '../components/ExamSelector';
import ExamInfoHeader from '../components/ExamInfoHeader';
import MarksTable from '../components/MarksTable';
import MarksEmptyState from '../components/MarksEmptyState';
import MarksSubmitFooter from '../components/MarksSubmitFooter';
import { useStudents } from '../hooks/useStudents';
import { useMarksForm } from '../hooks/useMarksForm';
import { useMarksSubmission } from '../hooks/useMarksSubmission';

export default function Marks() {
  const classro = useSelector((state) => {
    return state?.teacher?.teacherclass?.classro;
  });
  const exams = useSelector((state) => {
    return state?.teacher?.exams?.exams || [];
  });

  const { students, loading } = useStudents(classro);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedExamData, setSelectedExamData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const { register, handleSubmit, errors, watch } = useMarksForm(
    students,
    selectedExamData
  );
  const { isSubmitting, submitMarks } = useMarksSubmission(selectedExam, setHasChanges);

  useEffect(() => {
    if (selectedExam) {
      const exam = exams.find((el) => el.name === selectedExam);
      setSelectedExamData(exam);
      setHasChanges(false);
    } else {
      setSelectedExamData(null);
      setHasChanges(false);
    }
  }, [selectedExam, exams]);

  const handleExamChange = (event) => {
    setSelectedExam(event.target.value);
  };

  const watchedValues = watch();

  useEffect(() => {
    if (selectedExamData) {
      const hasFormChanges = students.some((student) => {
        const studentId = student._id?.toString();
        const currentValue = watchedValues[studentId];
        return currentValue !== undefined && currentValue !== '';
      });
      setHasChanges(hasFormChanges);
    }
  }, [watchedValues, students, selectedExamData]);

  const onSubmit = handleSubmit(submitMarks);

  return (
    <Page title="Marks">
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
              Student Marks
            </Typography>
            <ExamSelector
              exams={exams}
              selectedExam={selectedExam}
              onChange={handleExamChange}
            />
          </Stack>
        </Stack>

        {selectedExam && selectedExamData ? (
          <Card
            sx={{
              borderRadius: 2,
              boxShadow:
                '0 0 2px 0 rgba(145, 158, 171, 0.08), 0 12px 24px -4px rgba(145, 158, 171, 0.08)',
            }}
          >
            <ExamInfoHeader
              selectedExamData={selectedExamData}
              studentsCount={students.length}
            />

            <form onSubmit={onSubmit}>
              <MarksTable
                students={students}
                loading={loading}
                selectedExamData={selectedExamData}
                register={register}
                errors={errors}
                watchedValues={watchedValues}
              />

              <MarksSubmitFooter
                hasChanges={hasChanges}
                isSubmitting={isSubmitting}
                onSubmit={onSubmit}
              />
            </form>
          </Card>
        ) : (
          <MarksEmptyState />
        )}
      </Container>
    </Page>
  );
}
