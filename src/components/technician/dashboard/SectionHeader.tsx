
import React from 'react';

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title }) => {
  return (
    <div className="flex items-center gap-2 font-semibold text-lg mb-2">
      {icon}
      {title}
    </div>
  );
};
