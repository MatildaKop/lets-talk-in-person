export interface User {
  id: string;
  name?: string;
  email?: string;
  bio?: string;
  interests?: string[];
  location?: {
    lat: number;
    lng: number;
  };
}
