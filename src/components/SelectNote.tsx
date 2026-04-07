import { FileText } from "lucide-react";
import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

const SelectNote: React.FC = () => {

    const {mode} = useContext(UserContext);

  return (
    <div className={`flex flex-col gap-7.5 p-12.5 text-(--primary-font)${mode ? " text-white" : " text-black"} w-[calc(100%-650px)] h-screen items-center justify-center`}>
      <div className="flex flex-col gap-10px items-center justify-center">
        <FileText className="h-20 w-20 stroke-1" />
        <h3 className="text-[28px] font-semibold">Select a note to view</h3>
        <div className="flex w-115 h-9.75">
          <h5 className={`text-base font-normal text-center ${mode ? "text-[#FFFFFF99]" : "text-[#494646]"}`}>
            Choose a note from the list on the left to view its contents, or
            create a new note to add to your collection.
          </h5>
        </div>
      </div>
    </div>
  );
};

export default SelectNote;
