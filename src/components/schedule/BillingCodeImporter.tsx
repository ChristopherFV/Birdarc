
import React, { useState } from 'react';
import { CSVImporter } from '@/components/forms/CSVImporter';
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
  const [showCSVImporter, setShowCSVImporter] = useState(false);
  const { toast } = useToast();

  const handleDataImported = (data: any[]) => {
    if (!data || data.length === 0) {
      toast({
        title: "Error",
        description: "No data found in the CSV file.",
        variant: "destructive",
      });
      return;
    }

    // Validate expected columns
    const requiredColumns = isContractor 
      ? ['billingCodeId', 'quantityEstimate'] 
      : ['billingCodeId', 'quantityEstimate', 'percentage', 'hideRateFromTeamMember'];
    
    const missingColumns = requiredColumns.filter(
      col => !Object.keys(data[0]).includes(col)
    );

    if (missingColumns.length > 0) {
      toast({
        title: "Invalid CSV Format",
        description: `Missing columns: ${missingColumns.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    // Map imported data to BillingCodeEntry objects
    const importedEntries = data.map(row => {
      const billingCodeId = row.billingCodeId?.trim();
      const billingCode = billingCodes.find(bc => bc.id === billingCodeId || bc.code === billingCodeId);
      
      if (!billingCode) {
        return null;
      }

      const entry: BillingCodeEntry = {
        billingCodeId: billingCode.id,
        percentage: isContractor ? 100 : Number(row.percentage) || 0,
        quantityEstimate: Number(row.quantityEstimate) || 0,
        ratePerUnit: isContractor 
          ? (billingCode.ratePerFoot * (Number(row.percentage) || 100)) / 100
          : billingCode.ratePerFoot,
        hideRateFromTeamMember: row.hideRateFromTeamMember === 'true'
      };
      
      return entry;
    }).filter(Boolean);

    if (importedEntries.length === 0) {
      toast({
        title: "Error",
        description: "No valid billing codes found in the CSV file.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Imported ${importedEntries.length} billing codes.`,
    });

    onImport(importedEntries);
    setShowCSVImporter(false);
  };

  return (
    <div className="space-y-2">
      {!showCSVImporter ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowCSVImporter(true)}
          className="w-full"
        >
          Import Billing Codes from CSV
        </Button>
      ) : (
        <div className="space-y-2 p-4 border rounded-md">
          <h4 className="text-sm font-medium mb-2">Import Billing Codes</h4>
          
          <div className="bg-muted p-3 rounded-md text-xs space-y-1 mb-3">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p>CSV file must include these columns:</p>
                <ul className="list-disc list-inside ml-1 mt-1">
                  <li>billingCodeId (ID or code)</li>
                  <li>quantityEstimate (number)</li>
                  {!isContractor && (
                    <>
                      <li>percentage (number, optional)</li>
                      <li>hideRateFromTeamMember (true/false, optional)</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
          
          <CSVImporter onDataImported={handleDataImported} />
          
          <div className="flex justify-end gap-2 mt-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => setShowCSVImporter(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
