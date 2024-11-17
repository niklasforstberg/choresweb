import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Snackbar,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Slider from "react-slick";
import axiosInstance from "../utils/axiosConfig";
import { sv } from "date-fns/locale";

function AddChoreLog() {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [chores, setChores] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedChore, setSelectedChore] = useState(null);
  const [CompletedDate, setCompletedDate] = useState(new Date());
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    console.log("familyMembers:", familyMembers);
    console.log("chores:", chores);
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    fetchFamilyMembers();
    fetchChores();
  }, []);

  const fetchFamilyMembers = async () => {
    const familyId = localStorage.getItem("familyId");
    if (!familyId) {
      console.error("Family ID not found in localStorage");
      return;
    }
    try {
      const response = await axiosInstance.get(
        `/api/family/${familyId}/getfamilymembers`
      );
      setFamilyMembers(response.data);
    } catch (error) {
      console.error("Error fetching family members:", error);
    }
  };

  const fetchChores = async () => {
    const familyId = localStorage.getItem("familyId");
    if (!familyId) {
      console.error("Family ID not found in localStorage");
      return;
    }
    try {
      const response = await axiosInstance.get(`/api/chore/getall/${familyId}`);
      setChores(response.data);
    } catch (error) {
      console.error("Error fetching chores:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedMember || !selectedChore) {
      setSnackbarMessage("Please select a family member and a chore");
      setSnackbarOpen(true);
      return;
    }

    const choreLog = {
      CompletedDate: CompletedDate.toISOString(),
      choreId: selectedChore.id,
      userId: selectedMember.id,
      choreName: selectedChore.name,
      userName: `${selectedMember.firstName} ${selectedMember.lastName}`,
      reportedByUserId: parseInt(localStorage.getItem("userId")),
    };

    try {
      await axiosInstance.post("/api/chorelog/add", choreLog);
      setSnackbarMessage(
        `Chore "${selectedChore.name}" logged for ${selectedMember.firstName}`
      );
      setSnackbarOpen(true);
      setSelectedMember(null);
      setSelectedChore(null);
      setCompletedDate(new Date());
    } catch (error) {
      console.error("Error adding chore log:", error);
      setSnackbarMessage("Error adding chore log");
      setSnackbarOpen(true);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleMemberSelect = (member) => {
    setSelectedMember(member.id === selectedMember?.id ? null : member);
  };

  const handleChoreSelect = (chore) => {
    setSelectedChore(chore.id === selectedChore?.id ? null : chore);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={sv}>
      <Box sx={{ mt: 4, maxWidth: '100%', overflow: 'hidden' }}>
        <Typography variant="h4" gutterBottom>
          Add Chore Entry
        </Typography>

        <Typography variant="h6" gutterBottom>
          Select Family Member
        </Typography>
        <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
          <Slider {...sliderSettings}>
            {familyMembers.map((member) => (
              <div key={member.id}>
                <Card
                  sx={{
                    m: 1,
                    cursor: "pointer",
                    bgcolor:
                      selectedMember?.id === member.id
                        ? "primary.light"
                        : "background.paper",
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={() => handleMemberSelect(member)}
                >
                  <CardContent>
                    <Typography align="center">
                      {member.firstName}
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            ))}
          </Slider>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Select Chore
        </Typography>
        <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
          <Slider {...sliderSettings}>
            {chores.map((chore) => (
              <div key={chore.id}>
                <Card
                  sx={{
                    m: 1,
                    cursor: "pointer",
                    bgcolor:
                      selectedChore?.id === chore.id
                        ? "primary.light"
                        : "background.paper",
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={() => handleChoreSelect(chore)}
                >
                  <CardContent>
                    <Typography align="center">{chore.name}</Typography>
                  </CardContent>
                </Card>
              </div>
            ))}
          </Slider>
        </Box>

        <Box sx={{ mt: 4 }}>
          <DateTimePicker
            label="Completed at"
            value={CompletedDate}
            onChange={(newValue) => setCompletedDate(newValue)}
            slotProps={{ textField: { fullWidth: true } }}
            ampm={false}
            format="yyyy-MM-dd HH:mm"
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 4 }}
        >
          Chore done!
        </Button>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
      </Box>
    </LocalizationProvider>
  );
}

export default AddChoreLog;
