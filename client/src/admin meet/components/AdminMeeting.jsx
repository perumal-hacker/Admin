// src/components/AdminMeeting.jsx
import React, { useState, useEffect } from "react";
import styles from "../styles/AdminMeeting.module.css";

function AdminMeeting() {
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [slots, setSlots] = useState([]);
  const [totalSlots, setTotalSlots] = useState(1);
  const [meetings, setMeetings] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log("🆕 Meetings Updated:", meetings);
  }, [meetings]);

  const addSlot = () => {
    if (!slotTime) {
      setMessage("⛔ No time selected!");
      return;
    }
    if (slots.includes(slotTime)) {
      setMessage("⚠️ Duplicate time slot detected!");
      return;
    }
    if (slots.length >= parseInt(totalSlots, 10)) {
      setMessage(`❌ Cannot add more than ${totalSlots} slots.`);
      return;
    }
    setSlots((prevSlots) => [...prevSlots, slotTime]);
    setSlotTime("");
    setMessage("");
  };

  const removeSlot = (slot) => {
    setSlots((prevSlots) => prevSlots.filter((s) => s !== slot));
  };

  const resetForm = () => {
    setMeetingTitle("");
    setMeetingDate("");
    setSlots([]);
    setSlotTime("");
    setTotalSlots(1);
    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("🔥 Arrange Meeting button clicked ✅");

    if (!meetingTitle.trim() || !meetingDate) {
      setMessage("⛔ Meeting Title and Date are required!");
      return;
    }
    if (slots.length === 0) {
      setMessage("⛔ At least one time slot is required!");
      return;
    }

    const newMeeting = { title: meetingTitle, date: meetingDate, totalSlots, slots: [...slots] };
    setMeetings((prevMeetings) => [...prevMeetings, newMeeting]);
    resetForm();
    setMessage("✅ Meeting successfully scheduled!");
  };

  const cancelMeeting = (index) => {
    setMeetings((prevMeetings) => prevMeetings.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.adminContainer}>
      <h2>Admin Meeting Scheduler</h2>
      {message && <p className={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="meetingTitle">Meeting Title:</label>
        <input
          type="text"
          id="meetingTitle"
          value={meetingTitle}
          onChange={(e) => setMeetingTitle(e.target.value)}
          required
        />
        <label htmlFor="meetingDate">Meeting Date:</label>
        <input
          type="date"
          id="meetingDate"
          value={meetingDate}
          onChange={(e) => setMeetingDate(e.target.value)}
          required
        />
        <label htmlFor="totalSlots">Set Number of Slots:</label>
        <input
          type="number"
          id="totalSlots"
          value={totalSlots}
          onChange={(e) => setTotalSlots(Math.max(1, parseInt(e.target.value, 10) || 1))}
          required
        />
        <label htmlFor="slotTime">Add Time Slot:</label>
        <div className={styles.slotInput}>
          <input
            type="time"
            id="slotTime"
            value={slotTime}
            onChange={(e) => setSlotTime(e.target.value)}
            disabled={slots.length >= parseInt(totalSlots, 10)}
          />
          <button type="button" className={styles.button} onClick={addSlot} disabled={slots.length >= parseInt(totalSlots, 10)}>
            Add Slot
          </button>
        </div>
        <div className={styles.slotList}>
          {slots.map((slot, index) => (
            <div key={index} className={styles.slotItem}>
              {slot}{" "}
              <button type="button" className={styles.button} onClick={() => removeSlot(slot)}>
                ❌
              </button>
            </div>
          ))}
        </div>
        <button type="submit" className={styles.button} disabled={!meetingTitle.trim() || !meetingDate || slots.length === 0}>
          Arrange Meeting
        </button>
        <button type="button" className={styles.button} onClick={resetForm}>
          Reset Form
        </button>
      </form>
      {meetings.length > 0 && (
        <div className={styles.meetingTable}>
          <h3>✅ Submitted Meetings</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Meeting Title</th>
                <th>Total Slots</th>
                <th>Time Slots</th>
                <th>Cancel</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((meeting, index) => (
                <tr key={index}>
                  <td>{meeting.date}</td>
                  <td>{meeting.title}</td>
                  <td>{meeting.totalSlots}</td>
                  <td>{meeting.slots.join(", ")}</td>
                  <td>
                    <button className={styles.button} onClick={() => cancelMeeting(index)}>
                      ❌ Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminMeeting;