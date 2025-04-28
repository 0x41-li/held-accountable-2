import { Icon } from "@iconify/react";
import { useRef, useState } from "react";

export default function CreateArticle({show, hideDialog, onSave}) {
    const [data, setData] = useState({ title: "", content: "", image: "", category: ""});
    const fileRef = useRef(null);
    
    if (!show)
        return "";

    const handleReset = () => {setData({ title: "", content: "", image: "", category: ""});}
    const handleChangeTitle = (title) => setData({...data, title});
    const handleChangeCategory = (category) => setData({...data, category});
    const handleChangeContent = (content) => setData({...data, content});
    const handleSelectImage = () => {
        fileRef.current.click();
    }
    const handleUploadImage = (e) => {
        let formData = new FormData();
        formData.append("key", "60d2ec5533289541d56128c844b52204");
        formData.append("image", e.target.files[0]);
        fetch("https://api.imgbb.com/1/upload", {
            method: "POST",
            body: formData
        }).then(res => res.json())
        .then(res => {
            console.log(res);
            setData({ ...data, image: res.data.image.url });
        });
    }
    const handleClearImage = () => {
        fileRef.current.value = '';
        setData({
            ...data,
            image: ""
        });
    }

    return <div>
        <div id="default-modal" tabIndex="-1" className="flex bg-[#000000cc] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow-sm">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                        <div className="flex gap-[16px] items-center">
                            <img src="/images/modal_icon.png" />
                            <div className="flex flex-col gap-[4px]">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Create New Poll
                                </h3>
                                <div className="text-[#475467] text-[14px] leading-[20px]">Add one or more questions.</div>
                            </div>
                        </div>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="default-modal" onClick={() => hideDialog()}>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-4 md:p-5 space-y-4">
                        <div className="flex flex-col gap-[16px]">
                            <div className="flex gap-[32px] items-center">
                                <span className="w-[160px] text-[14px] leading-[20px]">Article Title</span>
                                <input className="border border-primary outline-none rounded-[8px] w-[448px] py-[10px] px-[14px]" placeholder="Enter the article title" type="text" value={data.title} onChange={(e) => handleChangeTitle(e.target.value)} />
                            </div>
                            <div className="flex gap-[32px] items-center">
                                <span className="w-[160px] text-[14px] leading-[20px]">Header Image</span>
                                <input type="file" className="hidden" ref={fileRef} onChange={(e) => handleUploadImage(e)} />
                                <div className="border border-primary outline-none rounded-[8px] w-[448px] py-[10px] px-[14px] flex gap-[10px] items-center text-[#8890A5] cursor-pointer" onClick={handleSelectImage}>
                                    <Icon icon="hugeicons:image-03" />
                                    Select or upload image
                                </div>
                            </div>
                            {data.image ? <div className="w-[200px] rounded-[8px] border border-secondary p-2 overflow-hidden m-auto relative">
                                <img src={data.image} />
                                <button onClick={() => handleClearImage()} className="rounded-full p-2 bg-[#ffffffaa] hover:bg-white border border-secondary text-[#ff0000] right-0 top-0 absolute"><Icon icon="mdi:trash-outline" /></button>
                            </div> : ""}
                            <div className="flex gap-[32px] items-center">
                                <span className="w-[160px] text-[14px] leading-[20px]">Category</span>
                                <input className="border border-primary outline-none rounded-[8px] w-[448px] py-[10px] px-[14px]" placeholder="Enter the article title" type="text" value={data.category} onChange={(e) => handleChangeCategory(e.target.value)} />
                            </div>
                            <div className="flex gap-[32px] items-center">
                                <span className="w-[160px] text-[14px] leading-[20px]">Main Text</span>
                                <textarea className="border border-primary outline-none rounded-[8px] w-[448px] py-[10px] px-[14px]" placeholder="Type the question of the polls here" value={data.content} onChange={(e) => handleChangeContent(e.target.value)}>
                                </textarea>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b gap-[12px]">
                        <button type="button" className="flex-1 py-[10px] rounded-[8px] border border-secondary font-semibold text-[16px] leading-[24px]" onClick={() => hideDialog()}> Discard and Back </button>
                        <button type="button" className="flex-1 py-[10px] rounded-[8px] border border-secondary font-semibold text-[16px] leading-[24px] text-white bg-blue" onClick={() => onSave(data)}> Confirm the Article </button>
                    </div>
                </div>
            </div>
        </div>
    </div>;    
}