import { useState, useMemo } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import ResponsiveDataView from "../ResponsiveDataView/ResponsiveDataView";

const GenericResponsiveTable = ({
  config,
  data = [],
  actions = {},
  filters = {},
  pagination = {},
  loading = false,
  ...additionalProps
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [page, setPage] = useState(pagination.page || 0);
  const [rowsPerPage, setRowsPerPage] = useState(pagination.rowsPerPage || 10);
  const [order, setOrder] = useState(filters.order || "asc");
  const [orderBy, setOrderBy] = useState(filters.orderBy || "");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedData = useMemo(() => {
    if (!orderBy || !config.features?.sortable) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (aValue < bValue) {
        return order === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [data, order, orderBy, config.features?.sortable]);

  const filteredData = useMemo(() => {
    if (!filters.filterName || !config.features?.filterable) {
      return sortedData;
    }

    return sortedData.filter((item) => {
      const searchableText = config.searchableFields
        ?.map((field) => item[field])
        .join(" ")
        .toLowerCase();
      return searchableText?.includes(filters.filterName.toLowerCase());
    });
  }, [
    sortedData,
    filters.filterName,
    config.features?.filterable,
    config.searchableFields,
  ]);

  const paginatedData = useMemo(() => {
    if (!config.features?.paginated) {
      return filteredData;
    }

    const startIndex = page * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, page, rowsPerPage, config.features?.paginated]);

  const totalCount = filteredData.length;

  const transformedData = useMemo(() => {
    return paginatedData.map((item, index) => ({
      id: item._id || item.id || index,
      ...item,
    }));
  }, [paginatedData]);

  const handleRowClick = (row) => {
    if (config.features?.rowClickable && actions.onRowClick) {
      actions.onRowClick(row);
    }
  };

  const handleActionClick = (row) => {
    if (actions.onActionClick) {
      actions.onActionClick(row);
    }
  };

  const renderTableView = () => (
    <Box>
      <TableContainer component={Paper} elevation={1}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {config.columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || "left"}
                  sx={{
                    fontWeight: 600,
                    backgroundColor: theme.palette.grey[50],
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                    ...(config.features?.sortable &&
                      column.sortable !== false && {
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: theme.palette.grey[100],
                        },
                      }),
                  }}
                  onClick={() =>
                    config.features?.sortable &&
                    column.sortable !== false &&
                    handleRequestSort(column.id)
                  }
                >
                  {column.label}
                  {config.features?.sortable && orderBy === column.id && (
                    <span style={{ marginLeft: 4 }}>
                      {order === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </TableCell>
              ))}
              {config.actions && Object.keys(config.actions).length > 0 && (
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    backgroundColor: theme.palette.grey[50],
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {transformedData.map((row) => (
              <TableRow
                key={row.id}
                hover
                onClick={() => handleRowClick(row)}
                sx={{
                  cursor: config.features?.rowClickable ? "pointer" : "default",
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                {config.columns.map((column) => (
                  <TableCell key={column.id} align={column.align || "left"}>
                    {column.render
                      ? column.render(
                          row[column.id],
                          row,
                          undefined,
                          additionalProps,
                        )
                      : row[column.id]}
                  </TableCell>
                ))}
                {config.actions && Object.keys(config.actions).length > 0 && (
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActionClick(row);
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {config.features?.paginated && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        />
      )}
    </Box>
  );

  if (isMobile && config.cardRenderer) {
    const cardRendererWithProps = (item, actions) =>
      config.cardRenderer(item, actions, additionalProps);

    return (
      <ResponsiveDataView
        data={transformedData}
        columns={config.columns}
        loading={loading}
        onRowClick={handleRowClick}
        onActionClick={handleActionClick}
        renderCardContent={cardRendererWithProps}
        title={config.title}
        emptyMessage={
          config.emptyMessage || `No ${config.entityType || "items"} found`
        }
        defaultView="card"
      />
    );
  }

  return renderTableView();
};

export default GenericResponsiveTable;
