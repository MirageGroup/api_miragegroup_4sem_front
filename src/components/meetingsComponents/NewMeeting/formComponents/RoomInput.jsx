export default function RoomInput({ salas, selectedCategory, handleChange, isDisabled, availableRooms }) {

  const handleRoomSelection = (id) => {
    const selectedRoom = salas.filter((sala) => sala.type == selectedCategory).find((sala) => sala.id == id);
    if (selectedRoom) {
      if (selectedRoom.type == "Fisica") {
        console.log("mudando sala")
        handleChange("physicalRoom", selectedRoom);
      } else if (selectedRoom.type == "Virtual"){
        handleChange("virtualRoom", selectedRoom);
      }
    }
  };

  return (
    <div className="standardFlex flex-col items-center lg:items-start lg:pr-10 self-start">
      <label className="text-xl my-4">Sala Virtual / Presencial</label>
      {isDisabled ? (
        <div className="w-full lg:w-full h-10 p-1 border focus:border-black rounded-md bg-[#EFEFEF] flex items-center justify-center">
          <span>Insira as outras informações primeiro</span>
        </div>
      ) : (
        <select
          type="select"
          onChange={(e) => handleRoomSelection(e.target.value)}
          className="w-full lg:w-full h-10 p-1 border focus:border-black rounded-md bg-[#EFEFEF]"
          defaultValue={''}
        >
          <option value="" disabled>
            {selectedCategory == null ? "Selecione uma categoria" : "Selecione uma sala"}
          </option>
          {availableRooms &&
            availableRooms.map((sala) => (
              <option key={sala.id} value={sala.id}>
                {sala.type === "Virtual" ? `Sala Virtual ${sala.id}` : sala.name}
              </option>
            ))}
        </select>
      )}
    </div>
  );
}