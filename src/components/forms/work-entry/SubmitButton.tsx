
import React from 'react';
import { Send } from 'lucide-react';

interface SubmitButtonProps {
  isSubmitting: boolean;
  isTechnicianView?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  isSubmitting,
  isTechnicianView = false
}) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`
        w-full py-2.5 bg-fieldvision-orange text-white font-medium rounded-md
        hover:bg-fieldvision-orange/90 transition-colors flex items-center justify-center gap-2
        ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
      `}
    >
      {isTechnicianView && <Send className="size-4" />}
      {isSubmitting ? 'Saving...' : isTechnicianView ? 'Submit for Approval' : 'Save Work Entry'}
    </button>
  );
};
