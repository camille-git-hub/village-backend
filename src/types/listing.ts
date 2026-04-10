
export type Listing = {
  _id: string;
  title: string;
  category: string;
  description: string;
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
  ownerId: string;
  createdAt?: string;
  updatedAt?: string;
};