import axios from "axios";
import { format } from "date-fns";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

export default function RoomCard({ sala, showDelete }) {
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = async (id, type) => {
    let endpoint = "http://localhost:8080/physicalRoom/delete"

    if (type === "Virtual") {
      endpoint = "http://localhost:8080/virtualRoom/delete"
    }


    try {
      const confirm = window.confirm(
        "Tem certeza que deseja excluir esta Sala?"
      );
      if (confirm) {
        const data = { id: id };
        const response = await axios.delete(endpoint, {
          data: data,
        });
        setIsDeleted(true);
        if (response.status === 200) {
          toast.success("Sala deletada com sucesso", {
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
    } catch (error) {
      console.error("Erro ao deletar Sala:", error);
    }
  };

  if (isDeleted) return null;
  return (
    <div className="standardFlex border border-gray-300 shadow-lg bg-white  items-center p-5 px-6  w-4/6 justify-between gap-4" key={sala.nome}>
      <div className="flex gap-12">
        <div className="flex-col">
          <h1 className="text-2xl font-semibold mb-2">{sala.name}</h1>
          {sala.type == "Física" && (
            <><p className="text-xl mb-2 font-light"><strong>Capacidade Máxima:</strong> {sala.occupancy}</p><p className="text-xl mb-2 font-light"><strong>Localização:</strong> {sala.location}</p></>
          )}
          <p className="text-xl mb-2 font-light"><strong>Nível de Acesso:</strong> {sala.accessLevel}</p>
        </div>
        <div className="flex gap-8 mb-2">
          <p>{sala.type}</p>
        </div>
      </div>
      <div className="flex gap-8">
        {/* <button className="bg-[#FED353] hover:bg-[#F6A700] p-4 rounded-md border border-slate-400">
            <p>Entrar na Reunião</p>
          </button> */}
        {/* {showUpdate == true && (
            
            <button
                className="bg-[#FED353] hover:bg-[#F6A700] p-4 rounded-md border border-slate-400"
                onClick={() => handleUpdate()}
              >
                <p>Atualizar Reunião</p>
              </button>
            )} */}
        {showDelete == true && (
          <button
            className="bg-red-400 hover:bg-red-500 p-4 rounded-md "
            onClick={() => handleDelete(sala.id, sala.type)}
          >
            <p>Excluir Sala</p>
          </button>
        )}


      </div>
    </div>
  )
}