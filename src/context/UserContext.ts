import { createContext } from "react";
import { type recentData } from "../components/Recents";


export type ContextType = {
    toggle: boolean;
    setToggle: React.Dispatch<React.SetStateAction<boolean>>;

    searchBtn: boolean;
    setSearchBtn: React.Dispatch<React.SetStateAction<boolean>>;

    folderToggle: boolean;
    setFolderToggle: React.Dispatch<React.SetStateAction<boolean>>;

    selectedFolderId: string | null;
    setSelectedFolderId: React.Dispatch<React.SetStateAction<string | null>>;

    recentNotes: recentData[];
    setRecentNotes: React.Dispatch<React.SetStateAction<recentData[]>>;
};


export const UserContext = createContext<ContextType>({
    toggle: false,
    setToggle: () => {},

    searchBtn: false,
    setSearchBtn: () => {},

    folderToggle: false,
    setFolderToggle: () => {},

    selectedFolderId: null,
    setSelectedFolderId: () => {},

    recentNotes: [],
    setRecentNotes: () => {},
}); 