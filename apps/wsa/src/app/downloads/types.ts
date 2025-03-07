export interface Download {
  id: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DownloadCategory {
  id: string;
  name: string;
  description: string;
  downloads: Download[];
}
