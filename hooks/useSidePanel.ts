import { useState } from 'react';

export function useSidePanel<T>() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const openAdd = (item: T) => {
    setIsOpen(true);
    setMode('add');
    setSelectedItem(item);
  };

  const openEdit = (item: T) => {
    setIsOpen(true);
    setMode('edit');
    setSelectedItem(item);
  };

  const close = () => {
    setIsOpen(false);
    setMode('add');
    setSelectedItem(null);
  };

  return {
    isOpen,
    mode,
    selectedItem,
    openAdd,
    openEdit,
    close,
  };
}