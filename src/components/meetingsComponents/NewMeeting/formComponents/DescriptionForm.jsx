export default function DescriptionForm({ description, handleChange }) {
  return (
    <div className="col-span-2 standardFlex flex-col items-center lg:items-start ">
      <label htmlFor="description" className="text-xl my-4">
        Descrição
      </label>
      <textarea
        type="textArea"
        id="description"
        className="w-full lg:w-full h-[150px] p-1 border focus:border-black rounded-md bg-[#EFEFEF]"
        onChange={(e) => handleChange("description", e.target.value)}
      />
    </div>
  );
}
