export interface ProjectFile {
  fileId: number;
  originalName: string;
  uploader: {
    id: number;
    firstName: string;
    lastName: string;
  }
}
