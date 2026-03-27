import { Trash,CalendarDays,CircleEllipsis,Folder,Star,Archive,} from "lucide-react";
import React, { useContext, useRef, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import SelectNote from "./SelectNote";
import axios from "axios";
import { type folderDataType } from "../components/Folders";

export type postNotesDataType = {
  title: string;
  content: string;
};

type noteDataSet = {
  id: string;
  folderId: string;
  title: string;
  content: string;
  isFavourite: boolean;
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
};

const Right: React.FC<RightPropType> = ({toggle, setToggle, addNote, setAddNote}) => {
  const {selectedNoteId,selectedRecentNotesId} = useContext(UserContext);
  const [currNote, setCurrNote] = useState<noteDataSet | null>(null);
  const {currSelectedNotesId,setCurrSelectedNotesId,currSelectedFolderId,setCurrentFolderData,currFolderName, setRefreshNotes
  } = useContext(UserContext);

  const [formText, setFormText] = useState<string | null>(null);

  const prevNoteId = useRef<string | null>(null);
  const prevRecentId = useRef<string | null>(null);

  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    if (selectedNoteId !== prevNoteId.current && selectedNoteId) {
      setCurrSelectedNotesId(selectedNoteId);
    }
    if (
      selectedRecentNotesId !== prevRecentId.current &&
      selectedRecentNotesId
    ) {
      setCurrSelectedNotesId(selectedRecentNotesId);
    }

    prevNoteId.current = selectedNoteId;
    prevRecentId.current = selectedRecentNotesId;
  }, [selectedNoteId, selectedRecentNotesId]);

  useEffect(() => {
    const dataFetcher = async (selectedNoteId: string) => {
      try {
        const response = await axios.get(
          `https://nowted-server.remotestate.com/notes/${selectedNoteId}`,
        );
        if (response.data && response.data.note) {
          const notes: noteDataSet = response.data.note;
          setCurrNote(notes);
        }
      } catch (error) {
        console.error("Error", error);
      }
    };

    if (currSelectedNotesId !== null && currSelectedNotesId) {
      dataFetcher(currSelectedNotesId);
    }
  }, [currSelectedNotesId]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !formText?.trim()) {
      console.warn("Title and content are required");
      return;
    }

    try {
      const response = await axios.post(
        "https://nowted-server.remotestate.com/notes",
        {
          title: title.trim(),
          content: formText?.trim(),
          folderId: currSelectedFolderId,
        },
      );

      const newNote = {
        ...response.data.note,
        folder: {
          name: currFolderName,
        },
      };

      if (currSelectedFolderId) {
        setCurrentFolderData((prev) => [...prev, newNote]);
      }

      setTitle("");
      setFormText("");
      setAddNote(false);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const handleArchiveNote = async () => {
    if (!currNote) return;

    try {
      await axios.patch(
        `https://nowted-server.remotestate.com/notes/${currNote.id}`,
        {
          isArchived: true,
        },
      );

      setRefreshNotes((prev) => prev + 1);

      setCurrNote(null);
      setToggle(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Delete

  const handleDeleteNote = async () => {
    if (!currNote) return;

    try {
      await axios.delete(
        `https://nowted-server.remotestate.com/notes/${currNote.id}`,
      );

      setCurrentFolderData((prev) =>
        prev.filter((note) => note.id !== currNote.id),
      );

      setCurrNote(null);
      setToggle(false);

      setRefreshNotes((prev) => prev + 1);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <>
      {currNote ? (
        <div
          className={`flex flex-col gap-7.5 p-12.5 text-[#FFFFFF] w-[calc(100%-650px)] h-screen ${addNote ? "hidden" : "block"}`}
        >
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-[32px]">{currNote.title}</h1>
            <CircleEllipsis
              onClick={(e) => { e.stopPropagation();
                                setToggle((prev) => !prev);
              }}
              className={`h-7.5 w-7.5 text-[#FFFFFF99] hover:text-white cursor-pointer`}/>

            {/* menu  */}
            <div
              onClick={(e) => e.stopPropagation()}
              className={`absolute top-25.25 right-12.75 rounded-md z-50 ${toggle ? "block" : "hidden"}`}>
              <div className="flex flex-col w-50.5 gap-5 p-5 bg-[#333333] overflow-hidden rounded-md shadow-lg border border-white/10">
                <div className="flex flex-col gap-3.75 ">
                  <div className="text-white flex flex-row gap-3.75 rounded items-center cursor-pointer hover:bg-[#FFFFFF1A] p-0.75">
                    <Star className="w-5 h-5" />
                    <h3 className="font-normal font-base text-base">
                      Add to favorite
                    </h3>
                  </div>
                  <div className="text-white flex flex-row gap-3.75 items-center cursor-pointer hover:bg-[#FFFFFF1A] p-0.75">
                    <Archive className="w-5 h-5" />
                    <h3
                      onClick={handleArchiveNote}
                      className="font-normal font-base text-base">
                      Archived
                    </h3>
                  </div>
                </div>

                <hr className="h-px bg-[#FFFFFF1A] border-0" />

                <div onClick={handleDeleteNote}
                  className="text-white flex flex-row gap-3.75 items-center cursor-pointer hover:bg-[#FFFFFF1A] p-0.75">
                  <Trash className="w-5 h-5" />
                  <h3 className="font-normal font-base text-base">Delete</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full h-16.75 justify-between">
            <div className="flex flex-row gap-2 items-start">
              <div className="w-7.5 flex items-start">
                <CalendarDays className="w-4.5 h-4.5 text-[#FFFFFF99]" />
              </div>
              <div className="w-25">
                <h3 className="text-sm text-[#FFFFFF99] font-semibold">Date</h3>
              </div>
              <div>
                <h3 className="text-sm text-white font-semibold underline">
                  {new Date(currNote.createdAt).toLocaleDateString("en-GB")}
                </h3>
              </div>
            </div>
            <hr className="h-px bg-[#FFFFFF1A] border-0" />
            <div className="flex flex-row gap-2 items-start">
              <div className="w-7.5 flex items-start">
                <Folder className="w-4.5 h-4.5 text-[#FFFFFF99]" />
              </div>
              <div className="w-25">
                <h3 className="text-sm text-[#FFFFFF99] font-semibold"> Folder</h3>
              </div>
              <div>
                <h3 className="text-sm text-white font-semibold underline">{currNote.folder.name}</h3>
              </div>
            </div>
          </div>

          <div>
            <p className="text-justify text-base font-normal text-white">{currNote.content}</p>
          </div>
        </div>
      ) : (
        !addNote && <SelectNote />
      )}

      {/* New Note */}

      <div className={`flex flex-col gap-7.5 p-12.5 text-[#FFFFFF] w-[calc(100%-650px)] h-screen ${addNote ? "block" : "hidden"}`}>
        <div className="flex flex-row justify-between items-center">
          <input id="noteTitle" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter the title"
            className="text-[32px] w-full placeholder:text-[32px] bg-transparent outline-none placeholder:text-[#FFFFFF66]"/>
        </div>

        <div className="flex flex-col w-full h-16.75 justify-between">
          <div className="flex flex-row gap-2 items-start">
            <div className="w-7.5 flex items-start">
              <CalendarDays className="w-4.5 h-4.5 text-[#FFFFFF99]" />
            </div>
            <div className="w-25">
              <h3 className="text-sm text-[#FFFFFF99] font-semibold">Date</h3>
            </div>
            <div>
              <h3 className="text-sm text-white font-semibold underline">
                {new Date().toLocaleDateString("en-GB")}
              </h3>
            </div>
          </div>
          <hr className="h-px bg-[#FFFFFF1A] border-0" />
          <div className="flex flex-row gap-2 items-start">
            <div className="w-7.5 flex items-start">
              <Folder className="w-4.5 h-4.5 text-[#FFFFFF99]" />
            </div>
            <div className="w-25">
              <h3 className="text-sm text-[#FFFFFF99] font-semibold">Folder</h3>
            </div>
            <div>
              {currFolderName && (
                <h3 className="text-sm text-white font-semibold underline">
                  {currFolderName}
                </h3>
              )}
            </div>
          </div>
        </div>

        <div>
          <form className="flex flex-col gap-4 items-start" onSubmit={handleFormSubmit} >
            <textarea id="contentTextarea" value={formText || ""} onChange={(e) => setFormText(e.target.value)}
              className="h-100 w-full resize-none p-3 align-top focus:outline-none focus:ring-2 focus:ring-[#312EB5] focus:border-[#312EB5]"
              placeholder="Enter text" />
            <input id="formSubmit" className="px-3 py-1 bg-[#312EB5] font-semibold rounded-md text-white" type="submit" value="Submit"/>
          </form>
        </div>
      </div>
    </>
  );
};

export default Right;
