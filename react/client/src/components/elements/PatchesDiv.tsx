import React, { useEffect, useState } from 'react';
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import storage from "../../firebase";
import { AiOutlineClose } from "react-icons/ai";
import LoadingAnimationSmall from "../elements/LoadingAnimatonSmall";

interface PatchesDivProps {
    setShowDiv: (newState: string) => void;
    setPatche: (patche: string) => void
    setSideView: (side: string) => void
    side: string
}

function PatchesDiv(props: PatchesDivProps) {
    const [patches, setPatches] = useState<Array<{ url: string; name: string; }>>([]);
    const [isDataFetched, setIsDataFetched] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const folderPatchesRef = ref(storage, `patches`);
                const resPatches = await listAll(folderPatchesRef);
                const patchInfoArray = [];

                for (const itemRef of resPatches.items) {
                    try {
                        const url = await getDownloadURL(itemRef);
                        const name = itemRef.name; // Pobierz nazwę pliku
                        const patchInfo = { url, name }; // Utwórz obiekt z URL i nazwą
                        patchInfoArray.push(patchInfo); // Dodaj obiekt do tablicy
                    } catch (error) {
                        console.log(error);
                    }
                }

                setPatches(patchInfoArray);
                setIsDataFetched(true);

            } catch (error) {
                console.log(error);
                setIsDataFetched(true);
            }
        };

        fetchData();
    }, []);

    const handleClick = (patch: any) => {

        props.setSideView(props.side)
        props.setPatche(patch.name)
        props.setShowDiv("")
    }

    return (
        <div className='bg-black/50 backdrop-blur-sm fixed w-full h-screen z-20 flex justify-center items-center '>
            <div className='relative flex flex-col justify-center items-center w-[30rem] h-[35rem] bg-white dark:bg-[#757575] rounded-lg text-dark dark:text-white'>
                <AiOutlineClose onClick={() => props.setShowDiv("")} className='cursor-pointer absolute top-6 right-6' size={30} />
                {!isDataFetched ? (
                    <div className="flex justify-center items-center">
                        <LoadingAnimationSmall />
                    </div>
                ) : (
                    <div className="flex justify-center flex-wrap w-[26rem]  items-center">
                        {patches.map((patch, index) => (
                            <LazyLoadImage
                                key={patch.name}
                                onClick={() => handleClick(patch)} // Use a function
                                alt="Patche"
                                className={`h-[5rem] mr-6 mt-6 cursor-pointer hover:scale-105`}
                                src={patch.url}
                                effect="blur"
                                placeholderSrc={patch.url}
                            />
                        ))}
                    </div>
                )}


            </div>
        </div>
    );
}

export default PatchesDiv;