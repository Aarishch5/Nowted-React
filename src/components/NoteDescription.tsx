import {Trash, CalendarDays, CircleEllipsis, Folder, Star, Archive, StarOff, ArchiveRestore} from "lucide-react";
import React, { useEffect, useState, useRef, useCallback } from "react";
import SelectNote from "./SelectNote";
import { type noteDataSet } from "../types/types"
import type { recentData } from "../types/types"
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";




type RightPropType = {
  toggle: boolean;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;

  addNote: boolean;
  setAddNote: React.Dispatch<React.SetStateAction<boolean>>;

  currFolderName: string | null;

  setRefreshNotes: React.Dispatch<React.SetStateAction<number>>;
  setCurrentFolderData: React.Dispatch<React.SetStateAction<recentData[]>>;

  setShowRestore: React.Dispatch<React.SetStateAction<boolean>>;
  setRestoreNote: React.Dispatch<React.SetStateAction<recentData | null>>;

  setRefreshRecents: React.Dispatch<React.SetStateAction<number>>;
};

const NoteDescription: React.FC<RightPropType> = ({ toggle, setToggle, addNote, setAddNote, currFolderName,
  setRefreshNotes,
  setCurrentFolderData,
  setShowRestore,
  setRestoreNote,  setRefreshRecents,
}) => {
  const { noteId, folderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [currNote, setCurrNote] = useState<noteDataSet | null>(null);
  const [formText, setFormText] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isCreatingNote, setIsCreatingNote] = useState(false);

  const isMounted = useRef(false);

  const titleDbounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentDbounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const createDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const creatingNoteRef = useRef(false);


  useEffect(() => {
  const isNoteRoute = location.pathname.includes("/note/");

  if (!isNoteRoute) {
    setCurrNote(null);
    setTitle("");
    setFormText("");
  }
}, [location.pathname]);

  const shouldShowSelectNote = !addNote && !currNote && !isCreatingNote && !noteId && !location.pathname.startsWith("/trash");

  useEffect(() => {
    isMounted.current = false;
  }, [noteId]);

  // Fetching the notes
  useEffect(() => {
    if (addNote) {
      return;
    }
    if (location.pathname.startsWith("/trash")) return;
    const fetchNote = async () => {
      if (!noteId) {
        if (!isCreatingNote) {
          setCurrNote(null);
          setTitle("");
          setFormText("");
          return;
        }
      }

      try {
        const response = await api.get(`/notes/${noteId}`);
        if (response.data?.note) {
          const fetchedNote = response.data.note;
          setCurrNote(fetchedNote);
          setTitle(fetchedNote.title || "");
          setFormText(fetchedNote.content || "");
        } else {
          setCurrNote(null);
          setTitle("");
          setFormText("");
        }
      } catch (error) {
        console.error(error);
        setCurrNote(null);
        setTitle("");
        setFormText("");
      }
    };
    fetchNote();
  }, [noteId, addNote, isCreatingNote]);

  // Auto saving of the note which is existing already
  useEffect(() => {
    if (!currNote || addNote) return;

    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedContent = formText.trim();

    if (!trimmedTitle) return;

    const timer = setTimeout(async () => {
      try {
        await api.patch(`/notes/${currNote.id}`, {
          title: trimmedTitle,
          content: trimmedContent,
        });
        setRefreshRecents((prev) => prev + 1);
      } catch (error) {
        console.error("Error updating note:", error);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [title, formText, currNote?.id, addNote]);

  // Auto creation of the note
  useEffect(() => {
    if (!addNote) return;
    if (!folderId) return;

    const trimmedTitle = title.trim();
    const trimmedContent = formText.trim();

    if (!trimmedTitle || !trimmedContent) {
      return;
    }

    if (createDebounceRef.current) {
      clearTimeout(createDebounceRef.current);
    }

    createDebounceRef.current = setTimeout(async () => {
      if (creatingNoteRef.current) return;

      try {
        creatingNoteRef.current = true;
        setIsCreatingNote(true);

        const response = await api.post("/notes", {
          title: trimmedTitle || "Untitled",
          content: trimmedContent,
          folderId,
        });

        const createdId = response.data?.id;
        if (!createdId) return;

        const fullNoteResponse = await api.get(`/notes/${createdId}`);
        const createdNote = fullNoteResponse.data?.note;
        if (!createdNote) return;

        const safeCreatedNote = {
          ...createdNote,
          preview: createdNote.preview ?? trimmedContent.slice(0, 15),
          folder: createdNote.folder ?? {
            name: currFolderName ?? "Untitled Folder",
          },
        };

        setCurrNote(safeCreatedNote);
        navigate(
          `/folder/${safeCreatedNote.folderId}/note/${safeCreatedNote.id}`,
        );
        setCurrentFolderData((prev) => [safeCreatedNote, ...prev]);
        setRefreshRecents((prev) => prev + 1);
        setAddNote(false);
      } catch (error) {
        console.error("Error auto-creating note:", error);
      } finally {
        creatingNoteRef.current = false;
        setIsCreatingNote(false);
      }
    }, 1000);

    return () => {
      if (createDebounceRef.current) {
        clearTimeout(createDebounceRef.current);
      }
    };
  }, [addNote,title,formText,folderId,currFolderName,navigate,setAddNote,setCurrentFolderData]);


  // Favorite note handler

  const handleFavouriteNote = useCallback(async () => {
    if (!currNote) {
      return;
    }

    try {
      const updatedValue = !currNote.isFavorite;
      await api.patch(`/notes/${currNote.id}`, { isFavorite: updatedValue });

      // update notes
      setCurrNote((prev) =>
        prev ? { ...prev, isFavorite: updatedValue } : prev,
      );

      setRefreshNotes((prev) => prev + 1);
      setToggle(false);
      if (updatedValue) {
        toast.success("Note Added to favourites");
      } else {
        if (location.pathname.startsWith("/favorites")) {
          navigate("/favorites");
        } else if (currNote.folderId) {
          navigate(`/folder/${currNote.folderId}`);
        }
        toast.warning("Note Removed from favourites");
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Archive notes handler
  const handleArchiveNote = useCallback(async () => {
    if (!currNote) {
      return;
    }

    try {
      const updatedValue = !currNote.isArchived;
      await api.patch(`/notes/${currNote.id}`, { isArchived: updatedValue });
      const finalResponse = await api.get(`/notes/${currNote.id}`);
      const updatedNote = finalResponse.data?.note;
      if (!updatedNote) {
        return;
      }

      setCurrNote(updatedNote);
      setToggle(false);
      setRefreshNotes((prev) => prev + 1);
      if (updatedValue) {
        toast.warn("Note Archived!");
      } else {
        toast.success("Note Unarchived!");
      }
      if (updatedNote.isArchived) {
        navigate(`/folder/${updatedNote.folderId}`);
      } else if (!updatedNote.isArchived) {
        navigate(`/archived`);
      }
    } catch (error) {
      console.error("Error archiving note:", error);
    }
  }, []);

  // Handling the Trashing of the Notes
  const handleDeleteNote = useCallback(async () => {
    if (!currNote) {
      return;
    }

    try {
      const deletedNoteId = currNote.id;

      await api.delete(`/notes/${deletedNoteId}`);

      setRestoreNote(currNote);
      setToggle(false);

      setRefreshNotes((prev) => prev + 1);
      setShowRestore(true);
      setCurrNote(null);

      toast.warning("Note Deleted!");

      if (location.pathname.startsWith("/favorites")) {
        navigate("/favorites");
      } else if (location.pathname.startsWith("/archived")) {
        navigate("/archived");
      } else if (currNote.folderId) {
        navigate(`/folder/${currNote.folderId}`);
      }
    } catch (error) {
      console.error(`Error in delet: ${error}`);
    }
  }, []);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    if (titleDbounceRef.current) {
      clearTimeout(titleDbounceRef.current);
    }

    titleDbounceRef.current = setTimeout(() => {
      setCurrNote((prev) => (prev ? { ...prev, title: newTitle } : prev));

      setCurrentFolderData((prev) =>
        prev.map((note) =>
          note.id === noteId ? { ...note, title: newTitle } : note,
        ),
      );
    }, 500);
  },[]);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setFormText(newContent);

    if (contentDbounceRef.current) {
      clearTimeout(contentDbounceRef.current);
    }

    contentDbounceRef.current = setTimeout(() => {
      setCurrNote((prev) =>
        prev
          ? { ...prev, content: newContent, preview: newContent.slice(0, 15) }
          : prev,
      );

      setCurrentFolderData((prev) =>
        prev.map((note) =>
          note.id === noteId
            ? { ...note, content: newContent, preview: newContent.slice(0, 15) }
            : note,
        ),
      );
    }, 500);
  },[]);

  useEffect(() => {
    return () => {
      if (titleDbounceRef.current) {
        clearTimeout(titleDbounceRef.current);
      }
      if (contentDbounceRef.current) {
        clearTimeout(contentDbounceRef.current);
      }
    };
  }, []);

  const handleEnterPress = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      console.log("Enter pressed");
    }
  }, []);

  return (
    <>
      {currNote ? (
        <div
          className={`flex flex-col gap-7.5 p-12.5 text-(--mainText) w-[calc(100%-650px)] h-screen ${addNote ? "hidden" : "block"}`}
        >
          <div className="flex flex-row justify-between items-center">
            <input
              type="text"
              value={title}
              name={title}
              onChange={handleTitleChange}
              placeholder="Enter the title"
              className="text-[32px] w-full bg-transparent outline-none placeholder:text-(--rightPlaceHolderText)"
            />
            <CircleEllipsis
              onClick={(e) => {
                e.stopPropagation();
                setToggle((prev) => !prev);
              }}
              className="h-7.5 w-7.5 text-(--folderTextColor) hover:text-(--rightHoverText) cursor-pointer"
            />
            <div
              onClick={(e) => e.stopPropagation()}
              className={`absolute top-25.25 right-12.75 rounded-md z-50 ${toggle ? "block" : "hidden"}`}
            >
              <div
                className={`flex flex-col w-50.5 gap-5 p-5 overflow-hidden rounded-md border bg-(--rightToggleBg) border-(--boderBg)`}
              >
                <div className="flex flex-col gap-3.75">
                  <div
                    onClick={handleFavouriteNote}
                    className="text-(--mainText) hover:bg-(--favoriteNoteHowerBg) 
                     flex flex-row gap-3.75 rounded items-center cursor-pointer p-0.75"
                  >
                    {currNote?.isFavorite ? (
                      <StarOff className="w-5 h-5" />
                    ) : (
                      <Star className="w-5 h-5" />
                    )}
                    <h3 className="font-normal text-base">
                      {currNote?.isFavorite ? "Remove from favorite" : "Add to favorite"}
                    </h3>
                  </div>
                  <div
                    onClick={handleArchiveNote}
                    className="text-(--mainText) hover:bg-(--favoriteNoteHowerBg)  flex flex-row gap-3.75 items-center cursor-pointer p-0.75"
                  >
                    {!currNote?.isArchived ? (
                      <Archive className="w-5 h-5" />
                    ) : (
                      <ArchiveRestore className="w-5 h-5" />
                    )}
                    <h3 className="font-normal font-base text-base">
                      {" "}{!currNote?.isArchived ? "Archived" : "UnArchived"}{" "}
                    </h3>
                  </div>
                </div>

                <hr className="h-px bg-[#FFFFFF1A] border-0" />

                <div
                  onClick={handleDeleteNote}
                  className="text-(--mainText) hover:bg-(--favoriteNoteHowerBg)  flex flex-row gap-3.75 items-center cursor-pointer p-0.75">
                  <Trash className="w-5 h-5" />
                  <h3 className="font-normal font-base text-base">Delete</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full h-16.75 justify-between">
            <div className="flex flex-row gap-2 items-start">
              <div className="w-7.5 flex items-start">
                <CalendarDays className="w-4.5 h-4.5 text-(--calenderText)" />
              </div>
              <div className="w-25">
                <h3 className="text-sm font-semibold text-(--calenderText)">
                  {" "}
                  Date{" "}
                </h3>
              </div>
              <div>
                <h3 className="text-sm text-(--mainText) font-semibold underline">
                  {new Date(currNote.createdAt).toLocaleDateString("en-GB")}
                </h3>
              </div>
            </div>

            <hr className="h-px bg-(--favoriteNoteHowerBg) border-0" />

            <div className="flex flex-row gap-2 items-start">
              <div className="w-7.5 flex items-start">
                <Folder className={`w-4.5 h-4.5 text-(--rightText)`} />
              </div>
              <div className="w-25">
                <h3 className={`text-sm text-(--rightText) font-semibold`}>
                  {" "}
                  Folder
                </h3>
              </div>
              <div>
                <h3 className="text-sm text-(--mainText) font-semibold underline">
                  {" "}
                  {currNote.folder?.name ||
                    currFolderName ||
                    "Untitled Folder"}{" "}
                </h3>
              </div>
            </div>
          </div>

          <div className="w-full h-110  overflow-y-auto no-scrollbar scroll-smooth ">
            <textarea
              name={formText}
              value={formText}
              onChange={handleContentChange}
              onKeyDown={handleEnterPress}
              placeholder="Enter the text"
              className="w-full h-full resize-none bg-transparent text-justify text-base font-normal outline-none no-scrollbar"
            />
          </div>
        </div>
      ) : (
        shouldShowSelectNote && <SelectNote />
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex flex-col gap-7.5 p-12.5 text-(--mainText) w-[calc(100%-650px)] h-screen ${addNote ? "block" : "hidden"}`}
      >
        <div className="flex flex-row justify-between items-center">
          <input
            id="noteTitle"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the title"
            className="text-[32px] w-full placeholder:text-[32px] bg-transparent outline-none placeholder:text-(--rightPlaceHolderText)"
          />
        </div>

        <div className="flex flex-col w-full h-16.75 justify-between">
          <div className="flex flex-row gap-2 items-start">
            <div className="w-7.5 flex items-start">
              <CalendarDays className="w-4.5 h-4.5 text-(--folderTextColor) stroke-2" />
            </div>
            <div className="w-25">
              <h3 className="text-sm text-(--folderTextColor) font-semibold">
                {" "}
                Date{" "}
              </h3>
            </div>
            <div>
              <h3 className="text-sm text-(--mainText) font-semibold underline">
                {new Date().toLocaleDateString("en-GB")}
              </h3>
            </div>
          </div>

          <hr className="h-px bg-(--rightHRBg) border-0" />

          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-row gap-2 items-start"
          >
            <div className="w-7.5 flex items-start">
              <Folder className="w-4.5 h-4.5 text-(--folderTextColor) stroke-2" />
            </div>
            <div className="w-25">
              <h3 className="text-sm text-(--folderTextColor) font-semibold">
                {" "}
                Folder{" "}
              </h3>
            </div>
            <div>
              {currFolderName && (
                <h3 className="text-sm text-(--mainText) font-semibold underline">
                  {" "}
                  {currFolderName}{" "}
                </h3>
              )}
            </div>
          </div>
        </div>

        <div>
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col gap-4 items-start"
          >
            <textarea
              id="contentTextarea"
              value={formText}
              onChange={(e) => setFormText(e.target.value)}
              className="min-h-110 w-full resize-none p-3 align-top focus:outline-none focus:ring-2 focus:ring-[#312EB5] focus:border-[#312EB5]"
              placeholder="Enter text"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default NoteDescription;
