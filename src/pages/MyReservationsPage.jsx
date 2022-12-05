import ScheduleTable from "../components/ScheduleTable";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function MyReservationsPage({ data, loading, editSchedule }) {
  const navigate = useNavigate();

  return (
    <>
      <ScheduleTable
        data={data}
        type="client"
        edit={editSchedule}
        loading={loading}
      />

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={() => navigate("/reserve")}>
        Book New Appointment
      </Button>
    </>
  );
}

export default MyReservationsPage;
