'use strict';

import { Box, Button, Alert, CircularProgress } from '@mui/material';
import Iconify from './Iconify';

export default function MarksSubmitFooter({
  hasChanges,
  isSubmitting,
  onSubmit,
}) {
  return (
    <Box
      sx={{
        p: 3,
        borderTop: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 2,
      }}
    >
      {hasChanges && (
        <Alert severity="info" sx={{ flex: 1 }}>
          You have unsaved changes. Please submit to save.
        </Alert>
      )}
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isSubmitting || !hasChanges}
        onClick={onSubmit}
        startIcon={
          isSubmitting ? (
            <CircularProgress size={20} />
          ) : (
            <Iconify icon="eva:checkmark-circle-2-fill" />
          )
        }
        sx={{
          px: 4,
          py: 1.5,
          fontWeight: 600,
          textTransform: 'none',
          borderRadius: 1,
        }}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Marks'}
      </Button>
    </Box>
  );
}

