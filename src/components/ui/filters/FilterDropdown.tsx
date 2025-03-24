
import React from 'react';
import { Check, ChevronDown } from 'lucide-react';

interface FilterDropdownProps {
  label: React.ReactNode;
  isOpen: boolean;
  toggleOpen: () => void;
  onClose: () => void;
  className?: string;
  buttonClassName?: string;
  width?: string;
  children: React.ReactNode;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  isOpen,
  toggleOpen,
  onClose,
  className = "",
  buttonClassName = "",
  width = "w-48",
  children
}) => {
  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className={`w-full flex items-center justify-center px-1.5 py-1 text-xs rounded-md bg-secondary hover:bg-secondary/80 transition-colors whitespace-nowrap ${buttonClassName}`}
      >
        {label}
        <ChevronDown size={8} className="ml-1 text-muted-foreground" />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-50" 
            onClick={onClose}
          />
          <div className={`absolute mt-1 z-50 ${width} bg-card shadow-card rounded-md border border-border animate-in slide-in-from-top-5 ${className}`}>
            {children}
          </div>
        </>
      )}
    </div>
  );
};

export const FilterDropdownItem: React.FC<{
  onClick: () => void;
  isSelected: boolean;
  children: React.ReactNode;
}> = ({ onClick, isSelected, children }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center px-3 py-2 text-sm rounded-md
        ${isSelected ? 'bg-secondary/80 font-medium' : 'hover:bg-secondary'}
      `}
    >
      <span className="truncate">{children}</span>
      {isSelected && <Check size={14} className="ml-auto flex-shrink-0" />}
    </button>
  );
};
