import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const TeamCalendar = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "New Meeting",
      start: new Date(2025, 0, 28, 12),
      end: new Date(2025, 0, 28, 13),
    },
  ]);

  const [popupData, setPopupData] = useState({
    visible: false,
    isEvent: false,
    event: null,
    slotInfo: null,
  });

  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });

  const handleEventClick = (event) => {
    setPopupData({
      visible: true,
      isEvent: true,
      event,
      slotInfo: null,
    });
    setFormData({
      title: event.title,
      startDate: moment(event.start).format("YYYY-MM-DD"),
      startTime: moment(event.start).format("HH:mm"),
      endDate: moment(event.end).format("YYYY-MM-DD"),
      endTime: moment(event.end).format("HH:mm"),
    });
  };
  const handleSlotClick = (slotInfo) => {
    setPopupData({
      visible: true,
      isEvent: false,
      event: null,
      slotInfo,
    });
    setFormData({
      title: "",
      startDate: moment(slotInfo.start).format("YYYY-MM-DD"),
      startTime: moment(slotInfo.start).format("HH:mm"),
      endDate: moment(slotInfo.end).format("YYYY-MM-DD"),
      endTime: moment(slotInfo.end).format("HH:mm"),
    });
  };
  const closePopup = () => {
    setPopupData({
      visible: false,
      isEvent: false,
      event: null,
      slotInfo: null,
    });
  };

  const handleAddEvent = () => {
    const { title, startDate, startTime, endDate, endTime } = formData;
    if (!title || !startDate || !startTime || !endDate || !endTime) {
      alert("Please fill all fields.");
      return;
    }

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    if (end <= start) {
      alert("End time must be after start time.");
      return;
    }

    setEvents([
      ...events,
      {
        id: events.length + 1,
        title,
        start,
        end,
      },
    ]);
    closePopup();
  };

  const handleEditEvent = () => {
    const { title, startDate, startTime, endDate, endTime } = formData;
    if (!title || !startDate || !startTime || !endDate || !endTime) {
      alert("Please fill all fields.");
      return;
    }

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    if (end <= start) {
      alert("End time must be after start time.");
      return;
    }

    setEvents(
      events.map((e) =>
        e.id === popupData.event.id ? { ...e, title, start, end } : e
      )
    );
    closePopup();
  };

  const handleDeleteEvent = () => {
    if (window.confirm(`Are you sure you want to delete "${popupData.event.title}"?`)) {
      setEvents(events.filter((e) => e.id !== popupData.event.id));
      closePopup();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === "popup-overlay") {
      closePopup();
    }
  };

  const handleEventDrop = ({ event, start, end }) => {
    setEvents(
      events.map((e) =>
        e.id === event.id ? { ...e, start, end } : e
      )
    );
  };

  const handleEventResize = ({ event, start, end }) => {
    setEvents(
      events.map((e) =>
        e.id === event.id ? { ...e, start, end } : e
      )
    );
  };

  return (
    <div style={{ height: "80vh" }}>
      <DragAndDropCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleEventClick}
        onSelectSlot={handleSlotClick}
        selectable
        resizable
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
      />
      {popupData.visible && (
        <div className="popup-overlay" onClick={handleOverlayClick}>
          <div className="popup-menu">
            <h3>{popupData.isEvent ? "Edit Event" : "Add Event"}</h3>
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
            />
            <label>Start Time</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
            />
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
            />
            <label>End Time</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
            />
            <div>
              {popupData.isEvent ? (
                <>
                  <button onClick={handleEditEvent}>Save Changes</button>
                  <button onClick={handleDeleteEvent}>Delete Event</button>
                </>
              ) : (
                <button onClick={handleAddEvent}>Add Event</button>
              )}
              <button className="cancel" onClick={closePopup}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCalendar;
