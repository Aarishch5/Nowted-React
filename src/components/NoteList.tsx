import React, { useEffect, useRef, useState, useCallback} from "react";

import { type recentData } from "../types/types"
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "../api/axios";
import {type middleProps} from "../types/types"

const LIMIT = 10;

const NoteList: React.FC<middleProps> = ({
  addNote,
  currFolderName,
  refreshNotes,
  currentFolderData,
  setCurrentFolderData,
  setShowRestore,
  setRestoreNote,
}) => {

  const navigate = useNavigate();
  const location = useLocation();
  const { folderId, noteId } = useParams();

  const isFavoritesPage = location.pathname.startsWith("/favorites");
  const isArchivedPage = location.pathname.startsWith("/archived");
  const isTrashPage = location.pathname.startsWith("/trash");
  const isFolderPage = location.pathname.startsWith("/folder");
  

  const observerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);


  const getNotesUrl = useCallback(
    (pageNumber: number) => {
      if (isTrashPage) {
      return `/notes?deleted=true&page=${pageNumber}&limit=${LIMIT}`;
    } else if (isFavoritesPage) {
      return `/notes?favorite=true&page=${pageNumber}&limit=${LIMIT}`;
    } else if (isArchivedPage) {
      return `/notes?archived=true&page=${pageNumber}&limit=${LIMIT}`;
    } else if (isFolderPage && folderId && folderId !== "undefined") {
      return `/notes?folderId=${folderId}&page=${pageNumber}&limit=${LIMIT}`;
    }

      return "";
    },
    [isTrashPage, isFavoritesPage, isArchivedPage, isFolderPage, folderId],
  );
  

  useEffect(() => {
    let isActive = true;

    const fetchNotes = async () => {
      const url =  getNotesUrl(1);


      if (!url) {
        if (isActive) {
          setCurrentFolderData([]);
          setLoading(false);
          setHasMore(false);
        }
        return;
      }

      try {
        setLoading(true);
        setPage(1);
        setHasMore(true);

        const response = await api.get(url);
        const notes: recentData[] = response.data.notes || [];

        if (isActive) {
          setCurrentFolderData(notes);
          setHasMore(notes.length === LIMIT);
        }
      } catch (error) {
        console.error("Error is this :", error);
        if (isActive) {
          setCurrentFolderData([]);
          setHasMore(false);
        }
      }
      finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchNotes();
    return () => {
      isActive = false;
    };
  }, [
    getNotesUrl,
    refreshNotes,
    setCurrentFolderData,
  ]);

  useEffect(() => {
    if (!isTrashPage) {
      setShowRestore(false);
      setRestoreNote(null);
    }
  }, [isTrashPage, setShowRestore, setRestoreNote]);


  useEffect(() => {
  if (isTrashPage && noteId) {
    const restoreNoteData = currentFolderData.find(n => n.id === noteId);

    if (restoreNoteData) {
      setRestoreNote(restoreNoteData);
      setShowRestore(true);
    }
  }
}, [noteId, isTrashPage, currentFolderData, setRestoreNote, setShowRestore]);

    useEffect(() => {
    if (loading) return;
    if (!hasMore) return;
    if (loadingMore) return;

    const currentObserverTarget = observerRef.current;
    const currentRoot = containerRef.current;

    if (!currentObserverTarget || !currentRoot) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || loadingMore || !hasMore) return;

        try {
          setLoadingMore(true);

          const nextPage = page + 1;
          const url = getNotesUrl(nextPage);

          if (!url) return;

          const response = await api.get(url);
          const newNotes: recentData[] = response.data.notes || [];

          setCurrentFolderData((prev) => [...prev, ...newNotes]);
          setPage(nextPage);
          setHasMore(newNotes.length === LIMIT);
        } catch (error) {
          console.error("Error loading more notes:", error);
        } finally {
          setLoadingMore(false);
        }
      },
      {
        root: currentRoot,
        rootMargin: "200px",
        threshold: 0,
      },
    );

    observer.observe(currentObserverTarget);

    return () => observer.disconnect();
  }, [page, loading, loadingMore, hasMore, getNotesUrl, setCurrentFolderData]);


  return (
    <div onClick={(e) => e.stopPropagation()} className="flex w-87.5 h-screen flex-col px-5 pb-7.5 bg-(--middleBg) gap-7.5">
      <div className="px-5 pb-5 pt-7.5 bg-(--middleBg) sticky top-0 z-10">
        <h2 className="text-[22px] font-semibold text-(--mainText)">
          {isFavoritesPage ? "Favorites" : isArchivedPage ? "Archived" : isTrashPage ? "Trash" : currFolderName || "Folder"}
        </h2>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto flex flex-col gap-5">
        {loading ? (
          <div className="text-center text-sm font-medium py-2 text-(--middleText)">
            Loading...
          </div>
        ) : currentFolderData.length === 0 ? (
          <div className="text-center text-sm font-medium py-2 text-(--middleText)">
            No notes available
          </div>
        ) : (
          currentFolderData.map((note) => (
            <div
              key={`${note.id}`}
              onClick={() => {
                if (!note?.id) return;
                setShowRestore(false);
                if (isTrashPage) {
                  setRestoreNote(note);
                  setShowRestore(true);
                  navigate(`/trash/note/${note.id}`);
                } else if (isFavoritesPage) {
                
                  navigate(`/favorites/note/${note.id}`);
                } else if (isArchivedPage) {
                  
                  navigate(`/archived/note/${note.id}`);
                } else if (note.folderId) {
                
                  navigate(`/folder/${note.folderId}/note/${note.id}`);
                }
              }}
              className={`flex ${
                note.id === noteId && !addNote ? `bg-(--folderBg)` : `bg-(--middleBg2)`
              } cursor-pointer p-5 min-h-24.5 max-h-24.5 flex-col hover:bg-(--folderBg) overflow-hidden`}>
              <h3 className="text-lg font-semibold text-(--mainText)">
                {note.title}{" "}
              </h3>

              <div className="flex gap-2.5 text-base font-semibold max-h-5 text-(--middleText)">
                <h3>{new Date(note.createdAt).toLocaleDateString("en-GB")}</h3>
                <h3>{note.preview?.slice(0, 20)}...</h3>
              </div>
            </div>
          ))
        )}

        {loadingMore && hasMore && (
          <div className="text-center text-sm font-medium py-2 text-(--middleText)">
            {" "} Loading...
          </div>
        )}

        {!hasMore && currentFolderData.length > 0 && !loading && (
          <div className="text-center text-sm font-medium py-2 text-(--middleText)">
            {" "} No more notes available
          </div>
        )}
        <div ref={observerRef} className="h-5 w-full shrink-0" />
      </div>
    </div>
  );
};

export default NoteList;
