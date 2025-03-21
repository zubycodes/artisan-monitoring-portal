export interface MapConfig {
  lat: number;
  lng: number;
  zoom: number;
  geoJson?: any;
  markers?: Marker[];
}

export interface Marker {
  lat: number;
  lng: number;
  label?: string;
  info?: string;
}


export const districtsLatLong = [
  { code: "037001", name: "Attock", latitude: 33.7748, longitude: 72.3648 },
  { code: "031001", name: "Bahawalnagar", latitude: 29.8915, longitude: 73.1851 },
  { code: "031002", name: "Bahawalpur", latitude: 29.4117, longitude: 71.6938 },
  { code: "038001", name: "Bhakkar", latitude: 31.6231, longitude: 71.0619 },
  { code: "037004", name: "Chakwal", latitude: 32.9311, longitude: 72.8614 },
  { code: "033004", name: "Chiniot", latitude: 31.6924, longitude: 73.0133 },
  { code: "032001", name: "Dera Ghazi Khan", latitude: 30.0491, longitude: 70.6389 },
  { code: "033001", name: "Faisalabad", latitude: 31.4251, longitude: 73.0893 },
  { code: "034001", name: "Gujranwala", latitude: 32.1481, longitude: 74.183 },
  { code: "034002", name: "Gujrat", latitude: 32.5776, longitude: 74.0837 },
  { code: "034005", name: "Hafizabad", latitude: 32.0697, longitude: 73.6827 },
  { code: "033002", name: "Jhang", latitude: 31.2663, longitude: 72.3235 },
  { code: "037002", name: "Jhelum", latitude: 32.9381, longitude: 73.7303 },
  { code: "035001", name: "Kasur", latitude: 31.1228, longitude: 74.4529 },
  { code: "036004", name: "Khanewal", latitude: 30.3041, longitude: 71.9281 },
  { code: "038002", name: "Khushab", latitude: 32.2796, longitude: 72.2808 },
  { code: "035002", name: "Lahore", latitude: 31.5776, longitude: 74.2998 },
  { code: "032002", name: "Layyah", latitude: 30.975, longitude: 70.9427 },
  { code: "036006", name: "Lodhran", latitude: 29.5319, longitude: 71.6286 },
  { code: "034006", name: "Mandi Bahuddin", latitude: 32.5977, longitude: 73.4763 },
  { code: "038003", name: "Mianwali", latitude: 32.5782, longitude: 71.545 },
  { code: "036001", name: "Multan", latitude: 30.1756, longitude: 71.4708 },
  { code: "032003", name: "Muzaffargarh", latitude: 29.9897, longitude: 71.0964 },
  { code: "035006", name: "Nankana Sahib", latitude: 31.3502, longitude: 73.7329 },
  { code: "034004", name: "Narowal", latitude: 32.0998, longitude: 74.8737 },
  { code: "039003", name: "Okara", latitude: 30.8079, longitude: 73.4488 },
  { code: "039008", name: "Pakpattan", latitude: 30.3869, longitude: 73.3617 },
  { code: "031003", name: "Rahim Yar Khan", latitude: 28.4193, longitude: 70.3139 },
  { code: "032004", name: "Rajanpur", latitude: 29.1406, longitude: 70.3171 },
  { code: "037003", name: "Rawalpindi", latitude: 33.5894, longitude: 73.0664 },
  { code: "039007", name: "Sahiwal", latitude: 30.6562, longitude: 73.0872 },
  { code: "038004", name: "Sargodha", latitude: 32.0676, longitude: 72.6796 },
  { code: "035004", name: "Sheikhupura", latitude: 31.7086, longitude: 73.9809 },
  { code: "034003", name: "Sialkot", latitude: 32.4996, longitude: 74.5346 },
  { code: "033003", name: "T.T Singh", latitude: 30.9867, longitude: 72.4814 },
  { code: "036003", name: "Vehari", latitude: 30.0457, longitude: 72.3499 },
];