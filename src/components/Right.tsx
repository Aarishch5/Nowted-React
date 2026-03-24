import { Trash, CalendarDays, CircleEllipsis, Folder, Star, Archive } from "lucide-react";
import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Right: React.FC = () => {


        const {toggle, setToggle} = useContext(UserContext);

  return (
    <div className="flex flex-col gap-[30px] p-[50px] text-[#FFFFFF] w-[calc(100%-650px)] h-screen">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-[32px]">Reflection of the Month of June</h1>
        <CircleEllipsis onClick={(e) => {e.stopPropagation();setToggle(prev => !prev);}} 
        className={`h-[30px] w-[30px] text-[#FFFFFF99] hover:text-white cursor-pointer`} />

        {/* menu  */}
        <div onClick={(e) => e.stopPropagation()} className={`absolute top-[101px] right-[51px] rounded-md z-50 ${toggle ? "block" : "hidden"}`}>
            <div className="flex flex-col w-[202px] gap-[20px] p-[20px] bg-[#333333] overflow-hidden rounded-md shadow-lg border border-white/10">
                <div className="flex flex-col gap-[15px] ">
            <div className="text-white flex flex-row gap-[15px] rounded items-center cursor-pointer hover:bg-[#FFFFFF1A] p-[3px]">
                <Star className="w-[20px] h-[20px]"/>
                <h3 className="font-normal font-base text-base">Add to favorite</h3>
            </div>
            <div className="text-white flex flex-row gap-[15px] items-center cursor-pointer hover:bg-[#FFFFFF1A] p-[3px]">
                <Archive className="w-[20px] h-[20px]"/>
                <h3 className="font-normal font-base text-base">Archived</h3>
            </div>
            </div>


            <hr className="h-[1px] bg-[#FFFFFF1A] border-0" />

            <div className="text-white flex flex-row gap-[15px] items-center cursor-pointer hover:bg-[#FFFFFF1A] p-[3px]">
                <Trash className="w-[20px] h-[20px]"/>
                <h3 className="font-normal font-base text-base">Delete</h3>
            </div>
            </div>

        </div>
      </div>

      <div className="flex flex-col w-full h-[67px] justify-between">
        <div className="flex flex-row gap-[8px] items-start">
          <div className="w-[30px] flex items-start">
            <CalendarDays className="w-[18px] h-[18px] text-[#FFFFFF99]" />
          </div>
          <div className="w-[100px]">
            <h3 className="text-sm text-[#FFFFFF99] font-semibold">Date</h3>
          </div>
          <div>
            <h3 className="text-sm text-white font-semibold underline">
              21/06/2022
            </h3>
          </div>
        </div>
        <hr className="h-[1px] bg-[#FFFFFF1A] border-0" />
        <div className="flex flex-row gap-[8px] items-start">
          <div className="w-[30px] flex items-start">
            <Folder className="w-[18px] h-[18px] text-[#FFFFFF99]" />
          </div>
          <div className="w-[100px]">
            <h3 className="text-sm text-[#FFFFFF99] font-semibold">Folder</h3>
          </div>
          <div>
            <h3 className="text-sm text-white font-semibold underline">
              Personal
            </h3>
          </div>
        </div>
      </div>

      <div>
        <p className="text-justify text-base font-normal text-white">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. A magnam
          modi eius iusto, voluptates, labore aut alias iure corporis aliquam
          asperiores maxime molestias! Iure at, nobis nostrum ex ducimus
          accusantium quam iste quos voluptates rem assumenda minus? Soluta quae
          unde vel qui repellat ab quo in? Deserunt quaerat sapiente blanditiis
          fugit nobis voluptatibus similique sequi totam, reiciendis, aliquam
          unde possimus enim veniam numquam fuga distinctio natus tempore. Vero,
          animi quas! 
            <br />
            <br />
                    Soluta facilis vero perferendis quas. Qui, suscipit cum
          consectetur fugit assumenda, incidunt, distinctio recusandae
          perferendis veniam possimus nesciunt odio atque! Eaque, reiciendis
          natus nulla corrupti ratione consectetur ut quaerat fuga? Lorem ipsum,
          dolor sit amet consectetur adipisicing elit. Eligendi placeat vel
          voluptatum suscipit cupiditate? Voluptatum dignissimos aspernatur qui
          blanditiis dolorum?

            <br />
            <br />
                    Soluta facilis vero perferendis quas. Qui, suscipit cum
          consectetur fugit assumenda, incidunt, distinctio recusandae
          perferendis veniam possimus nesciunt odio atque! Eaque, reiciendis
          natus nulla corrupti ratione consectetur ut quaerat fuga? Lorem ipsum,
          dolor sit amet consectetur adipisicing elit. Eligendi placeat vel
          voluptatum suscipit cupiditate? Voluptatum dignissimos aspernatur qui
          blanditiis dolorum?
        </p>
      </div>
    </div>
  );
};

export default Right;




