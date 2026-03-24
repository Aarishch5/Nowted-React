import React from "react";
import { Star, Trash, Archive } from "lucide-react";

const More: React.FC = () => {
  return (
    <div className="flex flex-col gap-2 w-75">
      <div className="flex px-5 justify-between items-center">
        <h5 className="text-[#FFFFFF99] text-sm">More</h5>
      </div>
      <div className="flex flex-col gap-1.25 w-full">
        <div className="hover:bg-[#FFFFFF08] h-10 w-full flex flex-row gap-3.75 items-center px-5 text-[#FFFFFF99] hover:text-white">
          <Star className="h-5 w-5" />
          <h3 className="text-base">Favourites</h3>
        </div>
        <div className="group h-10 w-full flex flex-row gap-3.75 items-center px-5 text-[#FFFFFF99] hover:bg-[#FFFFFF08] hover:text-white text-base">
          <Trash className="h-5 w-5 text-[#FFFFFF99] group-hover:text-white transition" />
          <h3>Trash</h3>
        </div>
        <div className="h-10 w-full flex flex-row gap-3.75 items-center px-5 hover:bg-[#FFFFFF08] text-base text-[#FFFFFF99] hover:text-white">
          <Archive className="h-5 w-5" />
          <h3 className="">Archived</h3>
        </div>
      </div>
    </div>
  );
};

export default More;
