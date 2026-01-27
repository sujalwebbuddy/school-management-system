import { adminTableConfigs } from './adminConfigs';
import { teacherTableConfigs } from './teacherConfigs';
import { studentTableConfigs } from './studentConfigs';

export const tableConfigs = {
  ...adminTableConfigs,
  ...teacherTableConfigs,
  ...studentTableConfigs,
};

export const getTableConfig = (type) => {
  const config = tableConfigs[type];
  if (!config) {
    throw new Error(`Table configuration not found for type: ${type}`);
  }
  return config;
};