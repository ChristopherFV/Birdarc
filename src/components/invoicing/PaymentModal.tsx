
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard, Bank, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PaymentMethod, processPayment, calculateProcessingFee } from '@/utils/stripeUtils';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  onPaymentComplete?: (success: boolean) => void;
}

export function PaymentModal({
  open,
  onOpenChange,
  invoiceNumber,
  clientName,
  clientEmail,
  amount,
  onPaymentComplete
}: PaymentModalProps) {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Calculate processing fee
  const processingFee = calculateProcessingFee(amount, paymentMethod);
  const totalAmount = amount + processingFee;
  
  const handleSubmitPayment = async () => {
    setProcessing(true);
    setError(null);
    
    try {
      const result = await processPayment({
        invoiceId: invoiceNumber,
        amount: totalAmount,
        currency: 'USD',
        customerEmail: clientEmail,
        customerName: clientName,
        paymentMethod
      });
      
      if (result.success) {
        setCompleted(true);
        toast({
          title: "Payment Successful",
          description: `Transaction ID: ${result.transactionId}`,
        });
        if (onPaymentComplete) {
          onPaymentComplete(true);
        }
      } else {
        setError(result.error || 'Payment failed');
        toast({
          title: "Payment Failed",
          description: result.error,
          variant: "destructive"
        });
        if (onPaymentComplete) {
          onPaymentComplete(false);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
      toast({
        title: "Payment Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };
  
  const resetState = () => {
    setPaymentMethod('card');
    setCompleted(false);
    setError(null);
  };
  
  const handleClose = () => {
    onOpenChange(false);
    // Reset state after dialog closes
    setTimeout(resetState, 300);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {completed ? "Payment Complete" : "Pay Invoice"}
          </DialogTitle>
        </DialogHeader>
        
        {!completed ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Invoice #:</span>
                <span className="font-medium">{invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Client:</span>
                <span>{clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Amount:</span>
                <span className="font-medium">${amount.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard size={16} />
                    Credit Card
                    <span className="text-xs text-muted-foreground ml-auto">
                      2.9% + $0.30 fee
                    </span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="ach" id="ach" />
                  <Label htmlFor="ach" className="flex items-center gap-2 cursor-pointer">
                    <Bank size={16} />
                    ACH Transfer
                    <span className="text-xs text-muted-foreground ml-auto">
                      0.8% fee (max $5)
                    </span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2 border-t pt-4 mt-4">
              <div className="flex justify-between">
                <span className="text-sm">Processing Fee:</span>
                <span className="text-sm">${processingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            {error && (
              <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-2 text-destructive">
                <AlertCircle size={18} className="mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-lg">Payment Successful</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your payment of ${totalAmount.toFixed(2)} has been processed successfully.
              </p>
            </div>
          </div>
        )}
        
        <DialogFooter>
          {!completed ? (
            <>
              <Button variant="outline" onClick={handleClose} disabled={processing}>
                Cancel
              </Button>
              <Button onClick={handleSubmitPayment} disabled={processing}>
                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {processing ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
              </Button>
            </>
          ) : (
            <Button onClick={handleClose}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
