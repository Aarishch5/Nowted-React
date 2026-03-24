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

    selectedNoteId: string | null;
    setSelectedNoteId: React.Dispatch<React.SetStateAction<string | null>>;

    currentFolderData: recentData[];
    setCurrentFolderData: React.Dispatch<React.SetStateAction<recentData[]>>;

    recentFolderId: string | null;
    setRecentFolderId: React.Dispatch<React.SetStateAction<string | null>>;

    currSelectedFolderId: string | null;
    setCurrSelectedFolderId: React.Dispatch<React.SetStateAction<string | null>>;

    selectedRecentNotesId: string | null;
    setSelectedRecentNotesId: React.Dispatch<React.SetStateAction<string | null>>;

    currSelectedNotesId: string | null;
    setCurrSelectedNotesId : React.Dispatch<React.SetStateAction<string | null>>

    onChangeInput: string | null;
    setOnChangeInput : React.Dispatch<React.SetStateAction<string | null>>

    folderInput: string | null;
    setFolderInput : React.Dispatch<React.SetStateAction<string | null>>
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

    selectedNoteId: null,
    setSelectedNoteId: () => {},

    currentFolderData: [],
    setCurrentFolderData: () => {},

    recentFolderId: null,
    setRecentFolderId : () => {},

    currSelectedFolderId: null,
    setCurrSelectedFolderId: () => {},

    selectedRecentNotesId: null,
    setSelectedRecentNotesId: () => {},

    currSelectedNotesId: null,
    setCurrSelectedNotesId: () => {},

    onChangeInput: null,
    setOnChangeInput: () => {},

    folderInput: null,
    setFolderInput: () => {},
}); 