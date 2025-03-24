
import React from 'react';
import { Tag } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { FilterDropdown, FilterDropdownItem } from './FilterDropdown';

export const BillingCodeFilter: React.FC = () => {
  const { billingCodes, selectedBillingCodeId, setSelectedBillingCodeId } = useApp();
  const [showBillingCodeMenu, setShowBillingCodeMenu] = React.useState(false);
  
  const handleBillingCodeChange = (billingCodeId: string | null) => {
    setSelectedBillingCodeId(billingCodeId);
    setShowBillingCodeMenu(false);
  };
  
  const getSelectedBillingCodeName = () => {
    if (!selectedBillingCodeId) return 'All Billing Codes';
    const code = billingCodes.find(c => c.id === selectedBillingCodeId);
    return code ? `${code.code} - ${code.description}` : 'All Billing Codes';
  };
  
  return (
    <FilterDropdown
      label={
        <>
          <Tag size={10} className="mr-1" />
          <span className="truncate">{getSelectedBillingCodeName()}</span>
        </>
      }
      isOpen={showBillingCodeMenu}
      toggleOpen={() => setShowBillingCodeMenu(!showBillingCodeMenu)}
      onClose={() => setShowBillingCodeMenu(false)}
      width="w-64"
      className="max-h-64 overflow-y-auto"
    >
      <div className="p-1">
        <FilterDropdownItem
          onClick={() => handleBillingCodeChange(null)}
          isSelected={!selectedBillingCodeId}
        >
          All Billing Codes
        </FilterDropdownItem>
        
        {billingCodes.map((code) => (
          <FilterDropdownItem
            key={code.id}
            onClick={() => handleBillingCodeChange(code.id)}
            isSelected={selectedBillingCodeId === code.id}
          >
            {code.code} - {code.description}
          </FilterDropdownItem>
        ))}
      </div>
    </FilterDropdown>
  );
};
