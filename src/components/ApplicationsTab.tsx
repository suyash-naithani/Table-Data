import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { ChangeEvent, useEffect, useState } from "react";
import { Container } from "@mui/system";
import {
  CircularProgress,
  InputAdornment,
  TableHead,
  TextField,
  Toolbar,
} from "@mui/material";
import { Search } from "@mui/icons-material";
interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

type TableData = {
  applicationName: string;
  maxCost: number;
  averageCost: number;
};

type ApplicationData = {
  Cost: string;
}[];

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export const ApplicationsTab: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [tableData, setTableData] = useState<TableData[]>();
  const [filteredData, setFilteredData] = useState<TableData[]>();
  const [searchInput, setSearchInput] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const response1 = await fetch(
        "https://engineering-task.elancoapps.com/api/applications"
      );
      const namesArray: string[] = await response1.json();

      const detailsPromises = namesArray.map(async (name: string) => {
        const response2 = await fetch(
          `https://engineering-task.elancoapps.com/api/applications/${name}`
        );
        return response2.json();
      });

      const data: ApplicationData[] = await Promise.all(detailsPromises);

      const results = data.map((array, index) => {
        const costs = array.map((obj) => Number(obj.Cost)); // Convert Cost values to numbers
        const maxCost = Math.max(...costs);
        const averageCost =
          costs.reduce((sum, cost) => sum + cost, 0) / costs.length;
        return { applicationName: namesArray[index], maxCost, averageCost };
      });

      setTableData(results);
      localStorage.setItem("tableData", JSON.stringify(results));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const storedData = localStorage.getItem("tableData");
    if (storedData) {
      setTableData(JSON.parse(storedData));
    } else fetchData();
  }, []);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 && tableData
      ? Math.max(0, (1 + page) * rowsPerPage - tableData.length)
      : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchInput(event.target.value);
    const filteredArr = tableData?.filter((obj) =>
      obj.applicationName
        .toLowerCase()
        .includes(event.target.value.toLowerCase())
    );
    setFilteredData(filteredArr);
  };

  return (
    <Container>
      <TableContainer
        component={Paper}
        sx={{ marginTop: 10, overflowX: "initial" }}
      >
        <Toolbar>
          <TextField
            id="outlined-basic"
            onChange={onInputChange}
            label="Search applications"
            variant="standard"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Toolbar>
        <Table aria-label="custom pagination table" stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell align="left" style={{ width: 200 }}>
                Application Name
              </StyledTableCell>
              <StyledTableCell align="left">Max Cost</StyledTableCell>
              <StyledTableCell align="left">Average Cost</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <div
                style={{
                  minHeight: 400,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 500,
                }}
              >
                <CircularProgress />
              </div>
            ) : (
              (rowsPerPage > 0 && filteredData && searchInput.length > 0
                ? filteredData.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : rowsPerPage > 0 && tableData
                ? tableData.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : []
              ).map((data) => (
                <TableRow key={data.applicationName}>
                  <TableCell component="th" scope="row" style={{ width: 300 }}>
                    {data.applicationName}
                  </TableCell>
                  <TableCell align="left">{data.maxCost}</TableCell>
                  <TableCell align="left">{data.averageCost}</TableCell>
                </TableRow>
              ))
            )}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            {!isLoading && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                colSpan={3}
                count={
                  (searchInput.length > 0
                    ? filteredData?.length
                    : tableData?.length) || 0
                }
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            )}
          </TableFooter>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ApplicationsTab;
