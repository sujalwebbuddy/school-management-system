'use strict';

export function extractSubjects(classes) {
  if (!classes || !Array.isArray(classes)) {
    return [];
  }
  const allSubjects = [];
  classes.forEach((classItem) => {
    if (classItem.subjects && Array.isArray(classItem.subjects)) {
      classItem.subjects.forEach((sub) => {
        const subjectName = typeof sub === 'object' ? sub.name : sub;
        if (subjectName && !allSubjects.includes(subjectName)) {
          allSubjects.push(subjectName);
        }
      });
    }
  });
  return allSubjects;
}

