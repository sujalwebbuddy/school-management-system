'use strict';

export function getMarkColor(mark, totalMark) {
  if (!mark && mark !== 0) return 'default';
  const percentage = (mark / totalMark) * 100;
  if (percentage >= 80) return 'success';
  if (percentage >= 60) return 'info';
  if (percentage >= 40) return 'warning';
  return 'error';
}

export function calculateMarkPercentage(markValue, totalMark) {
  if (!markValue && markValue !== 0) return null;
  if (!totalMark) return null;
  return ((markValue / totalMark) * 100).toFixed(1);
}

export function getExistingMark(exam, studentId) {
  if (!exam?.marks) return undefined;
  if (exam.marks instanceof Map || typeof exam.marks === 'object') {
    const marksObj =
      exam.marks instanceof Map ? Object.fromEntries(exam.marks) : exam.marks;
    const markEntry = Object.entries(marksObj)?.find(
      (el) => el[0] === studentId || el[0]?.toString() === studentId
    );
    if (markEntry) {
      const markData = markEntry[1];
      return typeof markData === 'object' ? markData.mark : markData;
    }
  }
  return undefined;
}

export function initializeMarksForm(students, exam) {
  const initialValues = {};
  students.forEach((student) => {
    const studentId = student._id?.toString();
    const markassigned = getExistingMark(exam, studentId);
    initialValues[studentId] = markassigned || '';
  });
  return initialValues;
}

