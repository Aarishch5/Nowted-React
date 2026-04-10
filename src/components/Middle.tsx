import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import { UserContext } from "../context/UserContext";
import { type recentData } from "./Recents";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";


type middleProps = {
  addNote: boolean;
  currFolderName: string | null;
  refreshNotes: number;
  currentFolderData: recentData[];
  setCurrentFolderData: React.Dispatch<React.SetStateAction<recentData[]>>;
  setShowRestore: React.Dispatch<React.SetStateAction<boolean>>;
  setRestoreNote: React.Dispatch<React.SetStateAction<recentData | null>>;
  noteSearchInput: string;
};
 
const PAGE_SIZE = 5;

type PaginationType = {
  scope: string;
  page: number;
};

const Middle: React.FC<middleProps> = ({addNote, currFolderName, refreshNotes, currentFolderData, setCurrentFolderData, setShowRestore,
 setRestoreNote, noteSearchInput}) => {
  const { setRecentNotes, mode } = useContext(UserContext);

  const navigate = useNavigate();
  const location = useLocation();
  const { folderId, noteId } = useParams();

  const isFavoritesPage = location.pathname.startsWith("/favorites");
  const isArchivedPage = location.pathname.startsWith("/archived");
  const isTrashPage = location.pathname.startsWith("/trash");
  const isFolderPage = location.pathname.startsWith("/folder");

  const paginationScope = `${folderId ?? "none"}-${isFavoritesPage}-${isArchivedPage}-${isTrashPage}-${refreshNotes}`;

  const [pagination, setPagination] = useState<PaginationType>({
    scope: paginationScope,
    page: 0,
  });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isFetchingNextRef = useRef(false);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const currentPage = pagination.scope === paginationScope ? pagination.page : 0;

    useEffect(() => {
    let isActive = true;

    const fetchNotes = async () => {
      let url = "";

      if (isTrashPage) {
        url = "https://nowted-server.remotestate.com/notes?deleted=true&limit=100";
      } else if (isFavoritesPage) {
        url = "https://nowted-server.remotestate.com/notes?favorite=true&limit=100";
      } else if (isArchivedPage) {
        url = "https://nowted-server.remotestate.com/notes?archived=true&limit=100";
      } else if (isFolderPage && folderId && folderId !== "undefined") {
        url = `https://nowted-server.remotestate.com/notes?folderId=${folderId}&limit=100`;
      }

      if (!url) {
        if (isActive) setCurrentFolderData([]);
        return;
      }

      try {
        const response = await axios.get(url);
        const notes: recentData[] = response.data.notes || [];

      if (isActive) {
        setCurrentFolderData(notes);
      }
    } catch (error) {
      console.error("Error is this :", error);
      if (isActive) {
        setCurrentFolderData([]);
      }
    }
  };

  fetchNotes();
  return () => {
    isActive = false;
  };
}, [folderId, isFavoritesPage, isArchivedPage, isTrashPage, isFolderPage, refreshNotes,setCurrentFolderData]);

  useEffect(() => {
    if (!isTrashPage) { 
      setShowRestore(false);    
      setRestoreNote(null);
    } 
  }, [isTrashPage, setShowRestore, setRestoreNote]);

  // Disconnecting the pagination when the compoonent got unMount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const updateRecentNotes = (note: recentData) => {
    if (note.deletedAt) return;

    setRecentNotes((prev) => {
      const filtered = prev.filter((n) => n.id !== note.id);
      const updated = [note, ...filtered];
      return updated.slice(0, 3);
    });
  };


   const finalNotesToShow  = 
      noteSearchInput.trim() === "" ? currentFolderData :
      currentFolderData.filter((item: recentData) => item.title?.toLowerCase().includes(noteSearchInput.toLowerCase()))



  const endIndex = (currentPage + 1) * PAGE_SIZE;
  const visibleNotes = finalNotesToShow.slice(0, endIndex);
  const hasNextPage = endIndex < currentFolderData.length;

  useEffect(() => {
  isFetchingNextRef.current = false;
}, [visibleNotes.length]);

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (!node || !hasNextPage){
        return;
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !isFetchingNextRef.current) {
            isFetchingNextRef.current = true;
            setIsLoadingMore(true);

            setTimeout(() => {
              setPagination((prev) => { 
                const safePage = prev.scope === paginationScope ? prev.page : 0;
                
                return {
                  scope: paginationScope,
                  page: safePage + 1,
                }
              });
              setIsLoadingMore(false);
            }, 500)
          }
        },
        {
          root: containerRef.current,
          threshold: 0.5
        }
      );
      observerRef.current.observe(node);
    },
    [hasNextPage, paginationScope]
  );  

  // console.log(currentFolderData);
  


  return (
    <div className={`flex w-87.5 h-screen flex-col px-5 pb-7.5 ${mode ? "bg-[#1C1C1C]" : "bg-gray-50"} gap-7.5`}>
      <div className={`px-5 pb-5 pt-7.5 ${mode ? "bg-[#1C1C1C]" : "bg-gray-50"} sticky top-0 z-10`}>
        <h2 className={`text-[22px] font-semibold ${mode ? "text-white" : "text-black"}`}>
          {isFavoritesPage ? "Favorites" : isArchivedPage ? "Archived" : isTrashPage ? "Trash" : currentFolderData.length > 0
            ? currentFolderData[0].folder?.name || "Folder" : currFolderName}
        </h2>
      </div>

      <div ref={containerRef} className="flex flex-col gap-5 overflow-y-auto no-scrollbar scroll-smooth">
        {visibleNotes.map((note, index) => {
          const isLastVisible = index === visibleNotes.length - 1;

          return (
            <div key={`${note.id}-${index}`} ref={isLastVisible ? lastElementRef : null} onClick={() => {
                if (!note?.id) return;

                if (isTrashPage) {
                    setRestoreNote(note);
                    setShowRestore(true);
                } else if (isFavoritesPage) {
                    updateRecentNotes(note);
                  navigate(`/favorites/note/${note.id}`);
                } else if (isArchivedPage) {
                  updateRecentNotes(note);
                  navigate(`/archived/note/${note.id}`);
                } else if (note.folderId) {
                  updateRecentNotes(note);
                    navigate(`/folder/${note.folderId}/note/${note.id}`);
                }
              }}
              className={`flex ${ note.id === noteId && !addNote ? mode ? "bg-[#FFFFFF1A]" : "bg-gray-200" : mode ? "bg-[#FFFFFF08]" : "bg-gray-50"
              } cursor-pointer p-5 min-h-24.5 max-h-24.5 flex-col 
               ${ mode ? "hover:bg-[#FFFFFF1A]" : "hover:bg-gray-200"} overflow-hidden`} >
              <h3 className={`text-lg font-semibold ${mode ? "text-white" : "text-black"}`}>
                {note.title}
              </h3>

              <div className={`flex gap-2.5 text-base font-semibold max-h-5 ${mode ? "text-[#FFFFFF66]" : "text-gray-500"}`}>
                <h3>{new Date(note.createdAt).toLocaleDateString("en-GB")}</h3>
                <h3>{note.preview?.slice(0, 20)}...</h3>
              </div>
            </div>
          );
        })}

        {isLoadingMore && hasNextPage && (
          <div className={`text-center text-sm font-medium py-2 ${ mode ? "text-[#FFFFFF66]" : "text-gray-500"}`}>
            Loading...
          </div>
        )}

        {!hasNextPage && currentFolderData.length > 0 && (
          <div className={`text-center text-sm font-medium py-2 ${mode ? "text-[#FFFFFF66]" : "text-gray-500"}`}>
            No more notes available
          </div>
        )}
      </div>
    </div>
  );
};

export default Middle;