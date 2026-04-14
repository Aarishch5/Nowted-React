import React, { useContext, useEffect, useState } from "react"
import { Routes, Route, Navigate } from "react-router-dom";
import type { recentData } from "./components/Recents"
import { UserContext } from "./context/UserContext";
import ScreenLayout from "./ScreenLayout";

const App: React.FC = () => {
  const [toggle, setToggle] = useState<boolean>(false);
  const [searchBtn, setSearchBtn] = useState<boolean>(true);

  const [folderToggle, setFolderToggle] = useState<boolean>(false);

  const [addNote, setAddNote] = useState<boolean>(false);

  const [currFolderName, setCurrentFolderName] = useState<string | null>(null);

  const [refreshNotes, setRefreshNotes] = useState<number>(0);

  const [currentFolderData, setCurrentFolderData] = useState<recentData[]>([]);
  const [showRestore, setShowRestore] = useState(false);

  const [restoreNote, setRestoreNote] = useState<recentData | null>(null);

  const { mode, setMode } = useContext(UserContext);

  const [noteSearchInput, setNoteSearchInput] = useState("");

  const [searchedNotes, setSearchedNotes] = useState<recentData[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);



   useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setMode(true);
    } else {
      setMode(false);
    }
  }, [setMode]);

  
  useEffect(() => {
    const theme = mode ? "dark" : "light";

    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);

    localStorage.setItem("theme", theme);
  }, [mode]);

  
  const commonProps = { searchBtn, setSearchBtn, folderToggle, setFolderToggle, addNote, setAddNote, currFolderName, setCurrentFolderName,
    refreshNotes, setRefreshNotes, currentFolderData, setCurrentFolderData, showRestore, setShowRestore, restoreNote,
    setRestoreNote, toggle, setToggle, noteSearchInput, setNoteSearchInput, searchedNotes, setSearchedNotes, showSearchDropdown,setShowSearchDropdown };


  return (
    <div onClick={() => {
        if (toggle) setToggle(false);
        if (!searchBtn) setSearchBtn(true);
        if (folderToggle) setFolderToggle(false);
        if(addNote) setAddNote(false);
      }}  className={`flex flex-row bg-(--background)`}>
      <Routes>
        <Route path="/" element={<Navigate to="/folder/default" replace />} /> 

        <Route path="/folder/:folderId" element={<ScreenLayout {...commonProps}/>} />
        <Route path="/folder/:folderId/note/:noteId" element={<ScreenLayout {...commonProps}/>} />

        <Route path="/favorites" element={<ScreenLayout {...commonProps}/>} />
        <Route path="/favorites/note/:noteId" element={<ScreenLayout {...commonProps}/>} />

        <Route path="/archived" element={<ScreenLayout {...commonProps}/>} />
        <Route path="/archived/note/:noteId" element={<ScreenLayout {...commonProps}/>} />

          <Route path="/trash" element={<ScreenLayout {...commonProps} isTrashPage={true} />} />
      </Routes>
    </div>
  );
};

export default App;
