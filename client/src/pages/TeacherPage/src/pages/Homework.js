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
import { filter } from 'lodash';
import GenericResponsiveTable, { getTableConfig } from '../../../../components/GenericResponsiveTable';

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

  const config = getTableConfig('homework');

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
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Homework List
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpen}
              sx={{
                px: 3,
                py: 1.5,
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 1,
                boxShadow: (theme) => theme.customShadows?.primary || theme.shadows[8],
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
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
            boxShadow: (theme) => theme.customShadows?.z16 || theme.shadows[10],
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              p: 3,
              borderBottom: '1px solid',
              borderColor: 'divider',
              background: (theme) => theme.palette.background.neutral,
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={2}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Homework Information
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip
                  label={`Total: ${homeworks.length}`}
                  color="primary"
                  variant="filled"
                  sx={{ fontWeight: 'bold' }}
                />
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
                    bgcolor: 'background.paper',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'divider',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    }
                  }}
                />
              </Stack>
            </Stack>
          </Box>

          <GenericResponsiveTable
            config={config}
            data={filteredHomeworks}
            actions={{}}
            filters={{}}
            pagination={{}}
          />
        </Card>
      </Container>
    </Page>
  );
}
