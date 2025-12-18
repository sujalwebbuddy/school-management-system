'use strict';

import { Stack, Button } from '@mui/material';

export default function HomeworkModalFooter({ onClose, onSubmit }) {
  return (
    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
      <Button
        variant="outlined"
        color="inherit"
        onClick={onClose}
        sx={{ textTransform: 'none' }}
      >
        Cancel
      </Button>
      <Button variant="contained" onClick={onSubmit} sx={{ textTransform: 'none' }}>
        Create Homework
      </Button>
    </Stack>
  );
}

