'use strict';

import { Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import Scrollbar from './Scrollbar';
import HomeworkTableHeader from './HomeworkTableHeader';
import HomeworkTableRow from './HomeworkTableRow';
import SearchNotFound from './SearchNotFound';

export default function HomeworkTable({ homeworks, filterName }) {
  const isHomeworkNotFound = homeworks?.length === 0;

  return (
    <Scrollbar>
      <TableContainer sx={{ minWidth: 1000 }}>
        <Table>
          <HomeworkTableHeader />
          <TableBody>
            {isHomeworkNotFound ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <SearchNotFound searchQuery={filterName} />
                </TableCell>
              </TableRow>
            ) : (
              homeworks?.map((homework) => (
                <HomeworkTableRow key={homework._id} homework={homework} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Scrollbar>
  );
}

