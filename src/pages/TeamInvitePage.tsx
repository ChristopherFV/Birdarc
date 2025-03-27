import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SimplePageLayout } from '@/components/layout/SimplePageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Send, Users, CheckCircle2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TeamInvitePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [emails, setEmails] = useState<string[]>(['']);
  const [isProcessing, setIsProcessing] = useState(false);
  const [invitesSent, setInvitesSent] = useState(false);
  const [teamCode] = useState('TEAM-' + Math.random().toString(36).substring(2, 8).toUpperCase());

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const addEmailField = () => {
    setEmails([...emails, '']);
  };

  const removeEmailField = (index: number) => {
    if (emails.length > 1) {
      const newEmails = [...emails];
      newEmails.splice(index, 1);
      setEmails(newEmails);
    }
  };

  const copyTeamCode = () => {
    navigator.clipboard.writeText(teamCode);
    toast({
      title: "Team code copied",
      description: "The team code has been copied to your clipboard",
    });
  };

  const handleSendInvites = () => {
    // Validate emails
    const validEmails = emails.filter(email => email.trim() !== '' && /\S+@\S+\.\S+/.test(email));
    
    if (validEmails.length === 0) {
      toast({
        title: "No valid emails",
        description: "Please enter at least one valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call to send invitations
    setTimeout(() => {
      setIsProcessing(false);
      setInvitesSent(true);
      toast({
        title: "Invitations sent",
        description: `Team invitations have been sent to ${validEmails.length} email${validEmails.length > 1 ? 's' : ''}`,
      });
    }, 1500);
  };

  const handleContinueToDashboard = () => {
    navigate('/guided-project');
  };

  return (
    <SimplePageLayout title="Welcome to Fieldvision" subtitle="Invite your team members to get started">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full mr-3">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Build Your Team</h2>
          </div>
          <p className="text-muted-foreground">
            Collaborate with your team members by inviting them to join your Fieldvision workspace.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Team Invite Code</CardTitle>
            <CardDescription>Share this code with your team members to join your workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="bg-muted p-3 rounded-md flex-1 font-mono text-center text-lg">
                {teamCode}
              </div>
              <Button variant="outline" size="icon" onClick={copyTeamCode}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Send Email Invitations</CardTitle>
            <CardDescription>Invite your team members via email</CardDescription>
          </CardHeader>
          <CardContent>
            {!invitesSent ? (
              <div className="space-y-4">
                {emails.map((email, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-1">
                      <Label htmlFor={`email-${index}`} className="sr-only">Email</Label>
                      <Input
                        id={`email-${index}`}
                        type="email"
                        placeholder="colleague@example.com"
                        value={email}
                        onChange={(e) => handleEmailChange(index, e.target.value)}
                      />
                    </div>
                    {emails.length > 1 && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => removeEmailField(index)}
                        aria-label="Remove email"
                      >
                        <div className="h-4 w-4">×</div>
                      </Button>
                    )}
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={addEmailField} 
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Another Email
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="bg-green-100 p-3 rounded-full mb-3">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium">Invitations Sent!</h3>
                <p className="text-muted-foreground text-center mt-1">
                  Your team members will receive an email with instructions to join your workspace.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            {!invitesSent ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleContinueToDashboard}
                >
                  Skip for Now
                </Button>
                <Button 
                  onClick={handleSendInvites} 
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Sending...' : (
                    <>
                      <Send className="h-4 w-4 mr-2" /> Send Invites
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={handleContinueToDashboard}>
                Continue to Next Step
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </SimplePageLayout>
  );
};

export default TeamInvitePage;
