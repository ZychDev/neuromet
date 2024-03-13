export interface SeminarArchive {
    id: number;
    year: number;
    title: string;
    location: string;
    date: Date;
    presentations: Presentation[];
}
  
export interface Presentation {
    id: number;
    title: string;
    authors: string;
    affiliation: string;
}