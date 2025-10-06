import { Icon } from "@iconify/react";
import { useRef, useState } from "react";

export default function ShareModal({show, hideDialog, data}) {
  const [copied, setCopied] = useState(false);
  const url = `https://held-accountable.com/golden-insights/${data.id}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(data.title);

    if (!show)
        return "";

    return <div>
        <div id="default-modal" tabIndex="-1" className="flex bg-[#000000cc] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow-sm">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                        <div className="flex gap-[16px] items-center">
                            <img src="/images/modal_icon.png" />
                            <div className="flex flex-col gap-[4px]">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Share...
                                </h3>
                                <div className="text-[#475467] text-[14px] leading-[20px]">Share with your friends</div>
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
                        <div className="flex flex-col gap-4">
                            <p className="p-2 rounded border">{url}</p>
                            <div className="flex gap-2 items-center justify-end">
                            <button
                                className={`border border-[#E4E7EC] rounded-lg px-3 py-2 flex items-center gap-2 text-sm bg-white transition-colors duration-200 ${
                                copied
                                    ? "text-[#3B88E3] border-[#3B88E3] bg-[#F2F4F7]"
                                    : "text-[#667085]"
                                }`}
                                onClick={() => {
                                    navigator.clipboard.writeText(url);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 1500);
                                }}
                            >
                                <Icon icon="mdi:link-variant" width={16} height={16} />
                                {copied ? "Copied" : "Copy link"}
                            </button>
                            <a 
                                href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="border border-[#E4E7EC] rounded-lg w-8 h-8 flex items-center justify-center bg-white text-[#667085]">
                                <Icon icon="ri:twitter-x-fill" width={18} height={18} />
                            </a>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="border border-[#E4E7EC] rounded-lg w-8 h-8 flex items-center justify-center bg-white text-[#667085]">
                                <Icon icon="ic:baseline-facebook" width={18} height={18} />
                            </a>
                            <a
                                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="border border-[#E4E7EC] rounded-lg w-8 h-8 flex items-center justify-center bg-white text-[#667085]">
                                <Icon icon="mdi:linkedin" width={18} height={18} />
                            </a>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b gap-[12px]">
                        <button type="button" className="flex-1 py-[10px] rounded-[8px] border border-secondary font-semibold text-[16px] leading-[24px]" onClick={() => hideDialog()}> Close </button>
                    </div>
                </div>
            </div>
        </div>
    </div>;    
}