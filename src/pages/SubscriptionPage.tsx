
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SimplePageLayout } from '@/components/layout/SimplePageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Shield, Building, MapPin, FileText, Users, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [additionalUsers, setAdditionalUsers] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [joinMode, setJoinMode] = useState<'new' | 'existing'>('new');
  const [teamCode, setTeamCode] = useState('');

  const plans = [
    {
      id: 'core',
      name: 'Core',
      description: 'Small - Early Stage Contractors',
      price: 59,
      additionalUserFee: 5,
      features: [
        '≤ 3 Active Projects',
        '≤ 100 Tasks per month',
        '≤ 2 Subcontractors',
        'GIS Mapping',
        'Quickbooks Sync',
        'Stripe Payments (subject to processing fees)',
        '5 Marketplace Bid Matches'
      ],
      icon: <MapPin className="h-10 w-10 text-blue-500" />
    },
    {
      id: 'network',
      name: 'Network',
      description: 'Active - Midsize Contractor',
      price: 149,
      additionalUserFee: 5,
      features: [
        '≤ 10 Active Projects',
        '≤ 500 Tasks per month',
        '≤ 10 Subcontractors',
        'All features of Core',
        'Custom Invoice Builder',
        '20 Marketplace Bid Matches'
      ],
      icon: <Building className="h-10 w-10 text-indigo-500" />
    },
    {
      id: 'program',
      name: 'Program',
      description: 'Large General Contractors',
      price: 349,
      additionalUserFee: 5,
      features: [
        'Unlimited Projects',
        'Unlimited Tasks',
        'Unlimited Subcontractors',
        'All Integrations',
        'Payment Ledger Export',
        'Team Admin roles',
        'SSO',
        '50 Marketplace Bid Matches'
      ],
      icon: <Shield className="h-10 w-10 text-purple-500" />
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };
  
  const calculateTotalPrice = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) return 0;
    return plan.price + (additionalUsers * plan.additionalUserFee);
  };

  const handleJoinTeam = () => {
    if (!teamCode) {
      toast({
        title: "Team code required",
        description: "Please enter a valid team code to join an existing team",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call to join team
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Team Joined",
        description: "You've successfully joined the team",
      });
      navigate('/dashboard');
    }, 1500);
  };

  const handleSubscription = () => {
    if (joinMode === 'existing') {
      handleJoinTeam();
      return;
    }
    
    if (!selectedPlan) {
      toast({
        title: "Please select a plan",
        description: "You need to select a subscription plan to continue",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Here you would integrate with Stripe or another payment processor
    // For now, we'll simulate the subscription process
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Subscription Confirmed",
        description: `You are now subscribed to the ${selectedPlan} plan`,
      });
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <SimplePageLayout showFooter={false}>
      <div className="flex flex-col items-center max-w-6xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Get Started with Fieldvision</h1>
          <p className="text-muted-foreground">
            Join an existing team or create a new subscription
          </p>
        </div>

        <Card className="w-full max-w-xl mb-8">
          <CardHeader>
            <CardTitle>Choose an Option</CardTitle>
            <CardDescription>Create a new subscription or join an existing team</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={joinMode} 
              onValueChange={(value) => setJoinMode(value as 'new' | 'existing')}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-accent">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new" className="flex items-center cursor-pointer">
                  <Zap className="h-5 w-5 mr-2 text-blue-500" />
                  <div>
                    <p className="font-medium">Create a new subscription</p>
                    <p className="text-sm text-muted-foreground">Select a plan and set up your team</p>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-accent">
                <RadioGroupItem value="existing" id="existing" />
                <Label htmlFor="existing" className="flex items-center cursor-pointer">
                  <Users className="h-5 w-5 mr-2 text-green-500" />
                  <div>
                    <p className="font-medium">Join an existing team</p>
                    <p className="text-sm text-muted-foreground">Use an invite code to join your team</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
          <CardFooter>
            {joinMode === 'existing' && (
              <div className="w-full space-y-4">
                <div>
                  <Label htmlFor="teamCode">Team Invite Code</Label>
                  <Input 
                    id="teamCode" 
                    value={teamCode} 
                    onChange={(e) => setTeamCode(e.target.value)}
                    placeholder="Enter your team invite code"
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={handleJoinTeam} 
                  disabled={isProcessing} 
                  className="w-full"
                >
                  {isProcessing ? 'Processing...' : 'Join Team'}
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>

        {joinMode === 'new' && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold">Choose Your Subscription Plan</h2>
              <p className="text-muted-foreground">
                Select the plan that best fits your business needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
              {plans.map((plan) => (
                <Card 
                  key={plan.id}
                  className={`border-2 h-full flex flex-col ${selectedPlan === plan.id ? 'border-primary shadow-lg' : 'border-border'}`}
                >
                  <CardHeader className="pb-4">
                    <div className="mb-2">{plan.icon}</div>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="mb-4">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground ml-1">/month</span>
                      <p className="text-sm text-muted-foreground mt-1">+${plan.additionalUserFee} per additional user</p>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant={selectedPlan === plan.id ? "default" : "outline"} 
                      className="w-full"
                      onClick={() => handleSelectPlan(plan.id)}
                    >
                      {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {selectedPlan && (
              <Card className="w-full max-w-xl mb-8">
                <CardHeader>
                  <CardTitle>Finalize Your Subscription</CardTitle>
                  <CardDescription>Add team members and review your subscription</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="additionalUsers">Additional Users</Label>
                      <div className="flex items-center mt-1">
                        <Input 
                          id="additionalUsers" 
                          type="number" 
                          min="0" 
                          value={additionalUsers} 
                          onChange={(e) => setAdditionalUsers(parseInt(e.target.value) || 0)}
                          className="w-24"
                        />
                        <span className="ml-2 text-sm text-muted-foreground">
                          +${additionalUsers * (plans.find(p => p.id === selectedPlan)?.additionalUserFee || 0)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total Monthly:</span>
                        <span>${calculateTotalPrice()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleSubscription} 
                    disabled={isProcessing} 
                    className="w-full"
                  >
                    {isProcessing ? 'Processing...' : 'Subscribe Now'}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </>
        )}
      </div>
    </SimplePageLayout>
  );
};

export default SubscriptionPage;
