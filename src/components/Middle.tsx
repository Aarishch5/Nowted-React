import React, { useContext, useState } from 'react'
import { UserContext } from '../context/UserContext';
import { type recentData } from './Recents';
import axios from 'axios';
import { useEffect } from 'react';


const Middle: React.FC = () => {

    const { selectedFolderId } = useContext(UserContext);
    const [currentFolderData, setCurrentFolderData] = useState<recentData[]>([]);


     useEffect(() => {
    const dataFetcher = async (selectedFolderId: string) => {
    try {
      const response = await axios.get(`https://nowted-server.remotestate.com/notes?folderId=${selectedFolderId}`);
      if (response.data && response.data.notes) {
        const notes: recentData[] = response.data.notes;
        setCurrentFolderData(notes);
        }
        
    } catch (error) {
        console.error("Error",error);
        }
    };

        if(selectedFolderId !== null){
            dataFetcher(selectedFolderId);
        }
    }, [selectedFolderId]);
    


  return (
    <div className='flex w-[350px] h-screen flex-col px-[20px] pb-[30px] bg-[#1C1C1C] gap-[30px] overflow-y-auto no-scrollbar scroll-smooth'>
      <div className='px-[20px] pb-[20px] pt-[30px] bg-[#1C1C1C] sticky top-0 z-10'>
        <h2 className='text-[22px] font-semibold text-white'>{currentFolderData.length > 0 && currentFolderData[0].folder.name}</h2>
      </div>
      <div className='flex flex-col gap-[20px] '>
            
            {currentFolderData.map((elem) => (
                <div key={elem.id} className='flex bg-[#FFFFFF08] cursor-pointer p-[20px] min-h-[98px] max-h-[98px] flex-col hover:bg-[#FFFFFF1A] overflow-hidden'>
                <h3 className='text-lg font-semibold text-white'>{elem.title}</h3>
                <div className='flex flex-row gap-[10px] text-base font-semibold text-[#FFFFFF66] max-h-[20px]'>
                    <h3>{new Date(elem.createdAt).toLocaleDateString("en-GB")}</h3>
                    <h3>{elem.preview.slice(1, 20)}...</h3>
                </div>
            </div>
            ))}
          
      </div>
      
    </div>
  )
}

export default Middle;