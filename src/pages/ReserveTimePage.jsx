import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  addDays,
  compareAsc,
  eachMinuteOfInterval,
  setHours,
  setMinutes,
  differenceInMinutes,
  format,
  addMinutes,
} from "date-fns";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Countdown from "react-countdown";

function ReserveTimePage({ available, addSchedules, editSchedule, id }) {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [showBookDialog, setShowBookDialog] = useState(false);

  useEffect(() => {
    let datesAvailable = [];
    available.forEach(
      (provider) =>
        (datesAvailable = [
          ...datesAvailable,
          ...provider.schedule.map((s) => new Date(Date.parse(s.date))),
        ])
    );

    setAvailableDates(datesAvailable);
  }, [available]);

  useEffect(() => {
    if (selectedDate) {
      let timesAvailable = [];
      available.forEach((provider) => {
        let intervals = [];

        // Break into 15 min intervals
        // TODO: cleanup logic here
        provider.schedule
          .filter(
            (s) => compareAsc(new Date(Date.parse(s.date)), selectedDate) === 0
          )
          .forEach((s) => {
            const end = setHours(
              setMinutes(
                new Date(),
                parseInt(
                  s.end.slice(s.end.indexOf(":") + 1, s.end.indexOf(":") + 3)
                )
              ),
              s.end.slice(s.end.length - 2) === "PM"
                ? parseInt(s.end.split(":")[0].replace("12", "0")) + 12
                : parseInt(s.end.split(":")[0].replace("12", "0"))
            );

            const newIntervals = eachMinuteOfInterval(
              {
                start: setHours(
                  setMinutes(
                    new Date(),
                    parseInt(
                      s.start.slice(
                        s.start.indexOf(":") + 1,
                        s.start.indexOf(":") + 3
                      )
                    )
                  ),
                  s.start.slice(s.start.length - 2) === "PM"
                    ? parseInt(s.start.split(":")[0].replace("12", "0")) + 12
                    : parseInt(s.start.split(":")[0].replace("12", "0"))
                ),
                end,
              },
              { step: 15 }
            );

            // Remove last interval if it isn't 15 min before end time
            if (
              newIntervals.length &&
              differenceInMinutes(newIntervals[newIntervals.length - 1], end) <
                15
            ) {
              newIntervals.pop();
            }

            intervals = [...intervals, ...newIntervals];
          });

        timesAvailable = [...timesAvailable, ...intervals];
      });

      setAvailableTimes(timesAvailable);
    }
  }, [available, selectedDate]);

  const handleClickOpen = () => {
    setShowBookDialog(true);
  };

  const handleClose = (accept) => {
    if (accept) {
      // Find matching schedule and update (likely implemented on BE)
      let match, providerId;
      available.forEach((provider) =>
        provider.schedule
          .filter(
            (s) => compareAsc(new Date(Date.parse(s.date)), selectedDate) === 0
          )
          .forEach((s) => {
            const intervals = eachMinuteOfInterval(
              {
                start: setHours(
                  setMinutes(
                    new Date(),
                    parseInt(
                      s.start.slice(
                        s.start.indexOf(":") + 1,
                        s.start.indexOf(":") + 3
                      )
                    )
                  ),
                  s.start.slice(s.start.length - 2) === "PM"
                    ? parseInt(s.start.split(":")[0].replace("12", "0")) + 12
                    : parseInt(s.start.split(":")[0].replace("12", "0"))
                ),
                end: setHours(
                  setMinutes(
                    new Date(),
                    parseInt(
                      s.end.slice(
                        s.end.indexOf(":") + 1,
                        s.end.indexOf(":") + 3
                      )
                    )
                  ),
                  s.end.slice(s.end.length - 2) === "PM"
                    ? parseInt(s.end.split(":")[0].replace("12", "0")) + 12
                    : parseInt(s.end.split(":")[0].replace("12", "0"))
                ),
              },
              { step: 15 }
            );

            if (
              intervals.find(
                (d) =>
                  d.getHours() === selectedTime.getHours() &&
                  d.getMinutes() === selectedTime.getMinutes()
              )
            ) {
              providerId = provider.id;
              match = s;
            }
          })
      );

      // Add Reserved Time
      // addSchedule(providerId, {
      //   ...match,
      //   start: selectedTime.toLocaleTimeString([], {
      //     hour: "2-digit",
      //     minute: "2-digit",
      //   }),
      //   end: addMinutes(selectedTime, 15).toLocaleTimeString([], {
      //     hour: "2-digit",
      //     minute: "2-digit",
      //   }),
      //   clientId: id,
      // });

      addSchedules(providerId, [
        {
          ...match,
          start: selectedTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          end: addMinutes(selectedTime, 15).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          clientId: id,
        },
        {
          ...match,
          start: addMinutes(selectedTime, 15).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      // Remove time from current schedule
      editSchedule(providerId, match.id, {
        ...match,
        end: selectedTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      // Add Time after new appointment
      // addSchedule(
      //   providerId,
      //   {
      //     ...match,
      //     start: addMinutes(selectedTime, 15).toLocaleTimeString([], {
      //       hour: "2-digit",
      //       minute: "2-digit",
      //     }),
      //   },
      //   true
      // );

      setSelectedDate("");
      setSelectedTime("");
    }

    setShowBookDialog(false);
    navigate("/my-reservations");
  };

  return (
    <>
      <Typography
        sx={{ flex: "1 1 100%", mt: 2 }}
        variant="h6"
        id="reserveTitle"
        component="div">
        Select an Available Date and Time
      </Typography>
      <Box sx={{ mt: 1 }}>
        <DatePicker
          onChange={(date) => setSelectedDate(date)}
          selected={selectedDate}
          minDate={addDays(new Date(), 1)}
          inline
          includeDates={availableDates}
          highlightDates={availableDates.filter(
            (date) => compareAsc(date, new Date()) > -1
          )}
        />
      </Box>
      {/* TODO: investigate putting date time together and removing unavailable times */}
      {selectedDate && (
        <>
          <Typography
            sx={{ mt: 1 }}
            variant="subtitle1"
            id="subtitle1"
            component="div">
            Times available for {format(selectedDate, "MM/dd/yyyy")}
          </Typography>

          <DatePicker
            onChange={(date) => setSelectedTime(date)}
            selected={selectedTime}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={5}
            includeTimes={availableTimes}
            inline
            dateFormat="h:mm aa"
          />

          <Box sx={{ mt: 2 }}>
            <Button
              fullWidth
              sx={{ maxWidth: "250px" }}
              variant="contained"
              disabled={!(selectedDate && selectedTime)}
              onClick={handleClickOpen}>
              Book
            </Button>
          </Box>
        </>
      )}

      <Dialog
        open={showBookDialog}
        onClose={() => handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {"Book this appointment?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This reservation will expire if not confirmed within 30 minutes.
            <br />
            <br />
            Time Remaining: {/* Reloads page after countdown */}
            <Countdown
              date={Date.now() + 60000 * 30}
              renderer={({ minutes, seconds }) => (
                <span>
                  {String(minutes).padStart(2, "0")}:
                  {String(seconds).padStart(2, "0")}
                </span>
              )}
              onComplete={() => navigate(0)}
            />
          </DialogContentText>
        </DialogContent>
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

export default ReserveTimePage;
