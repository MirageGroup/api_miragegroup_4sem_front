import React, { useEffect, useRef } from "react";

export function ModalWrapper({
  children,
  isOpen,
  onClose,
}) {
  const modalRef = useRef(null);

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    const handleOutsideClickRef = (e) => handleOutsideClick(e);

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClickRef);
    } else {
      document.removeEventListener("mousedown", handleOutsideClickRef);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClickRef);
    };
  }, [isOpen, onClose, handleOutsideClick]);

  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center bg-black bg-opacity-45 ">
      <div
        className=" border border-black w-[80%] lg:w-[35%]  bg-white rounded-lg p-4"
        ref={modalRef}
        role="dialog"
      >
        <div className="w-full flex justify-end">

            <button
            className="mt-2 mr-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={onClose}
            >
            X
            </button>
        </div>
        {children}
      </div>
    </div>
  );
}