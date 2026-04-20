import React, { useState } from "react";
import { UserContext } from "./UserContext";
import type { folderDataType } from "../types/types"

type Props = {
    children: React.ReactNode;
};

export const UserProvider: React.FC<Props> = ({ children }) => {

    const [currSelectedFolderId, setCurrSelectedFolderId] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<"folder" | "favorites" | "archived" | "trash">("folder");
    const [mode, setMode] = useState<boolean>(true);
    const [folderData, setFolderData] = useState<folderDataType[]>([]);

    return (
        <UserContext.Provider value={{ 
            currSelectedFolderId,
            setCurrSelectedFolderId,
            activeView,
            setActiveView,
            mode,
            setMode,
            folderData,
             setFolderData
            }}>{children}
        </UserContext.Provider>
    );
};

export default UserProvider;