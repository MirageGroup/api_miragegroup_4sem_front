import { useState } from "react";
import PageTitle from "../../pageTitle/PageTitle";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlinePlus } from "react-icons/ai";

export default function NewRoom() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [roomType, setRoomType] = useState("");
  const [roomData, setRoomData] = useState({
    name: "",
    description: "",
    capacity: 0,
    accessLevel: "",
  });

  const handleChange = (event, field) => {
    event.preventDefault();
    setRoomData({
      ...roomData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let endpoint = `${backendUrl}/physicalRoom/create`;
    if (roomType === "Virtual") {
      endpoint = `${backendUrl}/virtualRoom/create`;
    }

    let data = {
      name: roomData.name,
      accessLevel: roomData.accessLevel,
      login: 'admin',
      password: 'admin'
    };
    if (roomType === "Fisica") {
      data = {
        ...data,
        location: roomData.description,
        occupancy: roomData.capacity,
      };
    }

    try {
      const response = await axios.post(endpoint, data, {
        withCredentials: true,
      });

      if (response.status === 201) {
        toast.success("Sala criada com sucesso", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        console.log(response.status);
        console.log("Erro ao criar sala");
      }

      // Lógica adicional após a criação da sala, se necessário
    } catch (error) {
      console.error(error);
      // Tratamento de erro, se necessário
    }
  };

  return (
    <div className="w-full">
      <PageTitle>Cadastro de Sala</PageTitle>

      {/* Formulário de Cadastro de Sala */}
      <div className="w-full flex justify-center lg:relative">
        <form
          className="p-4 mt-4 standardFlex w-full items-center lg:w-5/6 flex-col gap-8 lg:relative"
          onSubmit={handleSubmit}
        >
          {/* Linha 1: Categoria da Sala */}
          <div className="w-full flex flex-col items-center gap-8">
            <label className="text-2xl my-4">Categoria da Sala</label>
            <div className="flex gap-8">
              <button
                type="button"
                className={`border border-slate-400 ${roomType === "Fisica" ? "bg-[#F6A700]" : ""} p-4 rounded-md`}
                onClick={() => setRoomType("Fisica")}
              >
                Física
              </button>
              <button
                type="button"
                className={`border border-slate-400 ${roomType === "Virtual" ? "bg-[#F6A700]" : ""} p-4 rounded-md`}
                onClick={() => setRoomType("Virtual")}
              >
                Virtual
              </button>
            </div>
          </div>

          {roomType && (
            <>
              {/* Linha 2: Nome da Sala e Descrição ou Nível de Acesso */}
              <div className="w-full flex lg:flex-row flex-col justify-between items-center lg:gap-32 gap-8">
                {/* Nome da Sala */}
                <div className="standardFlex flex-col items-center lg:items-start w-full lg:w-1/2">
                  <label htmlFor="roomName" className="text-2xl my-4">
                    Nome da Sala
                  </label>
                  <input
                    type="text"
                    id="roomName"
                    className="w-full lg:w-full h-12 p-1 border focus:border-black rounded-md bg-[#D9D9D9]"
                    value={roomData.name}
                    onChange={(e) => handleChange(e, "name")}
                  />
                </div>

                {/* Descrição da Sala (apenas para sala física) */}
                {roomType === "Fisica" && (
                  <div className="standardFlex flex-col items-center lg:items-start w-full lg:w-1/2 ">
                    <label htmlFor="description" className="text-2xl my-4">
                      Localização da Sala
                    </label>
                    <input
                      type="text"
                      id="description"
                      className="w-full lg:w-full h-12 p-1 border focus:border-black rounded-md bg-[#D9D9D9]"
                      value={roomData.description}
                      onChange={(e) => handleChange(e, "description")}
                    />
                  </div>
                )}

                {/* Nível de Acesso (apenas para sala virtual) */}
                {roomType === "Virtual" && (
                  <div className="standardFlex flex-col items-center lg:items-start w-full lg:w-1/2">
                    <label htmlFor="accessLevel" className="text-2xl my-4">
                      Nível de Acesso
                    </label>
                    <select
                      id="accessLevel"
                      className="w-full lg:w-full h-12 p-1 border focus:border-black rounded-md bg-[#D9D9D9]"
                      value={roomData.accessLevel}
                      onChange={(e) => handleChange(e, "accessLevel")}
                    >
                      <option value="">Selecione o nível de acesso</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Linha 3: Capacidade Máxima e Nível de Acesso (apenas para sala física) */}
              {roomType === "Fisica" && (
                <div className="w-full flex  lg:flex-row flex-col justify-between items-center lg:gap-32 gap-8">
                  {/* Capacidade Máxima */}
                  <div className="standardFlex flex-col items-center lg:items-start w-full lg:w-1/2">
                    <label htmlFor="capacity" className="text-2xl my-4">
                      Capacidade Máxima
                    </label>
                    <input
                      type="number"
                      id="capacity"
                      className="w-full lg:w-full h-12 p-1 border focus:border-black rounded-md bg-[#D9D9D9]"
                      value={roomData.capacity}
                      min={0}
                      onChange={(e) => handleChange(e, "capacity")}
                    />
                  </div>

                  {/* Nível de Acesso */}
                  <div className="standardFlex flex-col items-center lg:items-start w-full lg:w-1/2">
                    <label htmlFor="accessLevel" className="text-2xl my-4">
                      Nível de Acesso
                    </label>
                    <select
                      id="accessLevel"
                      className="w-full lg:w-full h-12 p-1 border focus:border-black rounded-md bg-[#D9D9D9]"
                      value={roomData.accessLevel}
                      onChange={(e) => handleChange(e, "accessLevel")}
                    >
                      <option value="">Selecione o nível de acesso</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                </div>
              )}
          {/* Botão de Criar Sala Fixo */}
          <button
            type="submit"
            className="bg-[#FED353] transition easy-in-out hover:bg-[#F6A700] mt-10 p-3 rounded-md border border-slate-400 w-[70%] lg:w-1/12 lg:fixed bottom-80 right-48"
          >
            Criar Sala
          </button>
            </>
          )}

          {/* Container de Toast para mensagens */}
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </form>
      </div>
    </div>
  );
}
