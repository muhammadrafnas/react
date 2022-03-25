import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Box,
  Button,
} from "@mui/material";
import { axiosUser } from "../../axios";
import Swal from "sweetalert2";

export default function StickyHeadTable({ props }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [employeeData, setEmployeeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      props.setRefresh(false);
      try {
        let response = await axiosUser.get("/getEmployee");
        if (response.status === 200) {
          setEmployeeData(response.data);
        }
      } catch (error) {
        alert(error);
      }
    };
    if (props.serachData.length !== 0) {
      setEmployeeData(props.serachData);
    } else {
      console.log("else");
      fetchData();
    }
  }, [props.refresh, props.serachData]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  //api for delete a employee

  const handelDelete = (empId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be delete this employee!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let response = await axiosUser.delete("/empDelete/" + empId);
          if (response) {
            Swal.fire("Deleted!", "Your employee has been deleted.", "success");
            props.setRefresh(true);
          }
        } catch (error) {}
      }
    });
  };
  return (
    <>
      <Box>
        <Box
          sx={{
            top: { sm: 60, xs: 20 },
            left: { sm: 250 },
            m: 3,
            display: "flex",
            flexDirection: "cloumn",
            justifyContent: "center",
          }}
        >
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Desigination</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell>Course</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employeeData.map((data) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>
                        {" "}
                        <img height="80px" width="80px" src={data.image} />
                      </TableCell>
                      <TableCell>{data.name}</TableCell>
                      <TableCell>{data.desigination}</TableCell>
                      <TableCell>{data.email}</TableCell>
                      <TableCell>{data.contact}</TableCell>
                      <TableCell>{data.gender}</TableCell>
                      <TableCell>
                        {data.course[0]},{data.course[1]}
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="contained"
                          onClick={() => props.editUser(data._id)}
                          style={{ backgroundColor: "#206CE2" }}
                          component="span"
                        >
                          Edit
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "red" }}
                          component="span"
                          onClick={() => handelDelete(data._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      </Box>
    </>
  );
}
