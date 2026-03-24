import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { type recentData } from "./Recents";
import axios from "axios";
import { useEffect, useRef } from "react";

const Middle: React.FC = () => {
  const { selectedFolderId, } = useContext(UserContext);
  const { currentFolderData, setCurrentFolderData } = useContext(UserContext);
  const { selectedNoteId,currSelectedNotesId, setSelectedNoteId, recentFolderId, currSelectedFolderId, setCurrSelectedFolderId } = useContext(UserContext);
  const prevFolderId = useRef<string | null>(null);
  const prevRecentFolderId = useRef<string | null>(null);

  useEffect(() => {
      if (selectedFolderId !== prevFolderId.current && selectedFolderId) {
        setCurrSelectedFolderId(selectedFolderId);
      }
      if (recentFolderId !== prevRecentFolderId.current && recentFolderId) {
        setCurrSelectedFolderId(recentFolderId);
      }
  
      prevFolderId.current = selectedFolderId;
      prevRecentFolderId.current = recentFolderId;
    }, [selectedFolderId, recentFolderId, currSelectedFolderId]);

  useEffect(() => {
    const dataFetcher = async (selectedFolderId: string) => {
      try {
        const response = await axios.get(
          `https://nowted-server.remotestate.com/notes?folderId=${selectedFolderId}`,
        );
        if (response.data && response.data.notes) {
          const notes: recentData[] = response.data.notes;
          setCurrentFolderData(notes);
        }
      } catch (error) {
        console.error("Error", error);
      }
    };

    if (currSelectedFolderId !== null) {
      dataFetcher(currSelectedFolderId);
    }
  }, [currSelectedFolderId]);

  return (
    <div className="flex w-87.5 h-screen flex-col px-5 pb-7.5 bg-[#1C1C1C] gap-7.5 overflow-y-auto no-scrollbar scroll-smooth">
      <div className="px-5 pb-5 pt-7.5 bg-[#1C1C1C] sticky top-0 z-10">
        <h2 className="text-[22px] font-semibold text-white">
          {currentFolderData.length > 0 && currentFolderData[0].folder.name}
        </h2>
      </div>
      <div className="flex flex-col gap-5 ">
        {currentFolderData.map((elem) => (
          <div
            key={elem.id}
            onClick={() => setSelectedNoteId(elem.id)}
            className={`flex ${elem.id === selectedNoteId || elem.id === currSelectedNotesId ? "bg-[#FFFFFF1A]" : "bg-[#FFFFFF08]"} cursor-pointer p-5 min-h-24.5 max-h-24.5 flex-col hover:bg-[#FFFFFF1A] overflow-hidden`}>
            <h3 className="text-lg font-semibold text-white">{elem.title}</h3>
            <div className="flex flex-row gap-2.5 text-base font-semibold text-[#FFFFFF66] max-h-5">
              <h3>{new Date(elem.createdAt).toLocaleDateString("en-GB")}</h3>
              <h3>{elem.preview.slice(0, 20)}...</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Middle;
