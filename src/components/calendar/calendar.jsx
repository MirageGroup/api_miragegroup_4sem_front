import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridWeek from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import CustomEventContent from "./customEventContent";
import { useEffect, useState } from "react";

export default function Calendar({ meetingData }) {
  const [viewHeight, setViewHeight] = useState(window.innerHeight - 150);

  useEffect(() => {
    const handleResize = () => {
      setViewHeight(window.innerHeight - 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const mapMeetingToEvent = (meeting) => ({
    id: meeting.id,
    title: meeting.topic,
    start: new Date(meeting.beginning_time),
    end: new Date(meeting.end_time),
    description: meeting.description,
    meetingTheme: meeting.meetingTheme.join(', '),
  });

  let events = [];
  if (meetingData.length !== 0) {
    events = meetingData.map(mapMeetingToEvent);
  }

  return (
    <div className="w-[100%]">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, dayGridWeek, timeGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        locale={ptBrLocale}
        eventContent={CustomEventContent}
        height={viewHeight}
        eventBorderColor="#fff"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay',
        }}
        nowIndicator={true}


      />
    </div>
  );
}