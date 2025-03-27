
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SimplePageLayout } from '@/components/layout/SimplePageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Send, Users, CheckCircle2, Copy, Building, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/context/AppContext';

const TeamInvitePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { companies, setSelectedCompany } = useApp();
  const [emails, setEmails] = useState<string[]>(['']);
  const [isProcessing, setIsProcessing] = useState(false);
  const [invitesSent, setInvitesSent] = useState(false);
  const [teamCode] = useState('TEAM-' + Math.random().toString(36).substring(2, 8).toUpperCase());
  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleCompanyLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCompanyLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSendInvites = () => {
    // Validate company name
    if (!companyName.trim()) {
      toast({
        title: "Company name required",
        description: "Please enter your company name",
        variant: "destructive"
      });
      return;
    }
    
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
    
    // Create a new company object
    const newCompany = {
      id: 'company-' + Math.random().toString(36).substring(2, 8),
      name: companyName,
      logo: companyLogo
    };
    
    // Simulate API call to send invitations and save company
    setTimeout(() => {
      setSelectedCompany(newCompany);
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
        {/* Progress indicator */}
        <div className="mb-8 w-full">
          <div className="flex justify-between mb-2">
            <span className="text-xs text-fieldvision-blue font-medium">Company Setup</span>
            <span className="text-xs text-muted-foreground">Team Invites</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-fieldvision-blue to-fieldvision-orange w-1/2 rounded-full" />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-fieldvision-blue/10 p-3 rounded-full mr-3">
              <Building className="h-6 w-6 text-fieldvision-blue" />
            </div>
            <h2 className="text-xl font-semibold">Set Up Your Company</h2>
          </div>
          <p className="text-muted-foreground">
            Personalize your Fieldvision workspace with your company information.
          </p>
        </div>

        <Card className="mb-6 border-fieldvision-blue/20 shadow-lg overflow-hidden">
          <div className="absolute top-0 h-1 w-full bg-gradient-to-r from-fieldvision-blue to-fieldvision-orange"></div>
          <CardHeader className="bg-gradient-to-r from-fieldvision-blue/5 to-fieldvision-orange/5">
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Enter your company name and upload your logo</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="company-name">Company Name</Label>
                <Input 
                  id="company-name" 
                  placeholder="Enter your company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="border-fieldvision-blue/20 focus-visible:ring-fieldvision-blue/30"
                />
              </div>
              
              <div>
                <Label htmlFor="company-logo" className="block mb-2">Company Logo</Label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <Avatar className="w-24 h-24 border-2 border-fieldvision-blue/20">
                    {companyLogo ? (
                      <AvatarImage src={companyLogo} alt="Company logo" />
                    ) : (
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-fieldvision-blue/10 to-fieldvision-orange/10 text-fieldvision-blue">
                        {companyName ? companyName.charAt(0).toUpperCase() : 'F'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <Button 
                      variant="outline" 
                      type="button"
                      onClick={triggerFileInput}
                      className="w-full sm:w-auto border-fieldvision-blue/20 hover:bg-fieldvision-blue/5 hover:text-fieldvision-blue"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {companyLogo ? 'Change Logo' : 'Upload Logo'}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Recommended: Square image, at least 200x200px
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="company-logo"
                      className="hidden"
                      accept="image/*"
                      onChange={handleCompanyLogoUpload}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-fieldvision-orange/10 p-3 rounded-full mr-3">
              <Users className="h-6 w-6 text-fieldvision-orange" />
            </div>
            <h2 className="text-xl font-semibold">Build Your Team</h2>
          </div>
          <p className="text-muted-foreground">
            Collaborate with your team members by inviting them to join your Fieldvision workspace.
          </p>
        </div>

        <Card className="mb-6 border-fieldvision-orange/20 shadow-lg overflow-hidden">
          <div className="absolute top-0 h-1 w-full bg-gradient-to-r from-fieldvision-orange to-fieldvision-blue"></div>
          <CardHeader className="bg-gradient-to-r from-fieldvision-orange/5 to-fieldvision-blue/5">
            <CardTitle>Team Invite Code</CardTitle>
            <CardDescription>Share this code with your team members to join your workspace</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="p-3 bg-fieldvision-orange/5 rounded-lg border border-fieldvision-orange/20 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="font-mono text-lg sm:text-xl font-semibold text-center text-fieldvision-brown flex-1">
                {teamCode}
              </div>
              <Button 
                variant="outline" 
                onClick={copyTeamCode}
                className="w-full sm:w-auto border-fieldvision-orange/20 hover:bg-fieldvision-orange/5 hover:text-fieldvision-orange"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Code
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-fieldvision-orange/20 shadow-lg overflow-hidden">
          <div className="absolute top-0 h-1 w-full bg-gradient-to-r from-fieldvision-orange to-fieldvision-blue"></div>
          <CardHeader className="bg-gradient-to-r from-fieldvision-orange/5 to-fieldvision-blue/5">
            <CardTitle>Send Email Invitations</CardTitle>
            <CardDescription>Invite your team members via email</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
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
                        className="border-fieldvision-blue/20 focus-visible:ring-fieldvision-blue/30"
                      />
                    </div>
                    {emails.length > 1 && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => removeEmailField(index)}
                        aria-label="Remove email"
                        className="border-fieldvision-orange/20 hover:bg-fieldvision-orange/5 hover:text-fieldvision-orange"
                      >
                        <div className="h-4 w-4">×</div>
                      </Button>
                    )}
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={addEmailField} 
                  className="w-full border-fieldvision-blue/20 hover:bg-fieldvision-blue/5 hover:text-fieldvision-blue"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Another Email
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="bg-green-100 p-4 rounded-full mb-4">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-center">Invitations Sent!</h3>
                <p className="text-muted-foreground text-center mt-2 max-w-md">
                  Your team members will receive an email with instructions to join your workspace.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 border-t p-4 bg-muted/20">
            {!invitesSent ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleContinueToDashboard}
                  className="w-full sm:w-auto order-2 sm:order-1 border-fieldvision-blue/20 hover:bg-fieldvision-blue/5"
                >
                  Skip for Now
                </Button>
                <Button 
                  onClick={handleSendInvites} 
                  disabled={isProcessing}
                  className="w-full sm:w-auto order-1 sm:order-2 bg-fieldvision-orange hover:bg-fieldvision-orange/90"
                >
                  {isProcessing ? 'Sending...' : (
                    <>
                      <Send className="h-4 w-4 mr-2" /> Send Invites
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleContinueToDashboard}
                className="w-full sm:w-auto bg-fieldvision-blue hover:bg-fieldvision-blue/90"
              >
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
