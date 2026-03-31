import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { type recentData } from "./Recents";
import axios from "axios";
import { useNavigate, useParams, useMatch } from "react-router-dom";

type middleProps = {
  addNote: boolean;
  currFolderName: string | null;
  refreshNotes: number;
  currentFolderData: recentData[];
  setCurrentFolderData: React.Dispatch<React.SetStateAction<recentData[]>>;
  setShowRestore: React.Dispatch<React.SetStateAction<boolean>>;
  setRestoreNote: React.Dispatch<React.SetStateAction<recentData | null>>;
};

const Middle: React.FC<middleProps> = ({addNote, currFolderName, refreshNotes, currentFolderData, setCurrentFolderData, setShowRestore, setRestoreNote,}) => {
  const { setRecentNotes, mode } = useContext(UserContext);

  const navigate = useNavigate();
  const { folderId, noteId } = useParams();

  const isFavoritesPage = !!useMatch("/favorites");
  const isArchivedPage = !!useMatch("/archived");
  const isTrashPage = !!useMatch("/trash");

  useEffect(() => {
    const fetchNotes = async () => {
      let url = "";

      if (isFavoritesPage) {
        url = "https://nowted-server.remotestate.com/notes?isFavourite=true&limit=100";
      } 
      else if (isArchivedPage) {
        url = "https://nowted-server.remotestate.com/notes?isArchived=true&limit=100";
      } 
      else if (isTrashPage) {
        url = "https://nowted-server.remotestate.com/notes?deleted=true&limit=100";
      }
       else if (folderId) {
        url = `https://nowted-server.remotestate.com/notes?folderId=${folderId}`;
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
        console.error("Error is this : ",error);
        setCurrentFolderData([]);
      }
    };
    fetchNotes();
  }, [folderId, isFavoritesPage, isArchivedPage, isTrashPage, refreshNotes, setCurrentFolderData]);

  const updateRecentNotes = (note: recentData) => {
    if (note.deletedAt) return;

    setRecentNotes((prev) => {
      const filtered = prev.filter((n) => n.id !== note.id);
      const updated = [note, ...filtered];
      return updated.slice(0, 3);
    });
  };

  useEffect(() => {
    if (!isTrashPage) {
      setShowRestore(false);
      setRestoreNote(null);
    }
  }, [isTrashPage, setShowRestore, setRestoreNote]);

  return (
    <div className={`flex w-87.5 h-screen flex-col px-5 pb-7.5 ${ mode ? "bg-[#1C1C1C]" : "bg-gray-50"} gap-7.5 overflow-y-auto no-scrollbar scroll-smooth`}>
      <div className={`px-5 pb-5 pt-7.5 ${ mode ? "bg-[#1C1C1C]" : "bg-gray-50"} sticky top-0 z-10`}>
        <h2 className={`text-[22px] font-semibold ${ mode ? "text-white" : "text-black"}`}>
          {isFavoritesPage ? "Favourites" : isArchivedPage ? "Archived" : isTrashPage ? "Trash"
            : currentFolderData.length > 0
            ? currentFolderData[0].folder?.name || "Folder"
            : currFolderName}
        </h2>
      </div>

      <div className="flex flex-col gap-5">
        {currentFolderData.map((note) => (
          <div key={note.id}
            onClick={() => {
              if (isTrashPage) {
                setRestoreNote(note);
                setShowRestore(true);
              } else {
                updateRecentNotes(note);
                navigate(`/folder/${note.folderId}/note/${note.id}`);
              }
            }}
            className={`flex ${ note.id === noteId && !addNote ? mode ? "bg-[#FFFFFF1A]" : "bg-gray-200" : mode ? "bg-[#FFFFFF08]" : "bg-gray-50" } cursor-pointer p-5 min-h-24.5 max-h-24.5 flex-col ${ mode ? "hover:bg-[#FFFFFF1A]" : "hover:bg-gray-200"} overflow-hidden`}>
            <h3 className={`text-lg font-semibold ${ mode ? "text-white" : "text-black"}`}>{note.title} </h3>

            <div className={`flex gap-2.5 text-base font-semibold max-h-5 ${ mode ? "text-[#FFFFFF66]" : "text-gray-500"}`}>
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