
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Github, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SimplePageLayout } from '@/components/layout/SimplePageLayout';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Magic link sent",
        description: "Check your email for a sign-in link",
      });
    }, 1000);
  };
  
  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login successful",
        description: `Signed in with ${provider}`,
      });
      navigate('/');
    }, 1000);
  };
  
  return (
    <SimplePageLayout showFooter={false}>
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-md mx-auto px-4">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src="/lovable-uploads/4a7fa1f1-9138-41e0-a593-01d098a4d5f9.png" 
            alt="Fieldvision Logo" 
            className="h-16 mx-auto" 
          />
        </div>
        
        <div className="w-full space-y-6 bg-card p-8 rounded-lg shadow-sm border border-border">
          <h1 className="text-2xl font-semibold text-center">Sign In</h1>
          
          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline"
              className="w-full" 
              onClick={() => handleSocialLogin('GitHub')}
              disabled={isLoading}
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleSocialLogin('Twitter')}
              disabled={isLoading}
            >
              <Twitter className="mr-2 h-4 w-4" />
              Twitter
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          {/* Email Form */}
          <form onSubmit={handleEmailSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Mail className="mr-2 h-4 w-4" />
                    Continue with Email
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
        
        <p className="mt-6 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link to="#" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="#" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </SimplePageLayout>
  );
};

export default LoginPage;
