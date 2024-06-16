import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import MeetingCard from "../../Cards/MeetingCard";
import Calendar from "../../calendar/calendar";
import { getMeetingsByUser } from "../../../functions/meetingEndpoints";
import MeetingCarousel from "../../carousel/MeetingCarousel";

export default function TodayMeeting() {
  const [meetings, setMeetings] = useState([]);
  const [todayMeetings, setTodayMeetings] = useState([]);
  const [tipoReuniao, setTipoReuniao] = useState("Todos");
  const user = useAuth();

  const handleTipoReuniaoChange = (event) => {
    setTipoReuniao(event.target.value);
  };

  useEffect(() => {
    async function fetchMeetings() {
      try {
        const response = await getMeetingsByUser(user.user.id);
        const todayMeetings = response.filter((meeting) => {
          const meetingDate = new Date(meeting.beginning_time);
          const today = new Date();
          return (
            meetingDate.getDate() === today.getDate() &&
            meetingDate.getMonth() === today.getMonth() &&
            meetingDate.getFullYear() === today.getFullYear()
          );
        });
        setMeetings(response);
        setTodayMeetings(todayMeetings);
      } catch (error) {
        console.error("Erro ao buscar reuniões:", error);
      }
    }
    if (user.user.id) {
      fetchMeetings();
    }
  }, [user.user.id]);

  if (meetings.length === 0) {
    return <div>Não há reuniões criadas no momento...</div>;
  }

  const filteredMeetings = meetings.filter((m) => {
    if (tipoReuniao === "Todos") {
      return true;
    } else {
      return m.meetingType == tipoReuniao;
    }
  });

  return (
    <div className="standardFlex lg:flex-row flex-col justify-center h-full w-full lg:gap-0 lg:p-8 gap-14">
      <div className="lg:w-2/5 w-full px-4 flex flex-col items-center">
        <h1 className="text-4xl font-light mb-10">Suas Reuniões</h1>
        <div className="gap-4 flex justify-center ">
          <select
            className="bg-[#FED353] transition easy-in-out hover:bg-[#F6A700] mb-5 p-3 rounded-md text-base"
            value={tipoReuniao}
            onChange={handleTipoReuniaoChange}
          >
            <option value="Todos">Todos</option>
            <option value={1}>Física</option>
            <option value={2}>Hibrida</option>
            <option value={3}>Virtual</option>
          </select>
        </div>
        <div className="standardFlex flex-col  w-[90%]">
          <MeetingCarousel meetings={filteredMeetings} />
        </div>
      </div>
      <div className="lg:w-3/5 w-[100%] h-full lg:ml-[10rem]">
        <Calendar meetingData={meetings} />
      </div>
    </div >
  );
}
