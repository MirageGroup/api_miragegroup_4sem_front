export default function TitleInput({title,handleChange}) {
  return (
    <div className="w-full standardFlex flex-col lg:w-4/6 items-center lg:items-start">
      <label htmlFor="meetingName" className="text-xl my-4">
        Título da Reunião
      </label>
      <input
        type="text"
        id="meetingName"
        value={title}
        className="w-full lg:w-full h-10 p-1 border focus:border-black rounded-md bg-[#EFEFEF]"
        onChange={(e) => handleChange("protocol", e.target.value)}
      />
    </div>
  );
}
