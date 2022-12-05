import { useState, useCallback, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MyReservationsPage from "./pages/MyReservationsPage";
import ProviderSchedulePage from "./pages/ProviderSchedulePage";
import ReserveTimePage from "./pages/ReserveTimePage";
import Navbar from "./components/Navbar";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import { data } from "./assets/mock";

function Router() {
  // Note: we could set some of this data in context instead
  const [allData, setAllData] = useState(data);

  // Hack to create new unique id for schedule (would be on BE)
  const [nextScheduleId, setNextScheduleId] = useState(18);

  // Would be returned from api
  const getClientData = useCallback(
    (newId) => {
      // Get providers tied to a user (would be handled from api)
      const providers = allData.filter((provider) =>
        provider.schedule.some((s) => s.clientId === newId)
      );
      // only add schedules tied to user
      return providers.map((provider) => {
        return {
          ...provider,
          schedule: provider.schedule.filter((s) => s.clientId === newId),
        };
      });
    },
    [allData]
  );

  // Would be returned from api
  const getProviderData = useCallback(
    (newId) => {
      return allData.find((provider) => provider.id === newId);
    },
    [allData]
  );

  const [currentData, setCurrentData] = useState(getClientData(1));
  const [availableData, setAvailableData] = useState([]);

  useEffect(() => {
    const providers = allData.filter((provider) =>
      provider.schedule.some((s) => s.clientId === null)
    );

    // only add available schedules
    setAvailableData(
      providers.map((provider) => {
        return {
          ...provider,
          schedule: provider.schedule.filter((s) => s.clientId === null),
        };
      })
    );
  }, [allData]);

  const [userType, setUserType] = useState("client");
  const [loading, setLoading] = useState(false);

  const handleUserTypeChange = (event) => {
    setLoading(true);
    setUserType(event.target.value);
  };

  const [id, setId] = useState(1);

  const handleIdChange = (event) => {
    setLoading(true);
    setId(event.target.value);
  };

  useEffect(() => {
    if (userType === "client") {
      setCurrentData(getClientData(id));
      setLoading(false);
    } else {
      setCurrentData(getProviderData(id));
      setLoading(false);
    }
  }, [getClientData, getProviderData, id, userType]);

  // Would be handled from api
  const addSchedule = (providerId, newReservation) => {
    setAllData((current) =>
      current.map((obj) => {
        if (obj.id === providerId) {
          newReservation.id = nextScheduleId;
          setNextScheduleId((prev) => prev + 1);
          return { ...obj, schedule: [...obj.schedule, newReservation] };
        }

        return obj;
      })
    );
  };

  // Would be handled from api
  const addSchedules = (providerId, newReservations) => {
    setAllData((current) =>
      current.map((obj) => {
        if (obj.id === providerId) {
          let newR = [];
          newReservations.forEach((newReservation, index) => {
            newReservation.id = nextScheduleId + index;
            setNextScheduleId((prev) => prev + 1);
            newR.push(newReservation);
          });

          return { ...obj, schedule: [...obj.schedule, ...newR] };
        }

        return obj;
      })
    );
  };

  // Would be handled from api
  const editSchedule = (providerId, scheduleId, newData) => {
    setAllData((current) =>
      current.map((obj) => {
        if (obj.id === providerId) {
          const schedule = obj.schedule.map((s) => {
            if (s.id === scheduleId) {
              return {
                ...newData,
              };
            }

            return s;
          });

          return {
            ...obj,
            schedule,
          };
        }

        return obj;
      })
    );
  };

  // Would be handled from api
  const removeSchedule = (providerId, scheduleId) => {
    setAllData((current) =>
      current.map((obj) => {
        if (obj.id === providerId) {
          return {
            ...obj,
            schedule: obj.schedule.filter((s) => s.id !== scheduleId),
          };
        }

        return obj;
      })
    );
  };

  return (
    // TODO: permissions for routes
    <BrowserRouter>
      <Navbar userType={userType} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              {/* Remove temp controls below in real app */}
              <Typography variant="subtitle1" gutterBottom>
                Note: Temporary controls
                <br />
                (would change based on login info)
                <br />
                check the nav values for both user types
              </Typography>
              <FormControl>
                <FormLabel id="user-type-row-radio-buttons-group-label">
                  User Type
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="user-type-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={userType}
                  onChange={handleUserTypeChange}>
                  <FormControlLabel
                    value="client"
                    control={<Radio />}
                    label="Client"
                  />
                  <FormControlLabel
                    value="provider"
                    control={<Radio />}
                    label="Provider"
                  />
                </RadioGroup>
              </FormControl>
              <Box>
                <FormControl fullWidth sx={{ maxWidth: "150px" }}>
                  <InputLabel id="id-select-label">Id</InputLabel>
                  <Select
                    labelId="id-select-label"
                    id="id-select"
                    value={id}
                    label="Id"
                    onChange={handleIdChange}>
                    {[...Array(5)].map((e, i) => (
                      // Note typically want to avoid using index as a key
                      <MenuItem key={i} value={i + 1}>
                        {i + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              {/* TODO: add edit functionality here */}
              <HomePage
                data={currentData}
                loading={loading}
                userType={userType}
                removeSchedule={removeSchedule}
                editSchedule={editSchedule}
              />
            </>
          }
        />
        <Route
          path="/my-reservations"
          element={
            <MyReservationsPage
              data={currentData}
              editSchedule={editSchedule}
            />
          }
        />
        <Route
          path="/provider"
          element={
            <ProviderSchedulePage
              data={currentData}
              id={id}
              addSchedule={addSchedule}
              editSchedule={editSchedule}
              removeSchedule={removeSchedule}
            />
          }
        />
        <Route
          path="/reserve"
          element={
            <ReserveTimePage
              available={availableData}
              addSchedules={addSchedules}
              editSchedule={editSchedule}
              id={id}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
