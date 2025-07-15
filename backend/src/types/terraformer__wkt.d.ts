declare module "@terraformer/wkt" {
  export function wktToGeoJSON(wkt: string): any;
  export function geoJSONToWKT(geojson: any): string;
}
