import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Stack,
  useTheme,
  useMediaQuery,
  ToggleButton,
  ToggleButtonGroup,
  Skeleton,
} from '@mui/material';
import {
  ViewList as TableViewIcon,
  ViewModule as CardViewIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ViewToggleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    display: 'none', // Hide toggle on mobile, force card view
  },
}));

const ResponsiveCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'present':
      case 'completed':
        return theme.palette.success;
      case 'inactive':
      case 'absent':
      case 'pending':
        return theme.palette.warning;
      case 'suspended':
      case 'failed':
        return theme.palette.error;
      default:
        return theme.palette.primary;
    }
  };

  const colors = getStatusColor(status);
  return {
    backgroundColor: colors.lighter,
    color: colors.dark,
    fontWeight: 600,
  };
});

const ResponsiveDataView = ({
  data = [],
  columns = [],
  loading = false,
  onRowClick,
  onActionClick,
  renderCardContent,
  title,
  emptyMessage = 'No data available',
  defaultView = 'auto', // 'table', 'card', or 'auto'
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [viewMode, setViewMode] = useState(defaultView);

  // Determine actual view mode
  const actualViewMode = viewMode === 'auto' 
    ? (isMobile ? 'card' : 'table')
    : viewMode;

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  const renderLoadingSkeleton = () => {
    if (actualViewMode === 'card') {
      return (
        <Grid container spacing={2}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="text" sx={{ mt: 1 }} />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="rectangular" height={20} sx={{ mt: 1 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>
                  <Skeleton variant="text" />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderTableView = () => (
    <TableContainer component={Paper} elevation={1}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align || 'left'}
                sx={{
                  fontWeight: 600,
                  backgroundColor: theme.palette.grey[50],
                  borderBottom: `2px solid ${theme.palette.primary.main}`,
                }}
              >
                {column.label}
              </TableCell>
            ))}
            <TableCell align="right" sx={{ 
              fontWeight: 600,
              backgroundColor: theme.palette.grey[50],
              borderBottom: `2px solid ${theme.palette.primary.main}`,
            }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={row.id || index}
              hover
              onClick={() => onRowClick?.(row)}
              sx={{
                cursor: onRowClick ? 'pointer' : 'default',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align || 'left'}>
                  {column.render ? column.render(row[column.id], row) : row[column.id]}
                </TableCell>
              ))}
              <TableCell align="right">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onActionClick?.(row);
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderCardView = () => (
    <Grid container spacing={2}>
      {data.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={item.id || index}>
          <ResponsiveCard
            onClick={() => onRowClick?.(item)}
            sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
          >
            <CardContent>
              {renderCardContent ? (
                renderCardContent(item)
              ) : (
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{ flex: 1 }}>
                      {columns.slice(0, 3).map((column) => (
                        <Typography
                          key={column.id}
                          variant={column.id === columns[0].id ? 'h6' : 'body2'}
                          color={column.id === columns[0].id ? 'text.primary' : 'text.secondary'}
                          sx={{ mb: 0.5 }}
                        >
                          <strong>{column.label}:</strong> {item[column.id]}
                        </Typography>
                      ))}
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onActionClick?.(item);
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Stack>
                </Box>
              )}
            </CardContent>
          </ResponsiveCard>
        </Grid>
      ))}
    </Grid>
  );

  const renderEmptyState = () => (
    <Paper
      sx={{
        p: 4,
        textAlign: 'center',
        backgroundColor: theme.palette.grey[50],
      }}
    >
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {emptyMessage}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {actualViewMode === 'card' 
          ? 'No items to display in card view'
          : 'No data available in the table'
        }
      </Typography>
    </Paper>
  );

  if (loading) {
    return (
      <Box>
        {title && (
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>
        )}
        {renderLoadingSkeleton()}
      </Box>
    );
  }

  return (
    <Box>
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center" 
        sx={{ px: 3, py: 2, mb: 2 }}
      >
        {title && (
          <Typography variant="h5" component="h2">
            {title}
          </Typography>
        )}
        
        <ViewToggleContainer>
          <ToggleButtonGroup
            value={actualViewMode}
            exclusive
            onChange={handleViewChange}
            size="small"
          >
            <ToggleButton value="table" aria-label="table view">
              <TableViewIcon />
            </ToggleButton>
            <ToggleButton value="card" aria-label="card view">
              <CardViewIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </ViewToggleContainer>
      </Stack>

      {data.length === 0 ? (
        renderEmptyState()
      ) : actualViewMode === 'table' ? (
        renderTableView()
      ) : (
        renderCardView()
      )}
    </Box>
  );
};

export default ResponsiveDataView;