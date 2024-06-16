import { useState } from "react";
import { AiOutlineDown, AiOutlinePlus, AiOutlineUp } from "react-icons/ai";

export default function PautaInput({ pautas,handleChange }) {
  const [singlePauta, setSinglePauta] = useState(``);

  function handlePautaDelete(index) {
    const newPautas = [...pautas];
    newPautas.splice(index, 1);
    handleChange("pautas", newPautas);
  }
  


  return (
    <div className="standardFlex flex-col items-center lg:items-start lg:pl-10">
      <label className="text-xl my-4">Adicionar Tags a Reunião</label>
      <div
        className="flex w-full lg:w-full h-10 gap-1 rounded-md bg-[#EFEFEF]
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm"
      >
        <input
          type="text"
          id="pautas"
          value={singlePauta}
          className="w-full lg:w-full h-8 bg-[#EFEFEF] p-1 border-0"
          onChange={(e) => setSinglePauta(e.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            if (singlePauta.trim() !== "") {
              handleChange("pautas", [...pautas, singlePauta]);
              setSinglePauta(""); 
            }
          }}
          className="transition easy-in-out hover:bg-slate-300 p-3 "
        >
          <AiOutlinePlus />
        </button>
      </div>
      <div className="flex gap-x-4 gap-y-3 w-[105%] flex-wrap mt-4 text-sm">
        {pautas.length > 0
          ? pautas.map((pauta, index) => (
              <div
                key={index}
                className="flex border py-1 px-2 gap-4 justify-between rounded-full"
              >
                <p>{pauta}</p>
                <button type="button" onClick={() => handlePautaDelete(index)}>
                  X
                </button>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
