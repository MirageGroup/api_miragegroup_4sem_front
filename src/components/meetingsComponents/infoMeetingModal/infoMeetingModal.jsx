import { useRef, useState, useEffect } from "react";
import PageTitle from "../../pageTitle/PageTitle";
import { useReactToPrint } from "react-to-print";
import React from "react";
import { toast } from "react-toastify";
import axios from "axios";

const InfoMeetingModal = React.forwardRef(({ id, ataUrl, title, description, date, participants }, ref) => {
    const [uploadedFile, setUploadedFile] = useState(null);

    useEffect(() => {
        if (ataUrl) {
            setUploadedFile({ name: 'Anexo Existente', url: ataUrl });
        }
    }, [ataUrl]);


    const [considerations, setConsiderations] = useState("");
    useEffect(() => {
        // Load saved data from local storage
        const savedData = JSON.parse(localStorage.getItem(`meeting-${id}`));
        if (savedData) {
            setConsiderations(savedData.considerations);
        } 
    }, [id]);

    const handleSave = () => {
        const dataToSave = {
            uploadedFile,
            considerations,
        };
        localStorage.setItem(`meeting-${id}`, JSON.stringify(dataToSave));
        alert("Alterações salvas com sucesso!");
    };

    const handleAta = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".pdf";
        input.onchange = (event) => handleFileChange(event.target.files[0]);
        input.click();
    };

    const handleDownload = (url) => {
        if (url) {
            window.location.href = url;
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
    };

    const uploadAtaToBackend = async (meetingId, file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(`http://localhost:8080/meeting/${meetingId}/uploadata`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                console.log("Arquivo da ata enviado com sucesso!");
                return response.data;  // Assuming response.data contains the uploaded file info
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

        const isSuccess = await uploadAtaToBackend(id, file);
        if (isSuccess) {
            setUploadedFile({ name: file.name, url: isSuccess.url });
            toast.success("Arquivo da ata enviado com sucesso!");
        } else {
            toast.error("Erro ao enviar arquivo da ata. Por favor, tente novamente.");
        }
    };

    return (
        <div className="">
            <div ref={ref}>
                <PageTitle>Ata de Reunião</PageTitle>
                <div className="flex flex-col p-10 gap-4">
                    <div>
                        <h1 className="text-xl font-semibold mb-2">Assunto:</h1>
                        <p>{title}</p>
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold mb-2">Descrição:</h1>
                        <p>{description}</p>
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold mb-2">Data:</h1>
                        <p>{date}</p>
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold mb-2">Participantes:</h1>
                        <ul>
                            {participants.map((p, index) => <li key={index}>{p.name}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold mb-2">Considerações:</h1>
                        <textarea className="w-full h-[150px] resize-none p-1 border focus:border-black rounded-md" value={considerations}
                        onChange={(e) => setConsiderations(e.target.value)}></textarea>
                    </div>

                    <div className="flex gap-3">
                        <h1 className="text-xl font-semibold content-center">Anexo:</h1>
                        <button onClick={handleAta} className="p-1 focus:border-black rounded-md hover:bg-[#EFEFEF]">
                            <img src="/anexo.svg" alt="icone-anexo" />
                        </button>
                    </div>
                    {!uploadedFile && (
                        <p className="text-sm text-gray-500 mt-3">Nenhum arquivo anexado</p>
                    )}
                    <div>
                        {uploadedFile && (
                            <div className="mt-2">
                                <a href="#" onClick={() => handleDownload(uploadedFile.url)}>{uploadedFile.name}</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex justify-end">
                <button onClick={handleSave} className="bg-[#FED353] hover:bg-[#F6A700] transition px-4 py-2 rounded-md">
                    Salvar Alterações
                </button>
            </div>
        </div>
    );
});

export default function InfoMeetingContainer({ id, ataUrl, title, description, date, participants }) {
    const contentDocument = useRef();

    const handlePrint = useReactToPrint({
        content: () => contentDocument.current,
    });

    return (
        <div className="flex gap-4">
            <div className="flex-auto">
                <InfoMeetingModal ref={contentDocument} id={id} ataUrl={ataUrl} title={title} description={description} date={date} participants={participants} />
            </div>
            <button className=" w-[100px] bg-[#FED353] hover:bg-[#F6A700] transition px-4 py-2 rounded-md text-base self-end" onClick={handlePrint}>Imprimir</button>
        </div>
    );
}
