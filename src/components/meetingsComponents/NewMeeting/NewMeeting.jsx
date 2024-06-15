import { useEffect, useState } from "react";
import PageTitle from "../../pageTitle/PageTitle";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { formatISO } from "date-fns";
import MultiSelectDropdown from "./formComponents/MultiSelectDropdown";
import TitleInput from "./formComponents/TitleInput";
import PautaInput from "./formComponents/PautaInput";
import { CategoryButtons } from "./formComponents/CategoryButtons";
import RoomInput from "./formComponents/RoomInput";
import DateTimeForm from "./formComponents/DateTimeForm";
import DescriptionForm from "./formComponents/DescriptionForm";
import ExternalInput from "./formComponents/ExternalInput";

const formatRequestData = (meetingData) => {
  const beginningTime = new Date(meetingData.datetime);
  const [beginningHours, beginningMinutes] =
    meetingData.beginning_time.split(":");
  beginningTime.setHours(parseInt(beginningHours, 10));
  beginningTime.setMinutes(parseInt(beginningMinutes, 10));
  beginningTime.setSeconds(0);

  const endTime = new Date(meetingData.datetime);
  const [endHours, endMinutes] = meetingData.end_time.split(":");
  endTime.setHours(parseInt(endHours, 10));
  endTime.setMinutes(parseInt(endMinutes, 10));
  endTime.setSeconds(0);

  if (endTime <= beginningTime) {
    endTime.setDate(endTime.getDate() + 1);
  }

  return {
    topic: meetingData.protocol,
    description: meetingData.description,
    beginning_time: formatISO(beginningTime),
    end_time: formatISO(endTime),
    startDate: formatISO(beginningTime),
    accessToken: meetingData.accessToken,
    meetingType: getCategoryNumber(meetingData.category),
    physicalRoom: meetingData.physicalRoom,
    virtualRoom: meetingData.virtualRoom,
    participants: meetingData.selectedUsers,
    meetingTheme: meetingData.pautas,
    guests: meetingData.guests,
  };
};

const fetchSalas = async (handleChange) => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  try {
    const [responseSalasFisicas, responseSalasVirtuais] = await Promise.all([
      axios.get(`${backendUrl}/physicalRoom/get`),
      axios.get(`${backendUrl}/virtualRoom/get`),
    ]);

    const salas = [
      ...responseSalasFisicas.data.map((sala) => ({ ...sala, type: "Fisica" })),
      ...responseSalasVirtuais.data.map((sala) => ({
        ...sala,
        type: "Virtual",
      })),
    ];

    handleChange("salas", salas);
  } catch (error) {
    console.error("Erro ao buscar salas:", error);
  }
};

const fetchUsers = async (setUsers) => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  try {
    const response = await axios.get(`${backendUrl}/user/fetchall`);
    setUsers(response.data);
  } catch (error) {
    console.error(error);
  }
};

const getCategoryNumber = (category) => {
  const categoryMap = { Fisica: 1, Virtual: 3, default: 2 };
  return categoryMap[category] || categoryMap["default"];
};

const handleSubmit = async (event, meetingData, setCreatingMeeting, toast) => {
  event.preventDefault();
  setCreatingMeeting(true);

  const requestData = formatRequestData(meetingData);
  console.log("requestData", requestData);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  try {
    if (requestData.meetingType == 3) {
      const response = await axios.post(
        `${backendUrl}/meeting/create-meeting`,
        requestData,
        { withCredentials: true }
      );
      requestData.join_url = response.data.join_url;
    }
    await axios.post(`${backendUrl}/meeting/create`, requestData, {
      withCredentials: true,
    });
    toast.success("Reunião criada com sucesso", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  } catch (error) {
    console.error(error);
  } finally {
    setCreatingMeeting(false);
  }
};

export default function NewMeeting() {
  const accessToken = localStorage.getItem("accessToken");
  const [meetingData, setMeetingData] = useState({
    selectedUsers: [],
    physicalRoom: null,
    virtualRoom: null,
    accessToken: accessToken,
    pautas: [],
    protocol: "",
    salas: [],
    beginning_time: "",
    end_time: "",
    guests: [],
  });
  const [users, setUsers] = useState([]);
  const [creatingMeeting, setCreatingMeeting] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);

  useEffect(() => {
    fetchSalas(handleChange);
  }, []);

  useEffect(() => {
    fetchUsers(setUsers);
  }, []);

  useEffect(() => {
    // Verifica se todos os dados necessários estão presentes
    if (
      meetingData.protocol &&
      meetingData.datetime &&
      meetingData.selectedUsers.length &&
      meetingData.category
    ) {
      checkAvailableRooms(meetingData);
    }
  }, [
    meetingData.protocol,
    meetingData.datetime,
    meetingData.selectedUsers.length,
    meetingData.category,
  ]);

  const handleChange = (dictKey, value) => {
    setMeetingData((prevData) => ({ ...prevData, [dictKey]: value }));
  };

  const isRoomInputDisabled = !(
    meetingData.protocol &&
    meetingData.datetime &&
    meetingData.selectedUsers.length > 0 &&
    meetingData.category
  );

  const checkAvailableRooms = async (meetingData) => {
    const requestData = formatRequestData(meetingData);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    try {
      let availableRooms;
      if (requestData.meetingType == 1) {
        const response = await axios.post(
          `${backendUrl}/physicalRoom/checkAvailability`,
          requestData,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        availableRooms = response.data;
      }
      if (requestData.meetingType == 3) {
        const response = await axios.post(
          `${backendUrl}/virtualRoom/checkAvailability`,
          requestData,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        availableRooms = response.data;
      }
      console.log("SALAS DISPONIVEIS: ", availableRooms);
      setAvailableRooms(availableRooms);
    } catch (error) {
      console.error("Erro ao verificar disponibilidade das salas :(", error);
    }
  };

  useEffect(() => {
    if (availableRooms.length === 1) {
      if (meetingData.category === "Fisica") {
        handleChange("physicalRoom", availableRooms[0]);
      } else if (meetingData.category === "Virtual") {
        handleChange("virtualRoom", availableRooms[0]);
      }
    }
  }, [availableRooms, meetingData.category]);

  return (
    <div className="w-full h-full">
      <PageTitle>Nova Reunião</PageTitle>
      <div className="w-full">
        <form
          className="p-4 mt-4 lg:gap-8"
          onSubmit={(e) =>
            handleSubmit(e, meetingData, setCreatingMeeting, toast)
          }
        >
          <div className="grid  grid-cols-1 w-full justify-center  items-center  gap-32">
            <TitleInput
              title={meetingData.protocol}
              handleChange={handleChange}
            />
            <DateTimeForm handleChange={handleChange} />
            <div className="standardFlex flex-col lg:w-4/6 w-full  items-center lg:items-start">
              <div className="standardFlex flex-col lg:w-5/6 w-full items-center lg:items-start">
                <label htmlFor="participants" className="text-xl my-4">
                  Adicione um novo usuario
                </label>
                <MultiSelectDropdown
                  options={users}
                  selectedOptions={meetingData.selectedUsers}
                  setSelectedOptions={(selected) =>
                    handleChange("selectedUsers", selected)
                  }
                  placeholder="Adicione um novo usuario"
                />
              </div>
            </div>
            <CategoryButtons
              selectedCategory={meetingData.category}
              handleChange={handleChange}
            />
            <div className="grid grid-cols-1 items-center lg:items-start lg:grid-cols-2 w-full lg:w-4/6  ">
              <RoomInput
                salas={meetingData.salas}
                selectedCategory={meetingData.category}
                handleChange={handleChange}
                isDisabled={isRoomInputDisabled}
                availableRooms={availableRooms}
              />
              <PautaInput
                handleChange={handleChange}
                pautas={meetingData.pautas}
              />
            </div>
            <div className="grid grid-cols-1 items-center lg:items-start lg:grid-cols-2 lg:w-4/6 w-full ">
              <ExternalInput
                guests={meetingData.guests}
                handleChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-3 grid-rows-2 lg:w-4/6 w-full">
              <DescriptionForm
                description={meetingData.description}
                handleChange={handleChange}
              />
              <div className="w-full flex flex-col lg:flex-row items-center lg:justify-end self-start mt-8 lg:col-span-1 lg:self-end  col-span-3">
                {!creatingMeeting ? (
                  <button
                    type="submit"
                    className="bg-[#FED353] text-[#FEFEFE] transition ease-in-out hover:bg-[#F6A700] p-2 rounded-md shadow-lg w-[124px] mt-4 lg:mt-0 lg:ml-4"
                  >
                    Criar
                  </button>
                ) : (
                  <div
                    role="status"
                    className="p-2 rounded-md bg-[#FED353] flex justify-center shadow-lg w-[124px] mt-4 lg:mt-0 lg:ml-4"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-6 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-black"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
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
