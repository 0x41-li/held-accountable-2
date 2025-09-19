'use client'
import SectionTitle from "@/components/common/SectionTitle";
import React, { useState } from "react";

export default function Snapshots() {
  const [searchValue,setSearchValue] = useState('')
  return (
    <div className="flex flex-col md:mt-3 border-l border-t border-[#E4E7EC] md:rounded-tl-3xl h-full">
      <SectionTitle title='Viral Detection' subtitle='The latest trends around the world, right in your sight.' input value={searchValue} setValue={setSearchValue}/>

    </div>
  );
}
