
import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Company } from '@/context/AppContext';

interface CompanySelectorProps {
  companies: Company[];
  selectedCompany: Company;
  onChange: (company: Company) => void;
}

export const CompanySelector: React.FC<CompanySelectorProps> = ({ 
  companies, 
  selectedCompany,
  onChange
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 bg-card border border-border rounded-md hover:bg-secondary transition-colors"
      >
        <div className="flex items-center">
          <div className="w-7 h-7 rounded-full bg-fieldvision-blue/20 flex items-center justify-center text-fieldvision-blue text-xs font-medium">
            {selectedCompany.name.charAt(0)}{selectedCompany.name.split(' ')[1]?.charAt(0) || ''}
          </div>
          <span className="ml-2.5 text-sm font-medium truncate">
            {selectedCompany.name}
          </span>
        </div>
        <ChevronDown size={16} className="text-muted-foreground" />
      </button>

      {open && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setOpen(false)}
          />
          <div className="absolute mt-1 w-full bg-card border border-border shadow-card rounded-md py-1 z-20 animate-in slide-up">
            {companies.map((company) => (
              <button
                key={company.id}
                onClick={() => {
                  onChange(company);
                  setOpen(false);
                }}
                className={`
                  w-full flex items-center px-3 py-2 text-sm
                  ${selectedCompany.id === company.id ? 'bg-secondary' : 'hover:bg-secondary'}
                `}
              >
                <div className="w-7 h-7 rounded-full bg-fieldvision-blue/20 flex items-center justify-center text-fieldvision-blue text-xs font-medium">
                  {company.name.charAt(0)}{company.name.split(' ')[1]?.charAt(0) || ''}
                </div>
                <span className="ml-2.5 font-medium truncate">
                  {company.name}
                </span>
                {selectedCompany.id === company.id && (
                  <Check size={16} className="ml-auto text-fieldvision-blue" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
