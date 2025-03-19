
import React from 'react';

interface FeetCompletedInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const FeetCompletedInput: React.FC<FeetCompletedInputProps> = ({
  value,
  onChange,
  error
}) => {
  return (
    <div>
      <label htmlFor="feetCompleted" className="block text-sm font-medium mb-1">
        Unit Quantity
      </label>
      <div className="relative">
        <input
          type="number"
          id="feetCompleted"
          name="feetCompleted"
          value={value}
          onChange={onChange}
          placeholder="Enter quantity"
          min="0"
          step="1"
          className={`
            w-full px-3 py-2 bg-background border rounded-md text-sm
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary 
            transition-colors
            ${error ? 'border-destructive' : 'border-input'}
          `}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
          units
        </div>
      </div>
      {error && (
        <p className="text-destructive text-xs mt-1">{error}</p>
      )}
    </div>
  );
};
