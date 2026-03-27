import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { type recentData } from "./Recents";
import axios from "axios";

type middleProps = {
  addNote: boolean;
}

const Middle: React.FC<middleProps> = ({addNote}) => {
  const { 
    currSelectedFolderId, 
    setCurrentFolderData, 
    currentFolderData, 
    selectedNoteId, 
    currSelectedNotesId, 
    setSelectedNoteId, 
    refreshNotes, 
    activeView, 
    currFolderName,
    updateRecentNotes
  } = useContext(UserContext);

  useEffect(() => {
    const fetchNotes = async () => {
      let url = "";

      if (activeView === "favorites") {
        url = `https://nowted-server.remotestate.com/notes?isFavourite=true&limit=300`;
      } else if (activeView === "archived") {
        url = `https://nowted-server.remotestate.com/notes?isArchived=true&limit=300`;
      } else if (activeView === "trash") {
        url = `https://nowted-server.remotestate.com/notes?deleted=true&limit=300`;
      } else if (currSelectedFolderId) {
        url = `https://nowted-server.remotestate.com/notes?folderId=${currSelectedFolderId}&limit=300`;
      }

      if (!url) {
        setCurrentFolderData([]);
        return;
      }

      try {
        const response = await axios.get(url);
        const notes: recentData[] = response.data.notes || [];
        setCurrentFolderData(notes);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setCurrentFolderData([]);
      }
    };

    fetchNotes();
  }, [currSelectedFolderId, activeView, refreshNotes]);

  return (
    <div className="flex w-87.5 h-screen flex-col px-5 pb-7.5 bg-[#1C1C1C] gap-7.5 overflow-y-auto no-scrollbar scroll-smooth">
      <div className="px-5 pb-5 pt-7.5 bg-[#1C1C1C] sticky top-0 z-10">
        <h2 className="text-[22px] font-semibold text-white">
          {activeView === "favorites" ? "Favourites" 
          : activeView === "archived" ? "Archived" 
          : activeView === "trash" ? "Trash"
          : currSelectedFolderId && currentFolderData.length > 0
          ? currentFolderData[0].folder?.name || "Folder"
          : currFolderName }
        </h2>
      </div>

      <div className="flex flex-col gap-5">
        {currentFolderData.map((note) => (
          <div
            key={note.id}
            onClick={() => {
              setSelectedNoteId(note.id);
              updateRecentNotes(note); // ✅ IMPORTANT
            }}
            className={`flex ${
              (note.id === selectedNoteId || note.id === currSelectedNotesId) && !addNote 
                ? "bg-[#FFFFFF1A]" 
                : "bg-[#FFFFFF08]"
            } cursor-pointer p-5 min-h-24.5 max-h-24.5 flex-col hover:bg-[#FFFFFF1A] overflow-hidden`}
          >
            <h3 className="text-lg font-semibold text-white">{note.title}</h3>
            <div className="flex gap-2.5 text-base font-semibold text-[#FFFFFF66] max-h-5">
              <h3>{new Date(note.createdAt).toLocaleDateString("en-GB")}</h3>
              <h3>{note.preview?.slice(0, 20)}...</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Middle;