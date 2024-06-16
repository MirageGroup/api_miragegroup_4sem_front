export function CategoryButtons({ selectedCategory, handleChange }) {
  function handleCategoryChange(category) {
    switch (category) {
      case "Fisica":
        handleChange("virtualRoom", null);
        console.log("limpou virtualRoom");
        handleChange("categoryNumber",1);
        break;
      case "Virtual":
        handleChange("physicalRoom", null);
        handleChange("categoryNumber",3);
        break;
      default:
        handleChange("categoryNumber",2);
        break;
    }
    handleChange("category", category);
  }
  return (
    <div className="standardFlex flex-col items-center w-full lg:w-4/6 lg:items-start ">
      <label className="text-xl my-4">Categoria</label>
      <div className="grid grid-cols-3 lg:w-3/5 ">
        <button
          type="button"
          className={`border border-slate-400 ${
            selectedCategory === "Fisica"
              ? "bg-[#FED353] text-[#FFFFFF] border-none shadow-lg"
              : ""
          } p-1 rounded-md`}
          onClick={(e) => handleCategoryChange("Fisica")}
        >
          Presencial
        </button>
        <button
          type="button"
          className={`border border-slate-400 ${
            selectedCategory === "Hibrido"
              ? "bg-[#FED353] text-[#FFFFFF] border-none shadow-lg"
              : ""
          } p-1 rounded-md`}
          onClick={(e) => handleCategoryChange("Hibrido")}
        >
          Híbrido
        </button>
        <button
          type="button"
          className={`border border-slate-400 ${
            selectedCategory === "Virtual"
              ? "bg-[#FED353] text-[#FFFFFF] border-none shadow-lg"
              : ""
          } p-1 rounded-md`}
          onClick={(e) => handleCategoryChange("Virtual")}
        >
          Virtual
        </button>
      </div>
    </div>
  );
}
