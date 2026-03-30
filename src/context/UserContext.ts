import React, { createContext } from "react";
import { type recentData } from "../components/Recents";
// import { type postNotesDataType } from "../components/Right";


export type ContextType = {

    folderDataName: string | null;
    setFolderDataName : React.Dispatch<React.SetStateAction<string | null>>;

    recentNotes: recentData[];
    setRecentNotes: React.Dispatch<React.SetStateAction<recentData[]>>;

    selectedNoteId: string | null;
    setSelectedNoteId: React.Dispatch<React.SetStateAction<string | null>>;

    currSelectedFolderId: string | null;
    setCurrSelectedFolderId: React.Dispatch<React.SetStateAction<string | null>>;

    activeView: "folder" | "favorites" | "archived" | "trash";
    setActiveView: React.Dispatch<React.SetStateAction<"folder" | "favorites" | "archived" | "trash">>;

    mode: boolean;
    setMode: React.Dispatch<React.SetStateAction<boolean>>;
};


export const UserContext = createContext<ContextType>({

    folderDataName: null,
    setFolderDataName: () => {},

    recentNotes: [],
    setRecentNotes: () => {},

    selectedNoteId: null,
    setSelectedNoteId: () => {},

    currSelectedFolderId: null,
    setCurrSelectedFolderId: () => {},

    activeView: "folder",
    setActiveView: () => {},

    mode: true,
    setMode: () => {},

}); 