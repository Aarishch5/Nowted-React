import React, { useContext, useState } from "react";
import Sidebar from "./components/Sidebar";
import Middle from "./components/Middle";
import Right from "./components/Right";
import type { recentData } from "./components/Recents";
import Restore from "./components/Restore";
import { UserContext } from "./context/UserContext";


const App: React.FC = () => {

  const [toggle, setToggle] = useState<boolean>(false);
  const [searchBtn, setSearchBtn] = useState<boolean>(true);

  const [folderToggle, setFolderToggle] = useState<boolean>(false);
  const [addNote, setAddNote] = useState<boolean>(false);
  const [currFolderName, setCurrentFolderName] = useState<string | null>(null);
  const [currSelectedNotesId, setCurrSelectedNotesId] = useState<string | null>(null);
  const [selectedRecentNotesId, setSelectedRecentNotesId] = useState<string | null>(null);

  const [refreshNotes, setRefreshNotes] = useState<number>(0);

  const [currentFolderData, setCurrentFolderData] = useState<recentData[]>([]);

  const [showRestore, setShowRestore] = useState(false);
  const [restoreNote, setRestoreNote] = useState<recentData | null>(null);

  // const {mode} = useContext(UserContext);

  return (
    <div onClick={() => {
      if (toggle) setToggle(false);
      if (!searchBtn) setSearchBtn(true);
      if(folderToggle) setFolderToggle(false)
    }} className="flex flex-row bg-[#121212] text-(--primary-font)">


      <Sidebar searchBtn={searchBtn} setSearchBtn={setSearchBtn} folderToggle={folderToggle} setFolderToggle={setFolderToggle} addNote={addNote} setAddNote={setAddNote} currFolderName={currFolderName} setCurrentFolderName={setCurrentFolderName} currSelectedNotesId={currSelectedNotesId} selectedRecentNotesId={selectedRecentNotesId}  setSelectedRecentNotesId={setSelectedRecentNotesId}/>

      <Middle addNote={addNote} currFolderName={currFolderName} currSelectedNotesId={currSelectedNotesId} refreshNotes={refreshNotes} currentFolderData={currentFolderData} setCurrentFolderData={setCurrentFolderData} setShowRestore={setShowRestore} setRestoreNote={setRestoreNote} />

      {showRestore ? (
            <Restore note={restoreNote} setShowRestore={setShowRestore} setRefreshNotes={setRefreshNotes} />
              ) : (
              <Right toggle={toggle} setToggle={setToggle} addNote={addNote} setAddNote={setAddNote} currFolderName={currFolderName} currSelectedNotesId={currSelectedNotesId} 
                  setCurrSelectedNotesId={setCurrSelectedNotesId} 
                  selectedRecentNotesId={selectedRecentNotesId} 
                  setRefreshNotes={setRefreshNotes} 
                  setCurrentFolderData={setCurrentFolderData} 
                />
            )}

    </div>
  );
};

export default App;

