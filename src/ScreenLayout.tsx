import React from "react";
import Sidebar from "./components/Sidebar";
import NoteList from "./components/NoteList";
import NoteDescription from "./components/NoteDescription";
import Restore from "./components/Restore";
import type { recentData } from "./types/types"


type ScreenLayoutProps = {
  searchBtn: boolean;
  setSearchBtn: React.Dispatch<React.SetStateAction<boolean>>;

  folderToggle: boolean;
  setFolderToggle: React.Dispatch<React.SetStateAction<boolean>>;
  addNote: boolean;
  setAddNote: React.Dispatch<React.SetStateAction<boolean>>;

  currFolderName: string | null;
  setCurrentFolderName: React.Dispatch<React.SetStateAction<string | null>>;

  refreshNotes: number;
  setRefreshNotes: React.Dispatch<React.SetStateAction<number>>;
  currentFolderData: recentData[];
  setCurrentFolderData: React.Dispatch<React.SetStateAction<recentData[]>>;
  showRestore: boolean;
  
  setShowRestore: React.Dispatch<React.SetStateAction<boolean>>;

  restoreNote: recentData | null;
  setRestoreNote: React.Dispatch<React.SetStateAction<recentData | null>>;
  toggle: boolean;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;

  noteSearchInput: string;
  setNoteSearchInput: React.Dispatch<React.SetStateAction<string>>;
  isTrashPage?: boolean;

  searchedNotes: recentData[];
    setSearchedNotes: React.Dispatch<React.SetStateAction<recentData[]>>;

    refreshRecents: number;
    setRefreshRecents: React.Dispatch<React.SetStateAction<number>>;


};

const ScreenLayout = React.memo( ({ searchBtn, setSearchBtn, folderToggle, setFolderToggle, addNote, setAddNote, currFolderName, setCurrentFolderName, refreshNotes,
  setRefreshNotes, currentFolderData, setCurrentFolderData, showRestore, setShowRestore, restoreNote, setRestoreNote,
  toggle, setToggle, setNoteSearchInput,searchedNotes,setSearchedNotes, refreshRecents, setRefreshRecents}: ScreenLayoutProps) => {
  return (
    <>
      <Sidebar searchBtn={searchBtn} setSearchBtn={setSearchBtn} folderToggle={folderToggle} setFolderToggle={setFolderToggle}
        addNote={addNote} setAddNote={setAddNote} currFolderName={currFolderName} setCurrentFolderName={setCurrentFolderName}
        setNoteSearchInput={setNoteSearchInput} searchedNotes={searchedNotes} setSearchedNotes={setSearchedNotes} refreshRecents={refreshRecents} />

      <NoteList addNote={addNote} currFolderName={currFolderName} refreshNotes={refreshNotes} currentFolderData={currentFolderData}
       setCurrentFolderData={setCurrentFolderData} setShowRestore={setShowRestore} setRestoreNote={setRestoreNote}
        />

      {showRestore ? (
        <Restore note={restoreNote} setShowRestore={setShowRestore} setRefreshNotes={setRefreshNotes}/>
      ) : (
        <NoteDescription key={addNote ? "new-note" : "editor"} toggle={toggle} setToggle={setToggle} addNote={addNote} setAddNote={setAddNote} currFolderName={currFolderName} 
        setRefreshNotes={setRefreshNotes} setCurrentFolderData={setCurrentFolderData} setShowRestore={setShowRestore} setRestoreNote={setRestoreNote} setRefreshRecents={setRefreshRecents}/>
      )}
    </>
  );
}
)

export default ScreenLayout;