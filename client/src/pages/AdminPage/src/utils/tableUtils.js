'use strict';

import { filter } from 'lodash';

export function descendingComparator(a, b, orderBy) {
  let aValue;
  let bValue;

  switch (orderBy) {
    case 'name':
      aValue = `${a.firstName || ''} ${a.lastName || ''}`.trim();
      bValue = `${b.firstName || ''} ${b.lastName || ''}`.trim();
      break;
    case 'email':
      aValue = a.email || '';
      bValue = b.email || '';
      break;
    case 'role':
      aValue = a.role || '';
      bValue = b.role || '';
      break;
    case 'phoneNumber':
      aValue = a.phoneNumber || '';
      bValue = b.phoneNumber || '';
      break;
    case 'status':
      aValue = a.isApproved ? 'approved' : 'pending';
      bValue = b.isApproved ? 'approved' : 'pending';
      break;
    case 'class':
      aValue = a.classIn?.className || a.classIn || '';
      bValue = b.classIn?.className || b.classIn || '';
      break;
    case 'gender':
      aValue = a.gender || '';
      bValue = b.gender || '';
      break;
    case 'subject':
      aValue = a.subject?.name || a.subject || '';
      bValue = b.subject?.name || b.subject || '';
      // Also include code in comparison for better sorting/search
      if (a.subject?.code) aValue += ` ${a.subject.code}`;
      if (b.subject?.code) bValue += ` ${b.subject.code}`;
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
  if (!Array.isArray(array)) {
    return [];
  }
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => {
      const name = `${_user.firstName || ''} ${_user.lastName || ''}`.trim();
      const email = _user.email || '';
      const phoneNumber = _user.phoneNumber || '';
      const className = _user.classIn?.className || _user.classIn || '';
      const subjectName = _user.subject?.name || _user.subject || '';
      const subjectCode = _user.subject?.code || '';
      const searchQuery = query.toLowerCase();
      return (
        name.toLowerCase().indexOf(searchQuery) !== -1 ||
        email.toLowerCase().indexOf(searchQuery) !== -1 ||
        phoneNumber.toLowerCase().indexOf(searchQuery) !== -1 ||
        className.toLowerCase().indexOf(searchQuery) !== -1 ||
        subjectName.toLowerCase().indexOf(searchQuery) !== -1 ||
        subjectCode.toLowerCase().indexOf(searchQuery) !== -1 ||
        (_user.role || '').toLowerCase().indexOf(searchQuery) !== -1
      );
    });
  }
  return stabilizedThis.map((el) => el[0]);
}

