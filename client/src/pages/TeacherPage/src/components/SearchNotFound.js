import PropTypes from 'prop-types';
// material
import { Paper, Typography, Box } from '@mui/material';
import Iconify from './Iconify';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string,
};

export default function SearchNotFound({ searchQuery = '', ...other }) {
  return (
    <Paper {...other} sx={{ py: 3, px: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <Iconify
          icon="eva:search-outline"
          sx={{
            width: 64,
            height: 64,
            color: 'text.disabled',
          }}
        />
      </Box>
      <Typography gutterBottom align="center" variant="h6" sx={{ fontWeight: 600 }}>
        No Results Found
      </Typography>
      {searchQuery && searchQuery.trim().length > 0 ? (
        <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
          No results found for &nbsp;
          <strong>&quot;{searchQuery}&quot;</strong>. Try checking for typos or using different keywords.
        </Typography>
      ) : (
        <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
          No results match your search criteria. Try adjusting your filters or search terms.
        </Typography>
      )}
    </Paper>
  );
}
