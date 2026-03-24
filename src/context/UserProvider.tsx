import React, { useState } from "react";
import { UserContext } from "./UserContext";
import { type recentData } from "../components/Recents";

type Props = {
    children: React.ReactNode;
};


export const UserProvider: React.FC<Props> = ({ children }) => {
    const [toggle, setToggle] = useState<boolean>(false);
    const [searchBtn, setSearchBtn] = useState<boolean>(true);
    const [folderToggle, setFolderToggle] = useState<boolean>(false);
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [recentNotes, setRecentNotes] = useState<recentData[]>([]);


    return (
        <UserContext.Provider value={{ 
            toggle,
            setToggle,
            searchBtn,
            setSearchBtn,
            folderToggle,
            setFolderToggle,
            selectedFolderId,
            setSelectedFolderId,
            recentNotes,
            setRecentNotes}}>{children}
        </UserContext.Provider>
    );
};

export default UserProvider;