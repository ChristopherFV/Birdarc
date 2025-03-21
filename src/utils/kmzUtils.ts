
import JSZip from 'jszip';
import { DOMParser } from 'xmldom';

export interface KmzFeature {
  id: string;
  name: string;
  description?: string;
  coordinates: Array<[number, number]>; // [longitude, latitude] pairs
  properties: Record<string, any>;
  type: 'point' | 'line' | 'polygon';
  completed: boolean;
  visibleTo?: {
    type: 'all' | 'team' | 'specific';
    teamId?: string;
    userId?: string;
  };
}

/**
 * Parses a KMZ file and extracts geographic features
 */
export const parseKmzFile = async (file: File): Promise<KmzFeature[]> => {
  try {
    // Read the KMZ file (which is a ZIP file containing KML)
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(file);
    
    // Find the KML file in the zip (usually doc.kml)
    let kmlContent = '';
    let kmlFile = zipContent.file(/.*\.kml$/i)[0] || zipContent.file('doc.kml');
    
    if (kmlFile) {
      kmlContent = await kmlFile.async('text');
    } else {
      throw new Error('No KML file found in the KMZ archive');
    }
    
    // Parse the KML content
    return parseKmlContent(kmlContent);
  } catch (error) {
    console.error('Failed to parse KMZ file:', error);
    throw new Error(`Failed to parse KMZ file: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Parses KML content and extracts features
 */
const parseKmlContent = (kmlContent: string): KmzFeature[] => {
  const features: KmzFeature[] = [];
  const parser = new DOMParser();
  const kmlDoc = parser.parseFromString(kmlContent, 'text/xml');
  
  // Process Placemarks (points, lines, polygons)
  const placemarks = kmlDoc.getElementsByTagName('Placemark');
  
  for (let i = 0; i < placemarks.length; i++) {
    const placemark = placemarks[i];
    const name = getElementValue(placemark, 'name') || `Feature ${i + 1}`;
    const description = getElementValue(placemark, 'description');
    const properties: Record<string, any> = {};
    
    // Extract extended data if available
    const extendedData = placemark.getElementsByTagName('ExtendedData')[0];
    if (extendedData) {
      const dataElements = extendedData.getElementsByTagName('Data');
      for (let j = 0; j < dataElements.length; j++) {
        const data = dataElements[j];
        const dataName = data.getAttribute('name');
        const dataValue = getElementValue(data, 'value');
        if (dataName && dataValue) {
          properties[dataName] = dataValue;
        }
      }
    }
    
    // Process geometry
    let coordinates: Array<[number, number]> = [];
    let featureType: 'point' | 'line' | 'polygon' = 'point';
    
    // Point
    const point = placemark.getElementsByTagName('Point')[0];
    if (point) {
      const coordStr = getElementValue(point, 'coordinates');
      if (coordStr) {
        const parts = coordStr.trim().split(',');
        if (parts.length >= 2) {
          coordinates = [[parseFloat(parts[0]), parseFloat(parts[1])]];
        }
      }
      featureType = 'point';
    }
    
    // LineString
    const lineString = placemark.getElementsByTagName('LineString')[0];
    if (lineString) {
      coordinates = parseCoordinatesString(getElementValue(lineString, 'coordinates'));
      featureType = 'line';
    }
    
    // Polygon
    const polygon = placemark.getElementsByTagName('Polygon')[0];
    if (polygon) {
      const outerBoundary = polygon.getElementsByTagName('outerBoundaryIs')[0];
      if (outerBoundary) {
        const linearRing = outerBoundary.getElementsByTagName('LinearRing')[0];
        if (linearRing) {
          coordinates = parseCoordinatesString(getElementValue(linearRing, 'coordinates'));
        }
      }
      featureType = 'polygon';
    }
    
    // Skip features without valid coordinates
    if (coordinates.length === 0) continue;
    
    features.push({
      id: `kmz-feature-${i}-${Date.now()}`,
      name,
      description,
      coordinates,
      properties,
      type: featureType,
      completed: false
    });
  }
  
  return features;
};

/**
 * Helper to parse coordinate strings from KML
 */
const parseCoordinatesString = (coordsStr?: string): Array<[number, number]> => {
  if (!coordsStr) return [];
  
  const result: Array<[number, number]> = [];
  
  coordsStr
    .trim()
    .split(/\s+/)
    .forEach(coordPair => {
      const parts = coordPair.split(',');
      if (parts.length >= 2) {
        result.push([parseFloat(parts[0]), parseFloat(parts[1])]);
      }
    });
  
  return result;
};

/**
 * Helper to get element text content
 */
const getElementValue = (parent: Element, tagName: string): string | undefined => {
  const element = parent.getElementsByTagName(tagName)[0];
  if (element && element.textContent) {
    return element.textContent;
  }
  return undefined;
};
