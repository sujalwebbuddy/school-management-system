'use strict';

import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';
import ClassIcon from '@mui/icons-material/Class';
import EditClassModal from './EditClassModal';
import ClassCardActions from './ClassCardActions';
import useClassStudentCount from '../hooks/useClassStudentCount';

export default function ClassCard({ classData }) {
  const [editOpen, setEditOpen] = useState(false);
  const { studentCount, loading } = useClassStudentCount(classData._id);

  const className = classData.className || classData.classesName || 'N/A';

  return (
    <>
      <Card
        sx={{
          minWidth: 280,
          maxWidth: 320,
          borderRadius: 2,
          boxShadow:
            '0 0 2px 0 rgba(145, 158, 171, 0.08), 0 12px 24px -4px rgba(145, 158, 171, 0.08)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow:
              '0 8px 16px 0 rgba(145, 158, 171, 0.24), 0 0 0 1px rgba(145, 158, 171, 0.08)',
          },
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Link
                to={`/dashboard/classes/class/${classData._id}`}
                state={classData._id}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {className}
                </Typography>
              </Link>
              <Chip
                label={`${loading ? '...' : studentCount} Students`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                }}
              />
            </Box>
            <ClassIcon sx={{ fontSize: 40, opacity: 0.8 }} />
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: 2,
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {loading ? (
                <CircularProgress size={16} sx={{ color: 'white' }} />
              ) : (
                `${studentCount} enrolled`
              )}
            </Typography>
            <ClassCardActions
              classId={classData._id}
              onEdit={() => setEditOpen(true)}
            />
          </Box>
        </CardContent>
      </Card>

      <EditClassModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        classData={classData}
      />
    </>
  );
}

