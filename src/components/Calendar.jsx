import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEventDescription, setNewEventDescription] = useState('');

  useEffect(() => {
    const handleResize = () => {
      // Recalculate calendar layout on window resize (optional)
    };

    window.addEventListener('resize', handleResize);

    // Load events from local storage
    const storedEvents = localStorage.getItem('calendarEvents');
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      if (Object.keys(parsedEvents).length > 0) {
        setEvents(parsedEvents);
      }
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const generateCalendar = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const firstDay = (new Date(year, month)).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarRows = [];

    // Create a table row for the days of the week
    calendarRows.push(
      <tr key="days-of-week">
        {days.map((day) => (
          <td key={day} className="calendar-day">
            {day}
          </td>
        ))}
      </tr>
    );

    let day = 1;
    for (let i = 0; i < 6; i++) {
      // Up to 6 rows for a calendar
      const cells = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay || day > daysInMonth) {
          cells.push(<td key={`empty-${i}-${j}`} className="calendar-day"></td>);
        } else {
          const date = new Date(year, month, day);
          const isCurrentDay =
            day === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear();
          cells.push(
            <td
              key={`day-${i}-${j}`}
              className={`calendar-day ${isCurrentDay ? 'currdate' : ''}`}
              onClick={() => handleDateClick(date)}
            >
              <div>
                <span>{day}</span>
              </div>
            </td>
          );
          day++;
        }
      }
      calendarRows.push(<tr key={`row-${i}`}>{cells}</tr>);
    }
    return calendarRows;
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setNewEventDescription('');
  };

  const handleAddEvent = () => {
    const dateString = selectedDate.toISOString().split('T')[0];
    if (newEventDescription.trim() !== '') {
      setEvents((prevEvents) => ({
        ...prevEvents,
        [dateString]: [...(prevEvents[dateString] || []), newEventDescription],
      }));
      setNewEventDescription('');
    }
  };

  const handleRemoveEvent = (eventIndex) => {
    const dateString = selectedDate.toISOString().split('T')[0];
    setEvents((prevEvents) => ({
      ...prevEvents,
      [dateString]: prevEvents[dateString].filter((_, index) => index !== eventIndex),
    }));
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
    setNewEventDescription('');
  };

  useEffect(() => {
    // Save events to local storage whenever events state changes
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  return (
    <div className="calendar-container">
      <div>
        <div className='btns'>
          <button onClick={() => setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1))}>Prev</button>
          <span className='calender'>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          <button onClick={() => setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1))}>Next</button>
        </div>

        <table>
          <tbody className='tbodd'>{generateCalendar()}</tbody>
        </table>
      </div>

      {selectedDate && (
        <div className="event-modal">
          <div className="event-details">
            <h2>Add Events</h2>
            <h2>{selectedDate.toDateString()}</h2>
            {events[selectedDate.toISOString().split('T')[0]] ? (
              <ul>
                {events[selectedDate.toISOString().split('T')[0]].map((event, index) => (
                  <li key={index}>
                    {event}
                    <button className='btnn' onClick={() => handleRemoveEvent(index)}>Remove</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No events set for this date</p>
            )}
            <div className='inpp'>
              <input
                type="text"
                value={newEventDescription}
                onChange={(e) => setNewEventDescription(e.target.value)}
                placeholder="Enter event description"
              />
              <div>
                <button className='btnn' onClick={handleAddEvent}>Add Event</button>
                <button className='btnn' onClick={handleCloseModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Calendar;
