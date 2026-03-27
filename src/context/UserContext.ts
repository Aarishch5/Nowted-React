import React, { createContext } from "react";
import { type recentData } from "../components/Recents";
// import { type folderDataType } from "../components/Folders";
import { type postNotesDataType } from "../components/Right";


export type ContextType = {

    // folderDataName: string | null;
    // setFolderDataName : React.Dispatch<React.SetStateAction<string | null>>;

    selectedFolderId: string | null;
    setSelectedFolderId: React.Dispatch<React.SetStateAction<string | null>>;

    recentNotes: recentData[];
    setRecentNotes: React.Dispatch<React.SetStateAction<recentData[]>>;

    selectedNoteId: string | null;
    setSelectedNoteId: React.Dispatch<React.SetStateAction<string | null>>;

    currentFolderData: recentData[];
    setCurrentFolderData: React.Dispatch<React.SetStateAction<recentData[]>>;

    // folderData: folderDataType[];
    // setFolderData: React.Dispatch<React.SetStateAction<folderDataType[]>>;

    recentFolderId: string | null;
    setRecentFolderId: React.Dispatch<React.SetStateAction<string | null>>;

    currSelectedFolderId: string | null;
    setCurrSelectedFolderId: React.Dispatch<React.SetStateAction<string | null>>;

    selectedRecentNotesId: string | null;
    setSelectedRecentNotesId: React.Dispatch<React.SetStateAction<string | null>>;

    currSelectedNotesId: string | null;
    setCurrSelectedNotesId : React.Dispatch<React.SetStateAction<string | null>>

    // folderInput: string | null;
    // setFolderInput : React.Dispatch<React.SetStateAction<string | null>>

    currFolderName : string | null,
    setCurrentFolderName: React.Dispatch<React.SetStateAction<string | null>>;

    postFolderData: postNotesDataType,
    setPostFolderData: React.Dispatch<React.SetStateAction<postNotesDataType>>

    refreshNotes: number,
    setRefreshNotes: React.Dispatch<React.SetStateAction<number>>

    activeView: "folder" | "favorites" | "archived" | "trash";
    setActiveView: React.Dispatch<React.SetStateAction<"folder" | "favorites" | "archived" | "trash">>;

    updateRecentNotes: (note: recentData) => void;
};


export const UserContext = createContext<ContextType>({


    // folderData: [],
    // setFolderData: () => {},

    // folderDataName: null,
    // setFolderDataName: () => {},

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

    // onChangeInput: null,
    // setOnChangeInput: () => {},

    // folderInput: null,
    // setFolderInput: () => {},

    currFolderName: null,
    setCurrentFolderName: () => {},

    postFolderData: {title: "", content: ""},
    setPostFolderData: () => {},

    refreshNotes: 0,
    setRefreshNotes: () => {},

    activeView: "folder",
    setActiveView: () => {},

    updateRecentNotes: () => {},


}); 