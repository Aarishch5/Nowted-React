import React, { useState } from "react";
import { UserContext } from "./UserContext";
import { type recentData } from "../components/Recents";
// import { type folderDataType } from "../components/Folders";
import type { postNotesDataType } from "../components/Right";

type Props = {
    children: React.ReactNode;
};

export const UserProvider: React.FC<Props> = ({ children }) => {

    // const [folderData, setFolderData] = useState<folderDataType[]>([]);
    // const [folderDataName, setFolderDataName] = useState<string | null>(null);

    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

    const [recentNotes, setRecentNotes] = useState<recentData[]>([]);
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

    const [currentFolderData, setCurrentFolderData] = useState<recentData[]>([]);
    const [recentFolderId, setRecentFolderId] = useState<string | null>(null);
    const [currSelectedFolderId, setCurrSelectedFolderId] = useState<string | null>(null);
    const [selectedRecentNotesId, setSelectedRecentNotesId] = useState<string | null>(null);
    const [currSelectedNotesId, setCurrSelectedNotesId] = useState<string | null>(null);

    const [currFolderName, setCurrentFolderName] = useState<string | null>(null);

    const [postFolderData, setPostFolderData] = useState<postNotesDataType>({title: "", content: ""}); 

    const [refreshNotes, setRefreshNotes] = useState(0);

    const [activeView, setActiveView] = useState<"folder" | "favorites" | "archived" | "trash">("folder");


   const updateRecentNotes = (note: recentData) => {
    if (note.deletedAt) return;

        setRecentNotes((prev) => {
            const filtered = prev.filter((n) => n.id !== note.id);
            const updated = [note, ...filtered];
            return updated.slice(0, 3);
            });
        };


    return (
        <UserContext.Provider value={{ 
            // folderData,
            // setFolderData,
            // folderDataName,
            // setFolderDataName,
            selectedFolderId,
            setSelectedFolderId,
            recentNotes,
            setRecentNotes,
            selectedNoteId,
            setSelectedNoteId,
            currentFolderData,
            setCurrentFolderData,
            recentFolderId,
            setRecentFolderId,
            currSelectedFolderId,
            setCurrSelectedFolderId,
            selectedRecentNotesId,
            setSelectedRecentNotesId,
            currSelectedNotesId,
            setCurrSelectedNotesId,
            currFolderName,
            setCurrentFolderName,
            postFolderData,
            setPostFolderData,
            refreshNotes,
            setRefreshNotes,
            activeView,
            setActiveView,
            updateRecentNotes,
            }}>{children}
        </UserContext.Provider>
    );
};

export default UserProvider;