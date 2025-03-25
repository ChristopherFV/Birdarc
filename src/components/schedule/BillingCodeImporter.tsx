
import React from 'react';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { BillingCode } from '@/context/AppContext';
import { BillingCodeEntry } from '@/context/ScheduleContext';

interface BillingCodeImporterProps {
  billingCodes: BillingCode[];
  onImport: (billingCodeEntries: BillingCodeEntry[]) => void;
  isContractor: boolean;
}

export const BillingCodeImporter: React.FC<BillingCodeImporterProps> = ({
  billingCodes,
  onImport,
  isContractor,
}) => {
  const { toast } = useToast();

  const handleBulkImport = () => {
    // Create sample billing code entries based on current mode
    const sampleEntries: BillingCodeEntry[] = billingCodes.slice(0, 3).map(code => {
      return {
        billingCodeId: code.id,
        percentage: isContractor ? 100 : 0,
        ratePerUnit: code.ratePerFoot,
        quantityEstimate: 10,
        hideRateFromTeamMember: false
      };
    });

    onImport(sampleEntries);
    
    toast({
      title: "Bulk Selection",
      description: `Added ${sampleEntries.length} billing codes.`,
    });
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleBulkImport}
        className="w-full"
      >
        Bulk Select Billing Codes
      </Button>
    </div>
  );
};
