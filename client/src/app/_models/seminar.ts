export interface SeminarArchive {
    id: number;
    year: number;
    title: string;
    location: string;
    presentations: Presentation[];
}
  
export interface Presentation {
    id: number;
    title: string;
    authors: string;
    affiliation: string;
}