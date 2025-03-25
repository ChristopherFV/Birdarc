
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Plus, Check, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { BillingCode } from '@/context/AppContext';
import { BillingCodeEntry } from '@/context/ScheduleContext';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface BillingCodeImporterProps {
  billingCodes: BillingCode[];
  onImport: (billingCodeEntries: BillingCodeEntry[]) => void;
  isContractor: boolean;
  projectId: string;
}

export const BillingCodeImporter: React.FC<BillingCodeImporterProps> = ({
  billingCodes,
  onImport,
  isContractor,
  projectId,
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCodeIds, setSelectedCodeIds] = useState<string[]>([]);
  
  // Reset selections when project changes
  useEffect(() => {
    setSelectedCodeIds([]);
  }, [projectId]);

  // Filter billing codes by search term
  const filteredBillingCodes = billingCodes.filter(code => 
    code.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
    code.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleBillingCode = (codeId: string) => {
    setSelectedCodeIds(prev => {
      if (prev.includes(codeId)) {
        return prev.filter(id => id !== codeId);
      } else {
        return [...prev, codeId];
      }
    });
  };

  const handleBulkImport = () => {
    if (selectedCodeIds.length === 0) {
      toast({
        title: "No codes selected",
        description: "Please select at least one billing code.",
        variant: "destructive",
      });
      return;
    }

    // Create billing code entries based on selections
    const selectedEntries: BillingCodeEntry[] = selectedCodeIds.map(id => {
      const code = billingCodes.find(c => c.id === id);
      return {
        billingCodeId: id,
        percentage: isContractor ? 100 : 0,
        ratePerUnit: code?.ratePerFoot || 0,
        quantityEstimate: 10,
        hideRateFromTeamMember: false
      };
    });

    onImport(selectedEntries);
    
    toast({
      title: "Billing Codes Added",
      description: `Added ${selectedEntries.length} billing codes to the task.`,
    });
  };

  if (!projectId) {
    return (
      <div className="p-4 border rounded-md text-center text-muted-foreground">
        Please select a project first to see available billing codes.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search billing codes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      <ScrollArea className="h-60 border rounded-md">
        <div className="p-2 space-y-1">
          {filteredBillingCodes.length === 0 ? (
            <div className="p-4 text-sm text-center text-muted-foreground">
              No billing codes match your search
            </div>
          ) : (
            filteredBillingCodes.map((code) => {
              const isSelected = selectedCodeIds.includes(code.id);
              const calculatedRate = isContractor 
                ? (code.ratePerFoot * 100) / 100
                : code.ratePerFoot;
              
              return (
                <div 
                  key={code.id}
                  className={cn(
                    "p-3 rounded-md border cursor-pointer transition-colors flex items-center justify-between",
                    isSelected ? 'bg-secondary border-primary' : 'hover:bg-secondary/50'
                  )}
                  onClick={() => toggleBillingCode(code.id)}
                >
                  <div className="flex-1">
                    <div className="font-medium">{code.code}</div>
                    <div className="text-sm text-muted-foreground">{code.description}</div>
                    <div className="text-sm font-medium mt-1">
                      ${calculatedRate.toFixed(2)}/unit
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    {isSelected ? (
                      <Check className="h-5 w-5 text-primary" />
                    ) : (
                      <Plus className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {selectedCodeIds.length} codes selected
        </div>
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={handleBulkImport}
          disabled={selectedCodeIds.length === 0}
        >
          Add Selected Codes
        </Button>
      </div>
    </div>
  );
};
