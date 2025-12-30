"use client";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

export default function PremiumModal({ show, hideDialog }) {
  const router = useRouter();

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#2B425B] bg-opacity-30 backdrop-blur-sm"
        onClick={hideDialog}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={hideDialog}
          className="absolute top-4 right-4 z-10 text-[#98A2B3] hover:text-[#2b425b] transition-colors"
        >
          <Icon icon="mdi:close" width={24} height={24} />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center p-8 pt-12">
          {/* Crown Icon */}
          <div className="w-20 h-20 bg-[#3D83FF] rounded-full flex items-center justify-center mb-6">
            <Icon icon="mdi:crown" width={48} height={48} className="text-white" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-[#101828] text-center mb-4">
            This category is only visible to premium users
          </h2>
          
          {/* Subtitle */}
          <p className="text-base text-[#475467] text-center mb-8">
            Upgrade your account to use this feature.
          </p>

          {/* Benefits Section */}
          <div className="w-full mb-8">
            <h3 className="text-lg font-semibold text-[#2B425B] mb-4">Benefits</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Icon icon="mdi:share-variant" width={24} height={24} className="text-[#3D83FF]" />
                <span className="text-[#2B425B]">Share narratives on headlines</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon icon="mdi:lock" width={24} height={24} className="text-[#3D83FF]" />
                <span className="text-[#2B425B]">Fast, simple and secure</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon icon="mdi:currency-btc" width={24} height={24} className="text-[#3D83FF]" />
                <span className="text-[#2B425B]">Earn money on blockchain</span>
              </div>
            </div>
          </div>

          {/* Subscribe Button */}
          <button
            onClick={() => {
              hideDialog();
              router.push("/app/subscription");
            }}
            className="w-full gradient-button text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Icon icon="mdi:star" width={20} height={20} />
            Subscribe to Premium
          </button>
        </div>
      </div>
    </div>
  );
}

