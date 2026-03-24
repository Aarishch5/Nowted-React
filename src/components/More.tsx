import React from 'react'
import { Star, Trash, Archive } from 'lucide-react'

const More: React.FC = () => {
  return (
    <div className="flex flex-col gap-[8px] w-[300px]">
        <div className="flex px-[20px] justify-between items-center">
          <h5 className="text-[#FFFFFF99] text-sm">More</h5>
        </div>
        <div className="flex flex-col gap-[5px] w-full">
          <div className="hover:bg-[#FFFFFF08] h-[40px] w-full flex flex-row gap-[15px] items-center px-[20px] text-[#FFFFFF99] hover:text-white">
            <Star className="h-[20px] w-[20px]" />
            <h3 className="text-base">Favourites</h3>
          </div>
          <div className="group h-[40px] w-full flex flex-row gap-[15px] items-center px-[20px] text-[#FFFFFF99] hover:bg-[#FFFFFF08] hover:text-white text-base">
            <Trash className="h-[20px] w-[20px] text-[#FFFFFF99] group-hover:text-white transition" />
            <h3>Trash</h3>
          </div>
          <div className="h-[40px] w-full flex flex-row gap-[15px] items-center px-[20px] hover:bg-[#FFFFFF08] text-base text-[#FFFFFF99] hover:text-white">
            <Archive className="h-[20px] w-[20px]" />
            <h3 className="">Archived</h3>
          </div>
        </div>
    </div>
  )
}

export default More
