import Divider from "@mui/material/Divider";
import ScheduleTable from "../components/ScheduleTable";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function HomePage({ data, loading, userType, editSchedule, removeSchedule }) {
  const navigate = useNavigate();

  return (
    <>
      <Divider sx={{ mt: 2 }}>Home</Divider>
      <ScheduleTable
        data={data}
        type={userType}
        edit={editSchedule}
        remove={removeSchedule}
        loading={loading}
      />

      {userType === "client" ? (
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate("/reserve")}>
          Book New Appointment
        </Button>
      ) : (
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate("/provider")}>
          Update Schedule
        </Button>
      )}
    </>
  );
}

export default HomePage;
