import React, { useState } from "react";
import { UserContext } from "./UserContext";
import { type recentData } from "../components/Recents";
import type { folderDataType } from "../components/Folders";

type Props = {
    children: React.ReactNode;
};

export const UserProvider: React.FC<Props> = ({ children }) => {

    const [recentNotes, setRecentNotes] = useState<recentData[]>([]);
    const [currSelectedFolderId, setCurrSelectedFolderId] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<"folder" | "favorites" | "archived" | "trash">("folder");
    const [mode, setMode] = useState<boolean>(true);
    const [folderData, setFolderData] = useState<folderDataType[]>([]);

    return (
        <UserContext.Provider value={{ 
            recentNotes,
            setRecentNotes,
            currSelectedFolderId,
            setCurrSelectedFolderId,
            activeView,
            setActiveView,
            mode,
             setMode,
             folderData, setFolderData
            }}>{children}
        </UserContext.Provider>
    );
};

export default UserProvider;