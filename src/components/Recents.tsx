 import React, { useContext, useEffect } from "react";
import { FileText } from "lucide-react";
import { type folderDataType } from "../components/Folders";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export type recentData = {
  id: string;
  folderId: string;
  title: string;
  isFavourite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  preview: string;
  folder: folderDataType;
};

const Recents: React.FC = () => {
  const { 
    recentNotes, 
    setRecentNotes, 
    selectedRecentNotesId, 
    setSelectedRecentNotesId, 
    currSelectedNotesId, 
    setRecentFolderId 
  } = useContext(UserContext);

  const recentDataAPI = "https://nowted-server.remotestate.com/notes/recent";

  useEffect(() => {
    const dataFetcher = async () => {
      try {
        const response = await axios.get(recentDataAPI);

        if (response.data?.recentNotes) {
          setRecentNotes((prev) =>
            prev.length === 0 ? response.data.recentNotes.slice(0, 3) : prev
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    dataFetcher();
  }, []);

  return (
    <div className="flex flex-col gap-2 w-75">
      <div className="flex pl-5">
        <h5 className="text-[#FFFFFF99] text-sm">Recents</h5>
      </div>

      <div className="flex flex-col gap-1.25 w-full">
        {recentNotes.slice(0, 3).map((elem) => (
          <div
            key={elem.id}
            onClick={(e) =>{
              e.stopPropagation();
              setSelectedRecentNotesId(elem.id);
              setRecentFolderId(elem.folderId);
            }}
            className={`hover:bg-[#312EB5] h-10 w-full flex gap-3.75 cursor-pointer items-center px-5 text-base ${
              elem.id === selectedRecentNotesId && elem.id === currSelectedNotesId
                ? "bg-[#312EB5] text-white"
                : "text-[#FFFFFF99]"
            } hover:text-white`}
          >
            <FileText className="h-5 w-5" />
            <h3>{elem.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recents;