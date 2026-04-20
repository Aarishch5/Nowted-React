export type folderDataType = {
  id: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};


export type folderProps = {
  folderToggle: boolean;
  setFolderToggle: React.Dispatch<React.SetStateAction<boolean>>;
  addNote: boolean;
  setAddNote: React.Dispatch<React.SetStateAction<boolean>>;
  currFolderName: string | null;
  setCurrentFolderName: React.Dispatch<React.SetStateAction<string | null>>;
};

export type noteDataSet = {
  id: string;
  folderId: string;
  title: string;
  content: string;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  preview: string;
  folder: folderDataType;
};


export type recentsProps = {
  refreshRecents: number;
}

export type recentData = {
  id: string;
  folderId: string;
  title: string;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  preview: string;
  folder: folderDataType;
};

export type middleProps = {
  addNote: boolean;
  currFolderName: string | null;
  refreshNotes: number;
  currentFolderData: recentData[];
  setCurrentFolderData: React.Dispatch<React.SetStateAction<recentData[]>>;
  setShowRestore: React.Dispatch<React.SetStateAction<boolean>>;
  setRestoreNote: React.Dispatch<React.SetStateAction<recentData | null>>;
};