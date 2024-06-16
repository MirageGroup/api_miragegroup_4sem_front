import React from 'react';

const CustomEventContent = ({ event }) => {
  const date = new Date(event.startStr);
  const endDate = new Date(event.endStr);
  console.log(event)
  return (
    <div className="">
      <div className="overflow-auto max-w-28">
        <p><strong>{event.title}</strong></p>
        <p><strong>{date.getHours()}:{date.getMinutes()} - {endDate.getHours()}:{endDate.getMinutes()}</strong></p>
        {/* Adicione mais informações conforme necessário */}
      </div>
    </div>
  );
};

export default CustomEventContent;