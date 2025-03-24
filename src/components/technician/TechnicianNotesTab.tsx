
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Trash2, Download, FileType } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { MapNote } from './TechnicianLocationMap';
import { 
  notesToGeoJSON, 
  notesToKMZ, 
  downloadFile 
} from '@/utils/mapExportUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TechnicianNotesTabProps {
  notes: MapNote[];
  deleteNote: (id: string) => void;
  saveGeneralNotes: (notes: string) => void;
  generalNotes: string;
}

export const TechnicianNotesTab: React.FC<TechnicianNotesTabProps> = ({ 
  notes, 
  deleteNote, 
  saveGeneralNotes,
  generalNotes
}) => {
  const { toast } = useToast();
  const [notesText, setNotesText] = useState<string>(generalNotes || '');
  const [isExporting, setIsExporting] = useState(false);
  
  const handleSaveNotes = () => {
    saveGeneralNotes(notesText);
    toast({
      title: "Notes saved",
      description: "Your notes have been saved successfully",
    });
  };
  
  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    toast({
      title: "Note deleted",
      description: "The map pin and associated note have been removed",
    });
  };
  
  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleExportGeoJSON = () => {
    if (notes.length === 0) {
      toast({
        title: "No notes to export",
        description: "Add some map notes first",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsExporting(true);
      const geoJSON = notesToGeoJSON(notes);
      downloadFile(geoJSON, 'fieldvision-notes.geojson');
      
      toast({
        title: "Export successful",
        description: "Map notes exported as GeoJSON",
      });
    } catch (error) {
      console.error('Error exporting GeoJSON:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your notes",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleExportKMZ = async () => {
    if (notes.length === 0) {
      toast({
        title: "No notes to export",
        description: "Add some map notes first",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsExporting(true);
      const kmzBlob = await notesToKMZ(notes);
      downloadFile(kmzBlob, 'fieldvision-notes.kmz');
      
      toast({
        title: "Export successful",
        description: "Map notes exported as KMZ file",
      });
    } catch (error) {
      console.error('Error exporting KMZ:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your notes",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm">Task Notes</CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Please mark completed sections on the drawing and note any issues encountered.
            </p>
            <Textarea 
              className="w-full border border-border rounded-md p-2 h-32 text-sm"
              placeholder="Add your notes here..."
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
            />
            <Button 
              variant="orange" 
              size="sm" 
              className="w-full"
              onClick={handleSaveNotes}
            >
              Save Notes
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {notes.length > 0 && (
        <Card>
          <CardHeader className="py-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Map Notes</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 px-2"
                  disabled={isExporting}
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  <span>Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportGeoJSON}>
                  <FileType className="h-4 w-4 mr-2" />
                  Export as GeoJSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportKMZ}>
                  <FileType className="h-4 w-4 mr-2" />
                  Export as KMZ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="py-2">
            <div className="space-y-2">
              {notes.map((note) => (
                <div key={note.id} className="flex items-start gap-2 p-2 border rounded-md bg-muted/30">
                  <MapPin className="h-4 w-4 text-fieldvision-orange shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm whitespace-pre-wrap break-words">{note.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTimestamp(note.timestamp)}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              ))}
              <p className="text-xs text-muted-foreground italic">
                Place pins on the map to add location-specific notes
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
