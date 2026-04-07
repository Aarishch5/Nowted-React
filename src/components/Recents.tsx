import React, { useContext, useEffect } from "react";
import { FileText } from "lucide-react";
import { type folderDataType } from "../components/Folders";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";

export type recentData = {
  id: string;
  folderId: string;
  title: string;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  preview: string;
  folder: folderDataType;
};

const Recents: React.FC = () => {
  const { recentNotes, setRecentNotes, mode} = useContext(UserContext);
  const navigate = useNavigate();
  const { noteId } = useParams();
  const recentDataAPI = "https://nowted-server.remotestate.com/notes/recent";

  useEffect(() => {
    const dataFetcher = async () => {
      try {
        const response = await axios.get(recentDataAPI);
        if (response.data?.recentNotes) { 
          setRecentNotes(response.data.recentNotes)
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
        <h5 className={`${mode ? "text-[#FFFFFF99]" : "text-black"} text-sm`}> Recents</h5>
      </div>

      <div className="flex flex-col gap-1.25 w-full">
        {recentNotes.map((elem) => (
          <div key={elem.id}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/folder/${elem.folderId}/note/${elem.id}`);
            }}
            className={`${mode ? "hover:bg-[#312EB5]" : "hover:bg-gray-200"} h-10 w-full flex gap-3.75 cursor-pointer items-center px-5 text-base ${
              elem.id === noteId ? mode ? "bg-[#312EB5] text-white" : "bg-gray-200 text-black" : mode ? "text-[#FFFFFF99]" : "text-black"
            } ${mode ? "hover:text-white" : "hover:text-[#3a2e2e]"}`}>
            <FileText className="h-5 w-5" />
            <h3>{elem.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recents;