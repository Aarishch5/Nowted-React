import React, { useState } from "react";
import { UserContext } from "./UserContext";
import { type recentData } from "../components/Recents";

type Props = {
    children: React.ReactNode;
};

export const UserProvider: React.FC<Props> = ({ children }) => {

    const [folderDataName, setFolderDataName] = useState<string | null>(null);

    const [recentNotes, setRecentNotes] = useState<recentData[]>([]);
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

    const [currSelectedFolderId, setCurrSelectedFolderId] = useState<string | null>(null);

    const [activeView, setActiveView] = useState<"folder" | "favorites" | "archived" | "trash">("folder");

    const [mode, setMode] = useState<boolean>(true);

   


    return (
        <UserContext.Provider value={{ 
            folderDataName,
            setFolderDataName,
            recentNotes,
            setRecentNotes,
            selectedNoteId,
            setSelectedNoteId,
            currSelectedFolderId,
            setCurrSelectedFolderId,
            activeView,
            setActiveView,
            mode, setMode,
            }}>{children}
        </UserContext.Provider>
    );
};

export default UserProvider;