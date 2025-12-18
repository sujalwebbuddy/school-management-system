'use strict';

import { useState } from 'react';
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,
  Box,
  OutlinedInput,
  InputAdornment,
  Chip,
} from '@mui/material';
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import { useSelector } from 'react-redux';
import AddHomeworkModal from '../components/AddHomeworkModal';
import HomeworkTable from '../components/HomeworkTable';
import { filter } from 'lodash';

export default function Homework() {
  const homeworks = useSelector((state) => {
    return state?.teacher?.homework?.homeworks || [];
  });

  const [open, setOpen] = useState(false);
  const [filterName, setFilterName] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const filteredHomeworks = filterName
    ? filter(homeworks, (homework) => {
        const searchQuery = filterName.toLowerCase();
        return (
          homework.name?.toLowerCase().indexOf(searchQuery) !== -1 ||
          homework.description?.toLowerCase().indexOf(searchQuery) !== -1
        );
      })
    : homeworks;

  return (
    <Page title="Homework">
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
              Homework List
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpen}
              sx={{
                px: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 1,
              }}
            >
              New Homework
            </Button>
          </Stack>
        </Stack>

        <AddHomeworkModal open={open} onClose={handleClose} />

        <Card
          sx={{
            borderRadius: 2,
            boxShadow:
              '0 0 2px 0 rgba(145, 158, 171, 0.08), 0 12px 24px -4px rgba(145, 158, 171, 0.08)',
          }}
        >
          <Box
            sx={{
              p: 3,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={2}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Homework Information
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip label={`Total: ${homeworks.length}`} color="primary" variant="outlined" />
                <OutlinedInput
                  value={filterName}
                  onChange={handleFilterByName}
                  placeholder="Search homework..."
                  startAdornment={
                    <InputAdornment position="start">
                      <Iconify
                        icon="eva:search-fill"
                        sx={{ color: 'text.disabled', width: 20, height: 20 }}
                      />
                    </InputAdornment>
                  }
                  sx={{
                    width: { xs: '100%', sm: 280 },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'divider',
                    },
                  }}
                />
              </Stack>
            </Stack>
          </Box>

          <HomeworkTable homeworks={filteredHomeworks} filterName={filterName} />
        </Card>
      </Container>
    </Page>
  );
}
