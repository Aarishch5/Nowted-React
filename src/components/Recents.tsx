import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { type folderDataType } from "../components/Folders";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

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

type recentsProps = {
  refreshRecents: number;
}



const Recents: React.FC<recentsProps> = ({refreshRecents}) => {

  const [recentNotes, setRecentNotes] = useState<recentData[]>([]);
  
  const navigate = useNavigate();
  const { noteId } = useParams();
  

  
  useEffect(() => {
    const dataFetcher = async () => {
      try {
        let filteredNotes: recentData[];
        const response = await api.get("/notes/recent");
        if (response.data?.recentNotes) { 
          filteredNotes = response.data.recentNotes.filter(
          (note: recentData) => note.deletedAt === null);

          setRecentNotes(filteredNotes)
        }
      } catch (error) {
        console.error(error);
      }
    };

    dataFetcher();
  }, [refreshRecents]);

  return (
    <div className="flex flex-col gap-2 w-75">
      <div className="flex pl-5">
        <h5 className="text-(--mainText) text-sm"> Recents</h5>
      </div>

      <div className="flex flex-col gap-1.25 w-full">
        {recentNotes.map((elem) => (
          <div key={elem.id}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/folder/${elem.folderId}/note/${elem.id}`);
            }}
            className={`hover:bg-(--recentsHoverBg) h-10 w-full flex gap-3.75 cursor-pointer items-center px-5 text-base ${
              elem.id === noteId ? "bg-(--recentsHoverBg) text-(--mainText)" : "text-(--folderTextColor)"
            } hover:text-(--recentsHoverText)`}>
            <FileText className="h-5 w-5" />
            <h3>{elem.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recents;