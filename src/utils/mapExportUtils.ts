
import JSZip from 'jszip';
import { MapNote } from '@/components/technician/TechnicianLocationMap';

/**
 * Converts map notes to GeoJSON format
 */
export const notesToGeoJSON = (notes: MapNote[]) => {
  const features = notes.map(note => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [note.lng, note.lat]
    },
    properties: {
      id: note.id,
      text: note.text,
      timestamp: note.timestamp.toISOString()
    }
  }));

  const geoJSON = {
    type: 'FeatureCollection',
    features
  };

  return JSON.stringify(geoJSON, null, 2);
};

/**
 * Creates KML content from map notes
 */
const notesToKML = (notes: MapNote[]) => {
  let placemarksContent = '';
  
  notes.forEach(note => {
    const timestamp = new Date(note.timestamp).toISOString();
    const placemarkContent = `
    <Placemark>
      <name>Note ${note.id}</name>
      <description><![CDATA[${note.text}]]></description>
      <TimeStamp>
        <when>${timestamp}</when>
      </TimeStamp>
      <Point>
        <coordinates>${note.lng},${note.lat},0</coordinates>
      </Point>
    </Placemark>`;
    
    placemarksContent += placemarkContent;
  });
  
  const kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>FieldVision Notes</name>
    <description>Map notes exported from FieldVision</description>
    ${placemarksContent}
  </Document>
</kml>`;
  
  return kmlContent;
};

/**
 * Converts map notes to KMZ format (zipped KML)
 */
export const notesToKMZ = async (notes: MapNote[]): Promise<Blob> => {
  const kmlContent = notesToKML(notes);
  const zip = new JSZip();
  
  // Add the KML file to the zip
  zip.file('doc.kml', kmlContent);
  
  // Generate the zip file as a blob
  return await zip.generateAsync({ type: 'blob' });
};

/**
 * Downloads data as a file
 */
export const downloadFile = (data: string | Blob, filename: string) => {
  let blob: Blob;
  
  if (typeof data === 'string') {
    blob = new Blob([data], { type: 'application/json' });
  } else {
    blob = data;
  }
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
