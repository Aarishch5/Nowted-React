import { History } from "lucide-react";
import React from "react";
import type { recentData } from "./Recents";
import axios from "axios";

type recentProps = {
  note: recentData | null;
  setShowRestore: React.Dispatch<React.SetStateAction<boolean>>;
  setRefreshNotes: React.Dispatch<React.SetStateAction<number>>;
};

const Restore: React.FC<recentProps> = ({note, setRefreshNotes, setShowRestore}) => {
  
  const handleRestore = async () => {
  if (!note) return;

  try {
    await axios.post(`https://nowted-server.remotestate.com/notes/${note.id}/restore`,
        {
          deletedAt: null,
        }
      );

      setShowRestore(false);
      setRefreshNotes((prev) => prev + 1);

    } catch (error) {
      console.error("Restore failed", error);
    }
  };


  return (
    <div className="flex flex-col p-12.5 text-[#FFFFFF] w-[calc(100%-650px)] h-screen items-center justify-center">
      <div className="flex flex-col gap-2.5 items-center justify-center">
        <History className="h-10 w-10 stroke-1" />
        <h3 className="text-[28px] font-semibold">
              Restore “{note?.title}”
        </h3>
        <div className="flex flex-col gap-5 items-center">
          <div className="w-120 h-9.75">
            <h5 className="text-base font-normal text-center text-[#FFFFFF99]">
              Don't want to lose this note? It's not too late! Just click the
              'Restore' button and it will be added back to your list. It's that
              simple.
            </h5>
          </div>
          <button
           onClick={handleRestore}
          
          className="w-27.75 h-10.5 bg-[#312EB5] text-base font-normal rounded-md cursor-pointer">
            Restore
          </button>
        </div>
      </div>
    </div>
  );
};

export default Restore;
