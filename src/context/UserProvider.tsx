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
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

    const [currentFolderData, setCurrentFolderData] = useState<recentData[]>([]);
    const [recentFolderId, setRecentFolderId] = useState<string | null>(null);
    const [currSelectedFolderId, setCurrSelectedFolderId] = useState<string | null>(null);
    const [selectedRecentNotesId, setSelectedRecentNotesId] = useState<string | null>(null);
    const [currSelectedNotesId, setCurrSelectedNotesId] = useState<string | null>(null);

    const [onChangeInput, setOnChangeInput] = useState<string | null>(null);
    const [folderInput, setFolderInput] = useState<string | null>(null);



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
            onChangeInput,
            setOnChangeInput,
            folderInput,
            setFolderInput
            }}>{children}
        </UserContext.Provider>
    );
};

export default UserProvider;