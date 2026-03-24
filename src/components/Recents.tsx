import React, { useContext, useEffect } from 'react'
import { FileText } from 'lucide-react'
import {type folderDataType} from "../components/Folders"
import axios from 'axios'
import { UserContext } from '../context/UserContext'

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
}

const Recents: React.FC = () => {

    const { recentNotes, setRecentNotes } = useContext(UserContext);

    const recentDataAPI: string = "https://nowted-server.remotestate.com/notes/recent";

    useEffect(() => {
        const dataFetcher = async () => {
            try {
                const response = await axios.get(recentDataAPI);

                if (response.data && response.data.recentNotes) {
                    setRecentNotes(response.data.recentNotes);
                }

            } catch (error) {
                console.error(error);
            }
        };

        dataFetcher();
    }, []);

    // console.log(recentNotesData);


  return (
    <div className="flex flex-col gap-[8px] w-[300px]">
        <div className="flex pl-[20px]">
          <h5 className="text-[#FFFFFF99] text-sm">Recents</h5>
        </div>
        <div className="flex flex-col gap-[5px] w-full">
          {recentNotes.map((elem) => (
            <div key={elem.id} className="hover:bg-[#312EB5] h-[40px] w-full flex flex-row gap-[15px] items-center px-[20px] text-base text-[#FFFFFF99] hover:text-white">
            <FileText className="h-[20px] w-[20px]" />
            <h3>{elem.title}</h3>
          </div>
          ))}
          
        </div>
    </div>
  )
}

export default Recents
