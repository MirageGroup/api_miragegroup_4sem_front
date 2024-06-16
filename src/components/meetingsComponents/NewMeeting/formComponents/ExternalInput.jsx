import { useState } from "react";
import { AiOutlinePlus, AiOutlineUp } from "react-icons/ai";

export default function ExternalInput({ guests, handleChange }) {
  const [singleGuest, setSingleGuest] = useState("");
  const [error, setError] = useState("");

  function handleGuestDelete(index) {
    const newGuest = [...guests];
    newGuest.splice(index, 1);
    handleChange("guests", newGuest);
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function handleAddGuest() {
    if (singleGuest.trim() === "") {
      setError("O campo não pode estar vazio");
      return;
    }

    if (!validateEmail(singleGuest)) {
      setError("Por favor, insira um endereço de e-mail válido");
      return;
    }

    handleChange("guests", [...guests, singleGuest]);
    setSingleGuest("");
    setError("");
  }

  return (
    <div className="standardFlex flex-col items-center lg:items-start ">
      <label className="text-xl my-4">Adicionar convidados externos a Reunião</label>
      <div
        className="flex w-full lg:w-full h-10 gap-1 rounded-md bg-[#EFEFEF]
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm"
      >
        <input
          type="text"
          id="guests"
          value={singleGuest}
          className="w-full lg:w-full h-8 bg-[#EFEFEF] p-1 border-0"
          onChange={(e) => {
            setSingleGuest(e.target.value);
            setError(""); // Clear error message when user starts typing
          }}
        />
        <button
          type="button"
          onClick={handleAddGuest}
          className="transition easy-in-out hover:bg-slate-300 p-3"
        >
          <AiOutlinePlus />
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex gap-x-4 gap-y-3 w-[100%] flex-wrap mt-4 text-sm">
        {guests.length > 0
          ? guests.map((guest, index) => (
              <div
                key={index}
                className="flex border py-1 px-2 gap-4 justify-between rounded-full"
              >
                <p>{guest}</p>
                <button type="button" onClick={() => handleGuestDelete(index)}>
                  X
                </button>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}