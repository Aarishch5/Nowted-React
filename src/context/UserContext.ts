import React, { createContext } from "react";
import type { folderDataType } from "../types/types"


export type ContextType = {

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

    currSelectedFolderId: null,
    setCurrSelectedFolderId: () => {},

    activeView: "folder",
    setActiveView: () => {},

    mode: true,
    setMode: () => {},

    folderData: [],
    setFolderData: () => {},
}); 