
import React, { useState } from 'react';
import { Download, ChevronDown, Mail } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const ExportButton: React.FC<{
  filesView?: boolean;
}> = ({ filesView = false }) => {
  const { exportData, projects } = useApp();
  const { toast } = useToast();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [exportType, setExportType] = useState<'raw' | 'summary' | 'files-by-project'>('files-by-project');
  
  const handleExport = (type: 'raw' | 'summary' | 'files-by-project', emailDeliver = false) => {
    // Close the dropdown menu
    setShowExportMenu(false);
    
    // Store the export type for potential email delivery
    setExportType(type);
    
    if (emailDeliver) {
      // Open email dialog instead of immediately exporting
      setShowEmailDialog(true);
      return;
    }
    
    if (type === 'files-by-project') {
      toast({
        title: "Export started",
        description: selectedProject 
          ? `Exporting files for project ${projects.find(p => p.id === selectedProject)?.name || selectedProject}...`
          : "Exporting files by project for completed tasks...",
      });
      
      // In a real app, this would connect to a backend service
      setTimeout(() => {
        toast({
          title: "Export complete",
          description: "Files have been exported successfully",
        });
      }, 1500);
    } else {
      exportData(type);
    }
  };
  
  const handleSendEmail = () => {
    // Email validation
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Email delivery started",
      description: `Sending export to ${email}...`,
    });
    
    // In a real app, this would connect to a backend service
    setTimeout(() => {
      toast({
        title: "Email sent",
        description: `Export has been sent to ${email}`,
      });
      
      // Close the dialog and reset email
      setShowEmailDialog(false);
      setEmail('');
    }, 1500);
  };
  
  return (
    <>
      <DropdownMenu open={showExportMenu} onOpenChange={setShowExportMenu}>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center px-2 py-1 rounded-md bg-fieldvision-blue text-white text-xs font-medium hover:bg-fieldvision-blue/90 transition-colors"
          >
            <Download size={12} className="mr-1" />
            <span>Export</span>
            <ChevronDown size={10} className="ml-1" />
          </button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-48" align="end">
          {filesView && (
            <>
              {projects.length > 0 && (
                <div className="px-3 py-2">
                  <Select
                    value={selectedProject || ""}
                    onValueChange={(value) => setSelectedProject(value === "all" ? null : value)}
                  >
                    <SelectTrigger className="w-full text-xs h-7">
                      <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <DropdownMenuItem onClick={() => handleExport('files-by-project')}>
                <Download className="mr-2 h-4 w-4" />
                <span>Download Files (ZIP)</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => handleExport('files-by-project', true)}>
                <Mail className="mr-2 h-4 w-4" />
                <span>Email Files (ZIP)</span>
              </DropdownMenuItem>
            </>
          )}
          
          {!filesView && (
            <>
              <DropdownMenuItem onClick={() => handleExport('raw')}>
                <Download className="mr-2 h-4 w-4" />
                <span>Raw Data (CSV)</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => handleExport('summary')}>
                <Download className="mr-2 h-4 w-4" />
                <span>Summary Report (CSV)</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => handleExport('raw', true)}>
                <Mail className="mr-2 h-4 w-4" />
                <span>Email Report (CSV)</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Export via Email</DialogTitle>
            <DialogDescription>
              Enter the email address where you'd like to receive the exported files.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSendEmail}>
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
