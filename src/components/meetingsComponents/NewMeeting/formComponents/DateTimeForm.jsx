export default function DateTimeForm({datetime,beginning_time,end_time,handleChange}) {
    return (
      <div className="grid grid-cols-1 items-center lg:items-start lg:grid-cols-2 w-full lg:w-4/6 ">
        <div className="standardFlex flex-col items-center lg:items-start lg:w-3/4">
          <label htmlFor="Data" className="text-xl my-4">
            Data
          </label>
          <input
            type="date"
            id="Data"
            value={datetime}
            className="w-full lg:w-full h-10 p-1 border focus:border-black rounded-md bg-[#EFEFEF] ::placeholder-center"
            onChange={(e) => handleChange("datetime", e.target.value)}
          />
        </div>
  
        <div className="standardFlex flex-col items-center lg:items-start">
          <label htmlFor="Data" className="text-xl my-4">
            Horário
          </label>
          <div className="flex w-4/5 gap-6">
            <input
              type="time"
              id="Time"
              className="w-full lg:w-full h-10 p-1 border focus:border-black rounded-md bg-[#EFEFEF]"
              value={beginning_time}
              onChange={(e) => handleChange("beginning_time", e.target.value)}
            />
            <label className="text-xl">às</label>
            <input
              type="time"
              id="Time"
              value={end_time}
              className="w-full lg:w-full h-10 p-1 border focus:border-black rounded-md bg-[#EFEFEF]"
              onChange={(e) => handleChange("end_time", e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }