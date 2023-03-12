import { useState } from "react";

export const useModal = () => { 
  const [currentId, setCurrentId] = useState('');

  const openModal = (id: string) => {
    setCurrentId(id);
  }

  const closeModal = (id: string) => {
    currentId === id && setCurrentId('');
  }

  return { currentId, openModal, closeModal };
}