
import React, { useState } from 'react';
import { SimplePageLayout } from '@/components/layout/SimplePageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Bell, 
  CreditCard, 
  Lock, 
  Mail, 
  Settings, 
  SmartphoneCharging,
  MapPin,
  Building 
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const { selectedCompany } = useApp();
  
  // User profile settings
  const [profile, setProfile] = useState({
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    phone: "(206) 555-1234",
    role: "Owner",
    location: "Seattle, WA"
  });
  
  // Company settings
  const [company, setCompany] = useState({
    name: selectedCompany?.name || "FieldVision",
    address: "123 Construction Ave, Seattle, WA 98101",
    taxId: "12-3456789",
    email: "info@fieldvision.com",
    phone: "(206) 555-9876"
  });
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: true,
    invoiceReminders: true,
    workEntryUpdates: true,
    projectAssignments: true
  });
  
  // Billing settings
  const [billing, setBilling] = useState({
    cardName: "Michael Johnson",
    cardNumber: "**** **** **** 4567",
    cardExpiry: "06/25",
    billingAddress: "123 Construction Ave, Seattle, WA 98101",
    invoicePrefix: "INV-",
    defaultPaymentTerms: "Net 30"
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  };

  const handleCompanyUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Company Information Updated",
      description: "Your company information has been saved.",
    });
  };

  const handleNotificationUpdate = () => {
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleBillingUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Billing Information Updated",
      description: "Your billing details have been saved.",
    });
  };

  return (
    <SimplePageLayout
      title="Settings"
      subtitle="Manage your account and application settings"
      showFooter={true}
      footerProps={{
        backLink: "/",
        backLabel: "Dashboard"
      }}
    >
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-4 gap-4 w-full max-w-2xl mb-8">
          <TabsTrigger value="profile" className="flex gap-2 items-center">
            <User size={16} />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="company" className="flex gap-2 items-center">
            <Building size={16} />
            <span>Company</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex gap-2 items-center">
            <Bell size={16} />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex gap-2 items-center">
            <CreditCard size={16} />
            <span>Billing</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid gap-5">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={profile.name} 
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profile.email} 
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={profile.phone} 
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      value={profile.location} 
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Settings */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Manage your company details that appear on invoices and other documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCompanyUpdate} className="space-y-6">
                <div className="grid gap-5">
                  <div className="grid gap-3">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input 
                      id="companyName" 
                      value={company.name} 
                      onChange={(e) => setCompany({...company, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="companyAddress">Business Address</Label>
                    <Input 
                      id="companyAddress" 
                      value={company.address} 
                      onChange={(e) => setCompany({...company, address: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="taxId">Tax ID / EIN</Label>
                    <Input 
                      id="taxId" 
                      value={company.taxId} 
                      onChange={(e) => setCompany({...company, taxId: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="grid gap-3">
                      <Label htmlFor="companyEmail">Business Email</Label>
                      <Input 
                        id="companyEmail" 
                        type="email"
                        value={company.email} 
                        onChange={(e) => setCompany({...company, email: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid gap-3">
                      <Label htmlFor="companyPhone">Business Phone</Label>
                      <Input 
                        id="companyPhone" 
                        value={company.phone} 
                        onChange={(e) => setCompany({...company, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how and when you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications about important updates
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => {
                      setNotifications({...notifications, emailNotifications: checked});
                      handleNotificationUpdate();
                    }}
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive text messages for urgent updates
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked) => {
                      setNotifications({...notifications, smsNotifications: checked});
                      handleNotificationUpdate();
                    }}
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Invoice Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminders about unpaid or upcoming invoices
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.invoiceReminders}
                    onCheckedChange={(checked) => {
                      setNotifications({...notifications, invoiceReminders: checked});
                      handleNotificationUpdate();
                    }}
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Work Entry Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications when work entries are modified
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.workEntryUpdates}
                    onCheckedChange={(checked) => {
                      setNotifications({...notifications, workEntryUpdates: checked});
                      handleNotificationUpdate();
                    }}
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Project Assignments</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you're assigned to a new project
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.projectAssignments}
                    onCheckedChange={(checked) => {
                      setNotifications({...notifications, projectAssignments: checked});
                      handleNotificationUpdate();
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Payment & Billing</CardTitle>
              <CardDescription>
                Manage your payment methods and billing preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBillingUpdate} className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-md bg-muted/50">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">Current Payment Method</h3>
                      </div>
                      <Button variant="outline" size="sm">Change</Button>
                    </div>
                    
                    <div className="grid gap-1 text-sm">
                      <p><span className="text-muted-foreground">Card:</span> {billing.cardNumber}</p>
                      <p><span className="text-muted-foreground">Name:</span> {billing.cardName}</p>
                      <p><span className="text-muted-foreground">Expires:</span> {billing.cardExpiry}</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-5">
                    <div className="grid gap-3">
                      <Label htmlFor="billingAddress">Billing Address</Label>
                      <Input 
                        id="billingAddress" 
                        value={billing.billingAddress} 
                        onChange={(e) => setBilling({...billing, billingAddress: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="grid gap-3">
                        <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                        <Input 
                          id="invoicePrefix" 
                          value={billing.invoicePrefix} 
                          onChange={(e) => setBilling({...billing, invoicePrefix: e.target.value})}
                        />
                      </div>
                      
                      <div className="grid gap-3">
                        <Label htmlFor="paymentTerms">Default Payment Terms</Label>
                        <Input 
                          id="paymentTerms" 
                          value={billing.defaultPaymentTerms} 
                          onChange={(e) => setBilling({...billing, defaultPaymentTerms: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </SimplePageLayout>
  );
};

export default SettingsPage;
