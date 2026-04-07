import React, { createContext } from "react";
import { type recentData } from "../components/Recents";
import type { folderDataType } from "../components/Folders";


export type ContextType = {

    recentNotes: recentData[];
    setRecentNotes: React.Dispatch<React.SetStateAction<recentData[]>>;

    currSelectedFolderId: string | null;
    setCurrSelectedFolderId: React.Dispatch<React.SetStateAction<string | null>>;

    activeView: "folder" | "favorites" | "archived" | "trash";
    setActiveView: React.Dispatch<React.SetStateAction<"folder" | "favorites" | "archived" | "trash">>;

    mode: boolean;
    setMode: React.Dispatch<React.SetStateAction<boolean>>;

    folderData: folderDataType[];
    setFolderData: React.Dispatch<React.SetStateAction<folderDataType[]>>;
};


export const UserContext = createContext<ContextType>({

    recentNotes: [],
    setRecentNotes: () => {},

    currSelectedFolderId: null,
    setCurrSelectedFolderId: () => {},

    activeView: "folder",
    setActiveView: () => {},

    mode: true,
    setMode: () => {},

    folderData: [],
    setFolderData: () => {},
}); 