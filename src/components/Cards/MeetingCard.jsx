import axios from "axios";
import { format, isBefore } from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ModalWrapper } from "../wrappers/modalWrapper";
import InfoMeetingModal from "../meetingsComponents/infoMeetingModal/infoMeetingModal";

export default function MeetingCard({ m, showInformation, showDelete, showUpdate, showJoin }) {
  const [isDeleted, setIsDeleted] = useState(false);
  const navigate = useNavigate();

  const[openModal, setOpenModal] = useState(false);

  const handleDelete = async (id) => {
    try {
      const confirm = window.confirm("Tem certeza que deseja excluir esta reunião?");
      if (confirm) {
        const data = { id: id };
        await axios.delete(`http://localhost:8080/meeting/delete`, {
          data: data,
        });
        setIsDeleted(true);
        toast.success("Reunião deletada com sucesso", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Erro ao deletar reunião:", error);
      toast.error("Erro ao deletar reunião");
    }
  };

  const handleUpdate = () => {
    navigate("/updateMeeting/" + m.id);
  };

  const handleJoinMeeting = () => {
    if (m.join_url) {
      window.location.href = m.join_url;
    } else {
      toast.error("URL de entrada na reunião não disponível", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  let location = null;
  let meetingType = "";

  if (m.meetingType == 1 || m.meetingType == 2) {
    meetingType = m.meetingType == 1 ? "Presencial" : "Hibrida";
    if (m.physicalRoom) {
      location = (
        <div>
          <strong>Local:</strong> {m.physicalRoom.location}
        </div>
      );
    }
  } else {
    meetingType = "Virtual";
  }

  if (isDeleted) {
    return null;
  } else {
    const currentDateTime = new Date();
    const meetingDateTime = new Date(m.beginning_time);
    const showUpdateButton = showUpdate && isBefore(currentDateTime, meetingDateTime);
    const showJoinButton = showJoin && isBefore(currentDateTime, meetingDateTime);

    return (
      <div className="flex flex-col lg:flex-row border border-gray-300 shadow-lg bg-white items-start lg:items-center p-4 px-4 justify-between gap-4 w-full lg:w-[75%]">
        <div className="flex flex-col justify-start items-start lg:justify-center gap-2 w-full lg:w-1/2">
          <div className="flex flex-col items-start">
            <h1 className="text-2xl font-semibold mb-2">{m.topic}</h1>
            <p className="text-lg font-light">
              <strong>Tipo de reunião:</strong> {meetingType}
            </p>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-lg font-light">
              <strong>Capacidade máxima:</strong>{" "}
              {(m.meetingType === 1 || m.meetingType === 2) && m.physicalRoom
                ? m.physicalRoom.occupancy
                : "livre"}
            </span>
            <div className="text-lg font-light">{location}</div>
          </div>
          <div className="flex flex-col items-start gap-2">
            <p className="text-lg font-light">
              <strong>Data:</strong>{" "}
              {format(new Date(m.beginning_time), "dd/MM/yyyy")}
            </p>
            <p className="text-lg font-light">
              <strong>Hora:</strong>{" "}
              {format(new Date(m.beginning_time), "HH:mm")} -{" "}
              {format(new Date(m.end_time), "HH:mm")}
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-8 items-start md:items-center w-full md:w-1/2">
        {showInformation && (
            <div>
              <button
                className="bg-[#FED353] hover:bg-[#F6A700] transition px-4 py-2 rounded-md text-base mt-auto"
                onClick={() => setOpenModal(true)}
              >
                <p>ATA</p>
              </button>
              <ModalWrapper onClose={() => setOpenModal(false)} isOpen={openModal}><InfoMeetingModal id={m.id} title={m.topic} description={m.description} ataUrl={m.ata_url} date={format(new Date(m.beginning_time), "dd/MM/yyyy")} participants={m.participants}/></ModalWrapper>
            </div>
          )}
          {showJoinButton && m.join_url && (
            <button
              className="bg-[#FED353] hover:bg-[#F6A700] transition px-4 py-2 rounded-md text-base mt-auto"
              onClick={handleJoinMeeting}
            >
              <p>Entrar na Reunião</p>
            </button>
          )}
          {showUpdateButton && (
            <button
              className="bg-[#FED353] hover:bg-[#F6A700] transition px-4 py-2 rounded-md text-base mt-auto"
              onClick={handleUpdate}
            >
              <p>Atualizar Reunião</p>
            </button>
          )}
          {showDelete && (
            <button
              className="bg-red-400 hover:bg-red-500 px-4 py-2 rounded-md"
              onClick={() => handleDelete(m.id)}
            >
              <p>Excluir Reunião</p>
            </button>
          )}
        </div>
      </div>
    );
  }
}