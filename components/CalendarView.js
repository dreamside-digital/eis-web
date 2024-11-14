"use client"

import { Calendar, luxonLocalizer, Views } from 'react-big-calendar'
import { DateTime } from 'luxon'
const localizer = luxonLocalizer(DateTime, { firstDayOfWeek: 7 })
import { useState, useCallback, useEffect } from 'react'
import ReactModal from "react-modal";
import EventCard from "@/components/EventCard"
import "react-big-calendar/lib/css/react-big-calendar.css"

const CalendarView = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState()
  const [view, setView] = useState(Views.MONTH)
  const [date, setDate] = useState(new Date())

  const handleNavigate = (newDate) => { setDate(newDate); };
  const handleViewChange = (newView) => { setView(newView); };


  useEffect(() => {
    ReactModal.setAppElement("#calendar-view")
  })

  const calendarEvents = events.map(event => {
    const { starts_at, ends_at } = event
    let endDateObj;
    if (ends_at) {
      endDateObj = new Date(`${ends_at}`)
    } else {
      const luxonDate = DateTime.fromISO(`${starts_at}`)
      const oneHourLater = luxonDate.plus({ hours: 1 }).toISO()
      endDateObj = new Date(oneHourLater)
    }

    return {
      ...event,
      start: new Date(`${event.starts_at}`),
      end: endDateObj,
    }
  })

  const onSelectEvent = useCallback((calEvent) => {
    setSelectedEvent(calEvent)
  }, [])

  return (
    <div id="calendar-view">
      <div className="h-[90vh] w-full">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          allDayAccessor="all_day"
          onSelectEvent={onSelectEvent}
          view={view}
          onView={handleViewChange}
          date={date}
          onNavigate={handleNavigate}
        />
      </div>
      <ReactModal
        isOpen={!!selectedEvent}
        onRequestClose={() => setSelectedEvent(null)}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        className="max-w-lg mx-auto h-full"
        style={{
          overlay: { padding: "6vw", zIndex: 100 }
        }}
      >
        <div className="h-full w-full bg-white border-black border-3 rounded-xl overflow-y-auto relative">
          <div className="w-full flex justify-end absolute top-0 left-0 pr-2">
            <button onClick={() => setSelectedEvent(null)} className={`text-lg font-medium btn-clear`}>✕</button>
          </div>
          <div className="p-4">
            <EventCard event={selectedEvent} />
          </div>
        </div>
      </ReactModal>
    </div>
  )
}

export default CalendarView