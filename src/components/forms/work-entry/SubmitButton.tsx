
import React from 'react';

interface SubmitButtonProps {
  isSubmitting: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting }) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`
        w-full py-2.5 bg-fieldvision-blue text-white font-medium rounded-md
        hover:bg-fieldvision-blue/90 transition-colors
        ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
      `}
    >
      {isSubmitting ? 'Saving...' : 'Save Work Entry'}
    </button>
  );
};
