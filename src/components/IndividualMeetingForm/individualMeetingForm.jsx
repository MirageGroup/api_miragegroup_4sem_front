import { useEffect, useState } from "react";
import DateTimeForm from "../meetingsComponents/NewMeeting/formComponents/DateTimeForm";
import RoomInput from "../meetingsComponents/NewMeeting/formComponents/RoomInput";
import axios from "axios"
import { formatISO } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import PageTitle from "../pageTitle/PageTitle";

export default function IndividualMeetingForm() {
    const [availableRooms, setAvailableRooms] = useState([]);
    const [creatingMeeting, setCreatingMeeting] = useState(false);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const [meetingData, setMeetingData] = useState({
        physicalRoom: null,
        virtualRoom: null,
        salas: [],
        beginning_time: "",
        end_time: "",
        category:"Fisica"
    });


    const handleChange = (dictKey, value) => {
        setMeetingData((prevData) => ({ ...prevData, [dictKey]: value }));
    };



    const formatRequestData = (meetingData) => {
        const beginningTime = new Date(meetingData.datetime);
        const [beginningHours, beginningMinutes] = meetingData.beginning_time.split(":");
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
            topic: `reunião individual ${meetingData.selectedUsers[0].name}`,
            description: "",
            beginning_time: formatISO(beginningTime),
            end_time: formatISO(endTime),
            startDate: formatISO(beginningTime),
            accessToken: '',
            meetingType: 1,
            physicalRoom: meetingData.physicalRoom,
            virtualRoom: meetingData.virtualRoom,
            participants: meetingData.selectedUsers,
            meetingTheme: '',
            guests: [],
        };
    };

    const fetchSalas = async (handleChange) => {
        try {
            const [responseSalasFisicas] = await Promise.all([
                axios.get(`${backendUrl}/physicalRoom/get`),
                // axios.get("http://localhost:8080/virtualRoom/get"),
            ]);

            const salas = [
                ...responseSalasFisicas.data.map((sala) => ({ ...sala, type: "Fisica" })),
                // ...responseSalasVirtuais.data.map((sala) => ({ ...sala, type: "Virtual" })),
            ];
            handleChange("salas", salas);
        } catch (error) {
            console.error("Erro ao buscar salas:", error);
        }
    };

    const fetchUser = async (handleChange) => {
        const token = localStorage.getItem("token")
        try {
            const response = await axios.get(`${backendUrl}/user/getprofile`, {
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
            handleChange("users", [response.data])
            handleChange("selectedUsers",[response.data])
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (event, meetingData, setCreatingMeeting, toast) => {
        event.preventDefault();
        setCreatingMeeting(true);

        const requestData = formatRequestData(meetingData)
        console.log("requestData", requestData);
        try {
            if (requestData.meetingType == 3) {
                const response = await axios.post(`${backendUrl}/meeting/create-meeting`, requestData, { withCredentials: true });
                requestData.join_url = response.data.join_url;
            }
            await axios.post(`${backendUrl}/meeting/create`, requestData, { withCredentials: true });
            toast.success("Reunião criada com sucesso", { position: "top-center", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "dark" });
        } catch (error) {
            console.error(error);
        } finally {
            setCreatingMeeting(false);
        }
    };

    useEffect(() => {
        fetchSalas(handleChange)
        fetchUser(handleChange)
    }, [])

    return (
        <form className="flex flex-col gap-8 p-2" onSubmit={(e) => handleSubmit(e, meetingData, setCreatingMeeting, toast)}>
            <PageTitle>Nova Reunião Individual</PageTitle>
            <DateTimeForm handleChange={handleChange}></DateTimeForm>
            <RoomInput salas={meetingData.salas} selectedCategory={meetingData.category} handleChange={handleChange} isDisabled={false} availableRooms={meetingData.salas}></RoomInput>
            <button type="submit" className="bg-[#FED353] text-[#FEFEFE] transition easy-in-out hover:bg-[#F6A700] p-2 rounded-md shadow-lg w-[124px]">
                Criar
            </button>
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
    )
}