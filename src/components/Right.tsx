import { Trash, CalendarDays, CircleEllipsis, Folder, Star, Archive, StarOff, ArchiveRestore} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import SelectNote from "./SelectNote";
// import axios from "axios";
import { type folderDataType } from "../components/Folders";
import type { recentData } from "./Recents";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios"

export type postNotesDataType = {
  title: string;
  content: string;
}

type noteDataSet = { 
  id: string;
  folderId: string;
  title: string;
  content: string;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  preview: string;
  folder: folderDataType;
};

type RightPropType = {
  toggle: boolean;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;

  addNote: boolean;
  setAddNote: React.Dispatch<React.SetStateAction<boolean>>;

  currFolderName: string | null;

  setRefreshNotes: React.Dispatch<React.SetStateAction<number>>;
  setCurrentFolderData: React.Dispatch<React.SetStateAction<recentData[]>>;

  setShowRestore: React.Dispatch<React.SetStateAction<boolean>>;

};

const Right: React.FC<RightPropType> = ({ toggle, setToggle, addNote, setAddNote, currFolderName, setRefreshNotes, setCurrentFolderData,setShowRestore}) => {
  const { mode } = useContext(UserContext);

  const { noteId, folderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [currNote, setCurrNote] = useState<noteDataSet | null>(null);
  const [formText, setFormText] = useState<string>("");
  const [title, setTitle] = useState<string>("");


  // Fetching the notes

  useEffect(() => {
  const fetchNote = async () => {
    if (!noteId || noteId === undefined) {
      setCurrNote(null);
      return;
    }

    try {
      const response = await api.get(`/notes/${noteId}`);
      if (response.data?.note) {
        setCurrNote(response.data.note);
      } else {
        setCurrNote(null);
      }
    } catch (error) {
      console.error("Error is this :", error);
      setCurrNote(null);
    }
  }
  fetchNote()
}, [noteId]);



  // Handling the user form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !formText.trim()) {
      console.error("Title or contentt missing");
      return;
    }

    try {
      const response = await api.post("/notes",{title: title.trim(), content: formText.trim(), folderId: folderId});
      const newNote = {...response.data.note, folder: { name: currFolderName}};
      if (folderId) {
        setCurrentFolderData((prev) => [...prev, newNote]);
      }
      setTitle("");
      setFormText("");
      setAddNote(false);

      navigate(`/folder/${newNote.folderId}/note/${newNote.id}`);
    } catch (error) {
      console.error("Error in creating note:", error);
    }
  };


  // Favourite notes handleing
  const handleFavouriteNote = async () => {
    if (!currNote)
    { return;}

    try {
      const updatedValue = !currNote.isFavorite;
      await api.patch( `/notes/${currNote.id}`,{ isFavorite: updatedValue });
      setRefreshNotes((prev) => prev + 1);
      setToggle(false);
    } catch(error) {
        console.log(error);
    }
  };

  // Archive notes handler
  const handleArchiveNote = async () => {
    if (!currNote){
      return;
    }

    try {
      const updatedValue = !currNote.isArchived;
      await api.patch(`/notes/${currNote.id}`,{isArchived: updatedValue});
      const finalResponse = await api.get(`/notes/${currNote.id}`);
      const updatedNote = finalResponse.data?.note;
      if (!updatedNote) {
        return;
      }

      setCurrNote(updatedNote);
      setToggle(false);
      setRefreshNotes((prev) => prev + 1);
      if (updatedNote.isArchived) { 
        navigate("/archived");
      }
    } catch (error) {
      console.error("Error archiving note:", error);
    }
  };

    // Handling the Trashing of the Notes
    const handleDeleteNote = async () => {
    if (!currNote) {
      return;
    }

    try {
      const deletedNoteId = currNote.id;
      const deletedFolderId = currNote.folderId;

      await api.delete(`/notes/${deletedNoteId}`);
      setCurrentFolderData((prev) => prev.filter((note) => note.id !== deletedNoteId));

      setShowRestore(true);

      setCurrNote(null);
      setToggle(false);
      setRefreshNotes((prev) => prev + 1);

    navigate(`/folder/${deletedFolderId}`);
     } catch (error) {
      //
    console.error("Error in delet:", error);
    }
  };

  return (
    <>
      {currNote ? (
        <div
          className={`flex flex-col gap-7.5 p-12.5 ${ mode ? "text-[#FFFFFF]" : "text-black"
          }  w-[calc(100%-650px)] h-screen ${addNote ? "hidden" : "block"}`}>
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-[32px]">{currNote?.title}</h1>
            <CircleEllipsis onClick={(e) => { e.stopPropagation();setToggle((prev) => !prev);}}
                className={`h-7.5 w-7.5 ${mode ? "text-[#FFFFFF99] hover:text-white" : "text-black hover:text-[#a58d8d99]"} cursor-pointer`}/>
            <div onClick={(e) => e.stopPropagation()} className={`absolute top-25.25 right-12.75 rounded-md z-50 ${ toggle ? "block" : "hidden"}`}>
              <div className={`flex flex-col w-50.5 gap-5 p-5 overflow-hidden rounded-md shadow-lg border ${mode ? "bg-[#333333] border-white/10" : "bg-white border-black" }`}>
                <div className="flex flex-col gap-3.75">
                  <div onClick={handleFavouriteNote} className={`${mode ? "text-white hover:bg-[#FFFFFF1A]"
                     : "text-black hover:bg-[#8b73731a]"} flex flex-row gap-3.75 rounded items-center cursor-pointer p-0.75`}>
                      {currNote?.isFavorite ? ( <StarOff className="w-5 h-5" />) : (  <Star className="w-5 h-5" />)}
                        <h3 className="font-normal text-base">
                          {currNote?.isFavorite ? "Remove from favorite" : "Add to favorite"}
                        </h3>
                  </div>
                  <div onClick={handleArchiveNote} className={`${mode ? "text-white hover:bg-[#FFFFFF1A]" : "text-black hover:bg-[#8b73731a]"} flex flex-row gap-3.75 items-center cursor-pointer p-0.75`}>
                    {!currNote?.isArchived ? (<Archive className="w-5 h-5" />) : (<ArchiveRestore className="w-5 h-5"/>)}
                    <h3  className="font-normal font-base text-base">   {!currNote?.isArchived ? "Archived" : "UnArchived" } </h3>
                  </div>
                </div>

                <hr className="h-px bg-[#FFFFFF1A] border-0" />

                <div onClick={handleDeleteNote} className={`${mode ? "text-white hover:bg-[#FFFFFF1A]" : "text-black hover:bg-[#8b73731a]"} flex flex-row gap-3.75 items-center cursor-pointer p-0.75`}>
                    <Trash className="w-5 h-5" />
                    <h3 className="font-normal font-base text-base">Delete</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full h-16.75 justify-between">
            <div className="flex flex-row gap-2 items-start">
              <div className="w-7.5 flex items-start">
                <CalendarDays className={`w-4.5 h-4.5 ${ mode ? "text-[#FFFFFF99]" : "text-[#493d3d]" }`}/>
              </div>
              <div className="w-25">
                <h3 className={`text-sm font-semibold ${ mode ? "text-[#FFFFFF99]" : "text-[#493d3d]" }`}> Date</h3>
              </div>
              <div>
                <h3 className={`text-sm ${ mode ? "text-white" : "text-black"} font-semibold underline`}>
                  {new Date(currNote.createdAt).toLocaleDateString("en-GB")}
                </h3>
              </div>
            </div>

            <hr className={`h-px ${ mode ? "bg-[#FFFFFF1A]" : "bg-[#baa8a81a]"} border-0`}/>

            <div className="flex flex-row gap-2 items-start">
              <div className="w-7.5 flex items-start">
                <Folder className={`w-4.5 h-4.5 ${ mode ? "text-[#FFFFFF99]" : "text-[#28242499]"}`} />
              </div>
              <div className="w-25">
                <h3 className={`text-sm ${mode ? "text-[#FFFFFF99]" : "text-[#28242499]"} font-semibold`}> Folder</h3>
              </div>
              <div>
                <h3 className={`text-sm ${ mode ? "text-white" : "text-black"} font-semibold underline`}> {currNote.folder.name} </h3>
              </div>
            </div>
          </div>

          
          <div className="w-full max-h-110 overflow-y-auto no-scrollbar scroll-smooth ">
            <p className={`text-justify text-base font-normal ${ mode ? "text-white" : "text-black"}`} > {currNote.content}</p>
          </div>
        </div>
      ) : ( !addNote && location.pathname !== "/trash" && <SelectNote />)}

      <div onClick={(e) => e.stopPropagation()} className={`flex flex-col gap-7.5 p-12.5 ${ mode ? "text-white" : "text-black"} w-[calc(100%-650px)] h-screen ${addNote ? "block" : "hidden"}`}>
        <div className="flex flex-row justify-between items-center">
          <input id="noteTitle" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter the title"
            className={`text-[32px] w-full placeholder:text-[32px] bg-transparent outline-none ${ mode ? "placeholder:text-[#FFFFFF66]" : "placeholder:text-[#3a383866]"}`} />
        </div>

        <div className="flex flex-col w-full h-16.75 justify-between">
          <div className="flex flex-row gap-2 items-start">
            <div className="w-7.5 flex items-start">
              <CalendarDays className={`w-4.5 h-4.5 ${ mode ? "text-[#FFFFFF99]" : "text-black"} stroke-2`}/>
            </div>
            <div className="w-25">
              <h3 className={`text-sm ${ mode ? "text-[#FFFFFF99]" : "text-black"} font-semibold`}> Date</h3>
            </div>
            <div>
              <h3 className={`text-sm ${mode ? "text-white" : "text-black" } font-semibold underline`}>
                {new Date().toLocaleDateString("en-GB")}
              </h3>
            </div>
          </div>

          <hr className={`h-px ${ mode ? "bg-[#FFFFFF1A]" : "bg-[#9188881a]"} border-0`}/>

          <div onClick={(e) => e.stopPropagation()} className="flex flex-row gap-2 items-start">
            <div className="w-7.5 flex items-start">
              <Folder className={`w-4.5 h-4.5 ${ mode ? "text-[#FFFFFF99]" : "text-black"} stroke-2`}/>
            </div>
            <div className="w-25">
              <h3 className={`text-sm ${ mode ? "text-[#FFFFFF99]" : "text-black"} font-semibold`}> Folder</h3>
            </div>
            <div>
              {currFolderName && (
                <h3 className={`text-sm ${ mode ? "text-white" : "text-black"} font-semibold underline`}> {currFolderName} </h3>
              )}
            </div>
          </div>
        </div>

        <div>
          <form onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 items-start" onSubmit={handleFormSubmit}>
            <textarea id="contentTextarea" value={formText}onChange={(e) => setFormText(e.target.value)}
              className="h-100 w-full resize-none p-3 align-top focus:outline-none focus:ring-2 focus:ring-[#312EB5] focus:border-[#312EB5]"
              placeholder="Enter text"/>
            <input id="formSubmit" className="px-3 py-1 bg-[#312EB5] font-semibold rounded-md text-white" type="submit" value="Submit"/>
          </form>
        </div>
      </div>
    </>
  );
};

export default Right;