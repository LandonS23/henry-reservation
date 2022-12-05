import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

export default function ScheduleTable({ type, data, loading, edit, remove }) {
  const [open, setOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState();

  const handleClickOpen = (rowId, schedule) => {
    setSelectedSchedule({ rowId, schedule });
    setOpen(true);
  };

  const handleClose = (accept) => {
    if (accept) {
      type === "client"
        ? edit(selectedSchedule.rowId, selectedSchedule.schedule.id, {
            ...selectedSchedule.schedule,
            clientId: null,
          })
        : remove(selectedSchedule.rowId, selectedSchedule.schedule.id);
    }

    setSelectedSchedule(null);
    setOpen(false);
  };

  const tableRow = (row, schedule) => {
    return (
      <TableRow
        key={schedule.id}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <Tooltip
          enterTouchDelay={0}
          title={
            type === "client"
              ? `${row.first_name} ${row.last_name}`
              : schedule.clientId
          }>
          <TableCell>{schedule.date}</TableCell>
        </Tooltip>
        <TableCell size="small">{schedule.start}</TableCell>
        <TableCell size="small">{schedule.end}</TableCell>
        <TableCell align="right" size="small">
          <IconButton onClick={() => handleClickOpen(row.id, schedule)}>
            <CancelIcon color="error" />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <>
      <Typography
        sx={{ flex: "1 1 100%", mt: 2 }}
        variant="h6"
        id="tableTitle"
        component="div">
        Your {type === "client" ? "Appointments" : "Schedule"}
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="schedule table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  Date (hover/touch for{" "}
                  {type === "client" ? "provider" : "client"})
                </TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell align="right">Remove</TableCell>
              </TableRow>
            </TableHead>
            {data && (
              <TableBody>
                {type === "client"
                  ? data.map((row) =>
                      row.schedule.map((schedule) => tableRow(row, schedule))
                    )
                  : data.schedule.map((schedule) => tableRow(data, schedule))}
              </TableBody>
            )}
            {type === "client" && !data.length && (
              <Typography
                sx={{ flex: "1 1 100%" }}
                variant="subtitle2"
                component="div">
                None found
              </Typography>
            )}
            {type === "provider" && !data.schedule.length && (
              <Typography
                sx={{ flex: "1 1 100%" }}
                variant="subtitle2"
                component="div">
                No schedule found
              </Typography>
            )}
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={open}
        onClose={() => handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to remove this appointment?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => handleClose(false)}>Cancel</Button>
          <Button onClick={() => handleClose(true)} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
