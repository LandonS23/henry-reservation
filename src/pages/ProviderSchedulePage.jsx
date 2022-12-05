import { useState } from "react";
import ScheduleTable from "../components/ScheduleTable";
import Typography from "@mui/material/Typography";
import DatePicker from "react-datepicker";
import TextField from "@mui/material/TextField";
import { DatePickerCustom } from "../components/DatePickerCustom";
import { TimePickerCustom } from "../components/TimePickerCustom";
import InputAdornment from "@mui/material/InputAdornment";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import WatchLater from "@mui/icons-material/WatchLater";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

// TODO: add editing of a schedule, add schedule for current day
function ProviderSchedulePage({
  data,
  id,
  loading,
  addSchedule,
  editSchedule,
  removeSchedule,
}) {
  const [dateToAdd, setDateToAdd] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const addNewSchedule = () => {
    // TODO: validate proper values
    addSchedule(id, {
      date: dateToAdd.toLocaleDateString("en-US"),
      start: startTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      end: endTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      clientId: null,
    });
    setDateToAdd("");
    setStartTime("");
    setEndTime("");
  };

  return (
    <>
      <ScheduleTable
        data={data}
        type="provider"
        remove={removeSchedule}
        loading={loading}
      />

      <Typography
        sx={{ flex: "1 1 100%", mt: 2 }}
        variant="h6"
        id="tableTitle"
        component="div">
        Add a new date
      </Typography>

      <Box sx={{ mb: 1 }}>
        <TextField
          value={dateToAdd}
          name="newDate"
          id="custom-date-input"
          InputProps={{
            inputComponent: DatePickerCustom,
            inputProps: {
              component: DatePicker,
            },
            startAdornment: (
              <InputAdornment position="start">
                <CalendarMonth />
              </InputAdornment>
            ),
          }}
          placeholder="Select a date"
          onChange={(date) => setDateToAdd(date)}
        />
      </Box>

      {/* TODO: add max values for start time (end time) */}
      <Box sx={{ mb: 1 }}>
        <TextField
          value={startTime}
          name="startTime"
          id="start-time-input"
          InputProps={{
            inputComponent: TimePickerCustom,
            inputProps: {
              component: DatePicker,
            },
            startAdornment: (
              <InputAdornment position="start">
                <WatchLater />
              </InputAdornment>
            ),
          }}
          placeholder="Start time"
          onChange={(date) => setStartTime(date)}
        />
      </Box>

      {/* TODO: add min values for end time */}
      <Box sx={{ mb: 2 }}>
        <TextField
          value={endTime}
          name="endTime"
          id="end-time-input"
          InputProps={{
            inputComponent: TimePickerCustom,
            inputProps: {
              component: DatePicker,
            },
            startAdornment: (
              <InputAdornment position="start">
                <WatchLater />
              </InputAdornment>
            ),
          }}
          placeholder="End time"
          onChange={(date) => setEndTime(date)}
        />
      </Box>

      <Box sx={{ mx: 4 }}>
        <Button
          fullWidth
          sx={{ maxWidth: "250px" }}
          variant="contained"
          disabled={!(dateToAdd && startTime && endTime)}
          onClick={() => addNewSchedule(false)}>
          Add Date
        </Button>
      </Box>
    </>
  );
}

export default ProviderSchedulePage;
