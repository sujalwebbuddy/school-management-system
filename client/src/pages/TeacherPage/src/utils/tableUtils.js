'use strict';

import { filter } from 'lodash';

export function descendingComparator(a, b, orderBy) {
  let aValue;
  let bValue;

  switch (orderBy) {
    case 'name':
      aValue = a.name || '';
      bValue = b.name || '';
      break;
    case 'class':
      aValue = a.classId?.className || a.classId || '';
      bValue = b.classId?.className || b.classId || '';
      break;
    case 'subject':
      aValue = a.subjectId?.name || a.subjectId || '';
      bValue = b.subjectId?.name || b.subjectId || '';
      break;
    case 'date':
      aValue = a.dateOf ? new Date(a.dateOf).getTime() : 0;
      bValue = b.dateOf ? new Date(b.dateOf).getTime() : 0;
      break;
    case 'totalMark':
      aValue = a.totalMark || 0;
      bValue = b.totalMark || 0;
      break;
    default:
      aValue = a[orderBy] || '';
      bValue = b[orderBy] || '';
  }

  if (bValue < aValue) {
    return -1;
  }
  if (bValue > aValue) {
    return 1;
  }
  return 0;
}

export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function applySortFilter(array, comparator, query) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_item) => {
        const name = _item.name || '';
        const subject = _item.subjectId?.name || _item.subjectId || '';
        const className = _item.classId?.className || _item.classId || '';
        const searchQuery = query.toLowerCase();
        return (
          name.toLowerCase().indexOf(searchQuery) !== -1 ||
          subject.toLowerCase().indexOf(searchQuery) !== -1 ||
          className.toLowerCase().indexOf(searchQuery) !== -1
        );
      }
    );
  }
  return stabilizedThis?.map((el) => el[0]);
}

