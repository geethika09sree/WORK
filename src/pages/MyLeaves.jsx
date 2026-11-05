import React, { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import { Add } from "@mui/icons-material";

import { useAuth } from "../context/AuthContext";


export default function MyLeaves() {

  const { user } = useAuth();

  const [leaves, setLeaves] =
    useState(() =>
      JSON.parse(
        localStorage.getItem("ems_leaves")
      ) || []
    );


  const [type, setType] =
    useState("Casual Leave");

  const [from, setFrom] =
    useState("");

  const [to, setTo] =
    useState("");

  const [reason, setReason] =
    useState("");

  const [message, setMessage] =
    useState("");


  const myLeaves =
    leaves.filter(
      (leave) =>
        String(leave.employeeId) ===
          String(user.employeeId) ||
        leave.employeeName === user.name ||
        leave.email === user.email
    );


  function applyLeave(event) {

    event.preventDefault();

    if (!from || !to || !reason) {
      setMessage(
        "Please fill all leave details."
      );
      return;
    }


    const newLeave = {
      id: Date.now(),

      employeeId: user.employeeId,

      employeeName: user.name,

      email: user.email,

      type,

      from,

      to,

      reason,

      status: "Pending",

      appliedDate:
        new Date()
          .toISOString()
          .split("T")[0],
    };


    const updatedLeaves = [
      ...leaves,
      newLeave,
    ];


    localStorage.setItem(
      "ems_leaves",
      JSON.stringify(updatedLeaves)
    );


    setLeaves(updatedLeaves);

    setFrom("");
    setTo("");
    setReason("");

    setMessage(
      "Leave application submitted successfully."
    );
  }


  function getStatusColor(status) {

    if (status === "Approved") {
      return "success";
    }

    if (status === "Rejected") {
      return "error";
    }

    return "warning";
  }


  return (
    <Box className="page-container">

      <Typography className="page-title">
        My Leaves
      </Typography>

      <Typography className="page-subtitle">
        Apply for leave and track your leave
        requests.
      </Typography>


      {message && (
        <Alert
          severity={
            message.includes("successfully")
              ? "success"
              : "error"
          }
          sx={{ mb: 3 }}
          onClose={() =>
            setMessage("")
          }
        >
          {message}
        </Alert>
      )}


      {/* APPLY LEAVE */}

      <Card
        sx={{
          p: 3,
          borderRadius: 3,
          mb: 3,
        }}
      >

        <Typography
          variant="h6"
          fontWeight={700}
          mb={3}
        >
          Apply for Leave
        </Typography>


        <Box
          component="form"
          onSubmit={applyLeave}
        >

          <TextField
            select
            fullWidth
            label="Leave Type"
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
            sx={{ mb: 2 }}
          >

            <MenuItem value="Casual Leave">
              Casual Leave
            </MenuItem>

            <MenuItem value="Sick Leave">
              Sick Leave
            </MenuItem>

            <MenuItem value="Earned Leave">
              Earned Leave
            </MenuItem>

            <MenuItem value="Emergency Leave">
              Emergency Leave
            </MenuItem>

          </TextField>


          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
            }}
          >

            <TextField
              label="From"
              type="date"
              value={from}
              onChange={(e) =>
                setFrom(e.target.value)
              }
              InputLabelProps={{
                shrink: true,
              }}
            />


            <TextField
              label="To"
              type="date"
              value={to}
              onChange={(e) =>
                setTo(e.target.value)
              }
              InputLabelProps={{
                shrink: true,
              }}
            />

          </Box>


          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Reason"
            value={reason}
            onChange={(e) =>
              setReason(e.target.value)
            }
            sx={{ mt: 2 }}
          />


          <Button
            type="submit"
            variant="contained"
            startIcon={<Add />}
            sx={{
              mt: 2,
              backgroundColor: "#1E3A8A",

              "&:hover": {
                backgroundColor: "#152E70",
              },
            }}
          >
            Apply for Leave
          </Button>

        </Box>

      </Card>


      {/* HISTORY */}

      <Card
        sx={{
          borderRadius: 3,
        }}
      >

        <Box sx={{ p: 3 }}>

          <Typography
            variant="h6"
            fontWeight={700}
          >
            Leave History
          </Typography>

        </Box>


        {myLeaves.length === 0 ? (

          <Box
            sx={{
              p: 5,
              textAlign: "center",
            }}
          >

            <Typography color="text.secondary">
              You have not applied for any
              leave yet.
            </Typography>

          </Box>

        ) : (

          myLeaves
            .slice()
            .reverse()
            .map((leave) => (

              <Box
                key={leave.id}
                sx={{
                  px: 3,
                  py: 2.5,
                  borderTop:
                    "1px solid #E5E7EB",
                }}
              >

                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    gap: 2,
                    mb: 1,
                  }}
                >

                  <Typography
                    fontWeight={700}
                  >
                    {leave.type}
                  </Typography>

                  <Chip
                    label={leave.status}
                    color={getStatusColor(
                      leave.status
                    )}
                    size="small"
                  />

                </Box>


                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {leave.from} → {leave.to}
                </Typography>


                <Typography
                  variant="body2"
                  sx={{ mt: 1 }}
                >
                  <strong>Reason:</strong>{" "}
                  {leave.reason}
                </Typography>


                {leave.appliedDate && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    mt={1}
                  >
                    Applied on:{" "}
                    {leave.appliedDate}
                  </Typography>
                )}

              </Box>

            ))

        )}

      </Card>

    </Box>
  );
}
