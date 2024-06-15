import axios from "axios";
import { format } from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function MeetingCardDash({ m, showDelete, showUpdate, showJoin, showAta, showDownloadAta }) {
  const [isDeleted, setIsDeleted] = useState(false);
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleDelete = async (id) => {
    try {
      const confirm = window.confirm(
        "Tem certeza que deseja excluir esta reunião?"
      );
      if (confirm) {
        const data = { id: id };
        await axios.delete(`${backendUrl}/meeting/delete`, {
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

  const handleAta = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";
    input.onchange = (event) => handleFileChange(event.target.files[0]);
    input.click();
  };

  const handleDownload = () => {
    if (m.ata_url) {
      window.location.href = m.ata_url;
    } else {
      toast.error("URL de ATA não disponível", {
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
  }

  const uploadAtaToBackend = async (meetingId, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(`${backendUrl}/meeting/${meetingId}/uploadata`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        console.log("Arquivo da ata enviado com sucesso!");
        return true;
      } else {
        console.error("Erro ao enviar arquivo da ata:", response.statusText);
        return false;
      }
    } catch (error) {
      console.error("Erro ao enviar arquivo da ata:", error);
      return false;
    }
  };

  const handleFileChange = async (file) => {
    if (!file) return;

    const isSuccess = await uploadAtaToBackend(m.id, file);
    if (isSuccess) {
      toast.success("Arquivo da ata enviado com sucesso!");
    } else {
      toast.error("Erro ao enviar arquivo da ata. Por favor, tente novamente.");
    }
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
    meetingType = m.meetingType == 1 ? "Presencial" : "Híbrida";
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
    return (
      <div
        className="border border-gray-300 p-6 shadow-lg bg-white max-w-[16rem]"
        key={m.nome}
      >
        <div className="flex flex-col justify-between h-full min-h-[16rem]">
          <div>
            <h1 className="text-2xl font-semibold mb-2">{m.topic}</h1>
            <p className="text-gray-600 mb-2 text-sm">{format(new Date(m.beginning_time), "dd/MM/yy - HH:mm")}</p>
            <p className="text-gray-700 mb-4 text-sm">{m.description}</p>
          </div>
          {showJoin && m.join_url && (
            <button
              className="bg-[#FED353] hover:bg-[#F6A700] transition p-2 rounded-md text-base mt-auto"
              onClick={handleJoinMeeting}
            >
              Ingressar no Zoom
            </button>
          )}
        </div>
      </div>
    );
  }
}
