import React, { useState } from 'react';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';

const MultiSelectDropdown = ({ options, selectedOptions, setSelectedOptions, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelectOption = (option) => {
    if (selectedOptions.some((item) => item.id == option.id)) {
      setSelectedOptions(selectedOptions.filter((item) => item.id != option.id));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const placeholderText = selectedOptions.length > 0 ?
    `${selectedOptions.length} selecionados` :
    placeholder;

  return (
    <div className="lg:relative w-full lg:w-1/2 h-10 p-1 border focus:border-black rounded-md bg-[#EFEFEF] ">
      <div className="flex justify-between items-center cursor-pointer" onClick={handleToggle}>
        <span>{placeholderText}</span>
        {isOpen ? <AiOutlineUp /> : <AiOutlineDown />}
      </div>
      {isOpen && (
        <div className="absolute mt-2 left-0 right-0 bg-white border rounded-md shadow-lg z-10">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full p-2 border-b"
          />
          {filteredOptions.map((option) => (
            <label key={option.id} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedOptions.some((item) => item.id == option.id)}
                onChange={() => handleSelectOption(option)}
                className="mr-2"
              />
              {option.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
