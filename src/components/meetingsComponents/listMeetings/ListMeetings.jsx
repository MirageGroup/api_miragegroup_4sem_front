import React, { useEffect, useState } from "react";
import PageTitle from "../../pageTitle/PageTitle";
import axios from "axios";
import MeetingCard from "../../Cards/MeetingCard";
import { useNavigate } from "react-router-dom";
import { getAllMeetings } from "../../../functions/meetingEndpoints";

export default function ListMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [tipoReuniao, setTipoReuniao] = useState("Todos");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMeetings() {
      const meetingsResponse = await getAllMeetings();
      console.log("response", meetingsResponse);
      setMeetings(meetingsResponse);
    }
    fetchMeetings();
  }, []);

  const createMeeting = () => {
    navigate("/createMeeting");
  };

  const handleTipoReuniaoChange = (event) => {
    setTipoReuniao(event.target.value);
  };
  const filteredMeetings =
    tipoReuniao === "Todos"
      ? meetings
      : meetings.filter((m) => m.meetingType == tipoReuniao);  return (
        <div className="p-4 md:p-8">
          <PageTitle>Reuniões</PageTitle>
          <div className="flex flex-col md:flex-row gap-4 my-8 justify-between items-center">
            <select
              className="bg-[#FED353] transition easy-in-out hover:bg-[#F6A700] p-3 rounded-md w-full md:w-28"
              value={tipoReuniao}
              onChange={handleTipoReuniaoChange}
            >
              <option value="Todos">Todos</option>
              <option value={1}>Física</option>
              <option value={2}>Hibrida</option>
              <option value={3}>Virtual</option>
            </select>
            <button
              className="bg-[#FED353] transition easy-in-out hover:bg-[#F6A700] py-3 px-0.5 rounded-md w-full md:w-2/12"
              onClick={createMeeting}
            >
              Criar nova Reunião
            </button>
          </div>
          <div className="flex flex-col gap-4 my-8">
            {filteredMeetings.map((m) => {
    
              return (
                <MeetingCard
                  m={m}
                  key={m.id}
                  showInformation={true}
                  showDelete={true}
                  showUpdate={true}
                  showJoin={true}
                />
              );
            })}
          </div>
        </div>
      );
}
