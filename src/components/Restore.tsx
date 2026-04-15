import { History } from "lucide-react";
import React, { useContext, useState } from "react";
import type { recentData } from "./Recents";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

type recentProps = {
  note: recentData | null;
  setShowRestore: React.Dispatch<React.SetStateAction<boolean>>;
  setRefreshNotes: React.Dispatch<React.SetStateAction<number>>;
};

const Restore: React.FC<recentProps> = ({
  note,
  setRefreshNotes,
  setShowRestore,
}) => {
  const { setActiveView, setCurrSelectedFolderId, setFolderData } =
    useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Restore functionality if the Trash is Opened
  const handleRestore = async () => {
    if (!note || loading) {
      return;
    }

    try {
      setLoading(true);
      await api.post(`/notes/${note.id}/restore`, { deletedAt: null });
      const response = await api.get("/folders");
      setFolderData(response.data.folders);

      setShowRestore(false);
      setCurrSelectedFolderId(note.folderId);
      setActiveView("folder");
      setRefreshNotes((prev) => prev + 1);
      toast.success("Note restored successfully!");
      navigate(`/trash`);
    } catch (error) {
      console.error("Restore failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-12.5 text-(--mainText) w-[calc(100%-650px)] h-screen items-center justify-center">
      <div className="flex flex-col gap-2.5 items-center justify-center">
        <History className="h-10 w-10 stroke-1" />

        <h3 className="text-[28px] font-semibold text-center">
          Restore “{note?.title}”
        </h3>

        <div className="flex flex-col gap-5 items-center">
          <div className="w-120 h-9.75">
            <h5 className="text-base font-normal text-center text-(--folderTextColor)">
              Don't want to lose this note? It's not too late! Just click the
              'Restore' button and it will be added back to your list.
            </h5>
          </div>
          <button
            onClick={handleRestore}
            disabled={loading}
            className={`w-27.75 h-10.5 rounded-md text-base font-normal cursor-pointer ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#312EB5] hover:opacity-90"}`}
          >
            {loading ? "Restoring..." : "Restore"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Restore;
