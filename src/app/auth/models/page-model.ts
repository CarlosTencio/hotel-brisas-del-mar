import { Image } from './image-model';

export interface Page {
  pageID: number;
  pageTitle: string;
  pageContent: string;
  images: Image[];
}
