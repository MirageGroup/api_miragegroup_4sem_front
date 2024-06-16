import React from 'react';

const CustomEventContent = ({ event }) => {
  const date = new Date(event.startStr);
  const endDate = new Date(event.endStr);
  console.log(event)
  return (
    <div className="flex justify-center">
      <div className="max-w-28 overflow-hidden text-center">
        <p className="text-wrap"><strong>{event.title}</strong></p>
        <p><strong>{date.getHours()}:{date.getMinutes()} - {endDate.getHours()}:{endDate.getMinutes()}</strong></p>
        {/* Adicione mais informações conforme necessário */}
      </div>
    </div>
  );
};

export default CustomEventContent;