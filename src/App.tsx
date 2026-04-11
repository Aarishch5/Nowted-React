import React, { useContext, useEffect, useState } from "react"
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Middle from "./components/Middle"

import Right from "./components/Right";
import Restore from "./components/Restore";
import type { recentData } from "./components/Recents"
import { UserContext } from "./context/UserContext";

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

  

  const renderScreen = (rightSide?: React.ReactNode) => (
    <>
      <Sidebar searchBtn={searchBtn} setSearchBtn={setSearchBtn} folderToggle={folderToggle} setFolderToggle={setFolderToggle}
        addNote={addNote} setAddNote={setAddNote} currFolderName={currFolderName} setCurrentFolderName={setCurrentFolderName} setNoteSearchInput={setNoteSearchInput} />

      <Middle addNote={addNote} currFolderName={currFolderName} refreshNotes={refreshNotes} currentFolderData={currentFolderData}
        setCurrentFolderData={setCurrentFolderData} setShowRestore={setShowRestore} setRestoreNote={setRestoreNote} noteSearchInput={noteSearchInput}/>

      {rightSide ?? (
        <Right toggle={toggle} setToggle={setToggle} addNote={addNote} setAddNote={setAddNote} currFolderName={currFolderName}
          setRefreshNotes={setRefreshNotes} setCurrentFolderData={setCurrentFolderData} setShowRestore={setShowRestore}/>)}
    </>
  );

  return (
    <div onClick={() => {
        if (toggle) setToggle(false);
        if (!searchBtn) setSearchBtn(true);
        if (folderToggle) setFolderToggle(false);
        if(addNote) setAddNote(false);
      }}  className={`flex flex-row bg-(--background)`}>
      <Routes>
        <Route path="/" element={<Navigate to="/folder/default" replace />} /> 

        <Route path="/folder/:folderId" element={renderScreen()} />
        <Route path="/folder/:folderId/note/:noteId" element={renderScreen()} />

        <Route path="/favorites" element={renderScreen()} />
        <Route path="/favorites/note/:noteId" element={renderScreen()} />

        <Route path="/archived" element={renderScreen()} />
        <Route path="/archived/note/:noteId" element={renderScreen()} />

        <Route path="/trash" element={renderScreen(showRestore ? (
              <Restore note={restoreNote} setShowRestore={setShowRestore} setRefreshNotes={setRefreshNotes} />
            ) : (
              <Right toggle={toggle} setToggle={setToggle} addNote={addNote} setAddNote={setAddNote} currFolderName={currFolderName}
               setRefreshNotes={setRefreshNotes} setCurrentFolderData={setCurrentFolderData} setShowRestore={setShowRestore}/>
            )
          )}/>
      </Routes>
    </div>
  );
};

export default App;
