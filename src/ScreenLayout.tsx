import React from "react";
import Sidebar from "./components/Sidebar";
import Middle from "./components/Middle";
import Right from "./components/Right";
import Restore from "./components/Restore";
import type { recentData } from "./components/Recents";
import { useParams } from "react-router-dom";


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
};

const ScreenLayout = React.memo( ({ searchBtn, setSearchBtn, folderToggle, setFolderToggle, addNote, setAddNote, currFolderName, setCurrentFolderName, refreshNotes,
  setRefreshNotes, currentFolderData, setCurrentFolderData, showRestore, setShowRestore, restoreNote, setRestoreNote,
  toggle, setToggle, noteSearchInput, setNoteSearchInput, isTrashPage = false}: ScreenLayoutProps) => {
    const { noteId } = useParams();
  return (
    <>
      <Sidebar searchBtn={searchBtn} setSearchBtn={setSearchBtn} folderToggle={folderToggle} setFolderToggle={setFolderToggle}
        addNote={addNote} setAddNote={setAddNote} currFolderName={currFolderName} setCurrentFolderName={setCurrentFolderName}
        setNoteSearchInput={setNoteSearchInput}/>

      <Middle addNote={addNote} currFolderName={currFolderName} refreshNotes={refreshNotes} currentFolderData={currentFolderData}
       setCurrentFolderData={setCurrentFolderData} setShowRestore={setShowRestore} setRestoreNote={setRestoreNote}
        noteSearchInput={noteSearchInput}/>

      {isTrashPage && showRestore ? (
        <Restore note={restoreNote} setShowRestore={setShowRestore} setRefreshNotes={setRefreshNotes}/>
      ) : (
        <Right key={addNote ? "new-note" : noteId ?? "no-note"} toggle={toggle} setToggle={setToggle} addNote={addNote} setAddNote={setAddNote} currFolderName={currFolderName} 
        setRefreshNotes={setRefreshNotes} setCurrentFolderData={setCurrentFolderData} setShowRestore={setShowRestore} setRestoreNote={setRestoreNote}/>
      )}
    </>
  );
}
)

export default ScreenLayout;