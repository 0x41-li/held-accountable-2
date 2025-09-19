"use client";
import Image from "next/image";
import React from "react";
import { Icon } from "@iconify/react";

function SectionTitle({ title, subtitle, className }) {
  const [firstWord, ...restWords] = title.split(" ");

  return (
    <>
      <p className="font-semibold text-3xl md:text-5xl leading-[31px] tracking-[-0.02em]">
        {firstWord} <span className="text-blue">{restWords}</span>{" "}
      </p>
      <span className={`md:text-xl text-[#535862] mt-3 md:mt-5 ${className}`}>
        {subtitle}
      </span>
    </>
  );
}

export default function AboutUs() {
  const ourVision = [
    "Vision title for future.",
    "Vision title number 2 for future.",
    "Vision title goes here.",
    "Vision title number 4 for future.",
  ];

  const coreValues = [
    {
      icon: "hugeicons:message-multiple-02",
      title: "Share team inboxes",
      descr: "Whether you have a team of 2, our shared team inboxes.",
    },
    {
      icon: "hugeicons:message-multiple-02",
      title: "Share team inboxes",
      descr: "Whether you have a team of 2, our shared team inboxes.",
    },
    {
      icon: "hugeicons:message-multiple-02",
      title: "Share team inboxes",
      descr: "Whether you have a team of 2, our shared team inboxes.",
    },
    {
      icon: "hugeicons:message-multiple-02",
      title: "Share team inboxes",
      descr: "Whether you have a team of 2, our shared team inboxes.",
    },
    {
      icon: "hugeicons:message-multiple-02",
      title: "Share team inboxes",
      descr: "Whether you have a team of 2, our shared team inboxes.",
    },
    {
      icon: "hugeicons:message-multiple-02",
      title: "Share team inboxes",
      descr: "Whether you have a team of 2, our shared team inboxes.",
    },
  ];

  return (
    <div className="flex flex-col mt-3 pb-12 lg:pb-24 overflow-x-hidden md:border-l border-t border-secondary md:rounded-tl-[40px]">
      <div className="bg-[#FCFCFD py-4 lg:pt-8 lg:pb-5 px-6 mb-7 md:mb-14 border-b border-secondary">
        <p className="font-semibold text-xl lg:text-[30px]">About Us</p>
      </div>
      <div className="max-w-[1409px] mx-auto w-full flex flex-col items-center px-4 md:px-8">
        <div className="flex flex-col items-center text-center w-full">
          <SectionTitle
            title="Our Story"
            subtitle="We’re a 100% remote team spread all across the world. Join us!"
            className="mb-6 md:mb-10"
          />
          <div className="max-h-[536px] h-full w-[90%] relative aspect-video">
            <iframe
              src="https://player.vimeo.com/video/1120069891?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479;muted=1&amp;loop=1&amp;autoplay=1&amp;background=1"
              width="100%"
              height="100%"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Truth in Every Headline_ Transparency You Can Trust"
            />
          </div>
        </div>

        <div className="flex flex-col items-center mt-10 py-8 lg:py-14 w-full mb-6 lg:mb-20 gap-[60px] md:gap-[100px] lg:gap-[180px]">
          <div className="flex flex-col-reverse xl:flex-row items-center w-full justify-between gap-14 py-15 relative">
            <Image
              src="/images/aboutPage/About1.png"
              alt="About Us Image 1"
              width={430}
              height={360}
              className="max-w-[80%] xl:!max-w-[50%] !w-full"
            />
            <div className="flex flex-col xl:max-w-[409px] w-full text-left">
              <SectionTitle
                title="Our Mission"
                subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid
                pariatur, ipsum dolor. Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Lorem ipsum dolor sit amet consectetur
                adipisicing elit"
              />
            </div>

            <p className="absolute bottom-[-10%] xl:bottom-[-32%] right-0 xl:right-[-9%] text-[120px] md:text-[180px] xl:text-[252px] font-semibold  bg-gradient-to-r from-[#4DA9FF] via-[#63B8FF] to-[#0A99FF] bg-clip-text text-transparent opacity-[0.1]">
              Mission
            </p>
          </div>

          <div className="flex flex-col xl:flex-row items-center w-full justify-between gap-14 py-15 relative">
            <div className="flex flex-col xl:max-w-[409px] w-full text-left">
              <SectionTitle
                title="Our Vision"
                subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid
                pariatur, ipsum dolor. Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Lorem ipsum dolor sit amet consectetur
                adipisicing elit"
              />

              <ul className="mt-2">
                {ourVision.map((item, index) => (
                  <li key={index} className="flex items-center mt-2 gap-2">
                    <Icon
                      icon="material-symbols:done"
                      width="20"
                      height="20"
                      className="text-[#00C34B]"
                    />
                    <span className="text-sm lg:text-xl text-[#535862]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <Image
              src="/images/aboutPage/About2.png"
              alt="About Us Image 1"
              width={430}
              height={360}
              className="max-w-[80%] xl:!max-w-[50%] !w-full mt-auto"
            />
            <p className="absolute bottom-[-10%] xl:bottom-[-52%] left-0 xl:left-[-15%] text-[120px] md:text-[180px] xl:text-[252px] font-semibold  bg-gradient-to-r from-[#4DA9FF] via-[#63B8FF] to-[#0A99FF] bg-clip-text text-transparent opacity-[0.1]">
              Mission
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center text-center w-full mt-4 lg:mt-14">
          <SectionTitle
            title="Core Values"
            subtitle="We’re a 100% remote team spread all across the world. Join us!"
          />
          <div className="mt-2 lg:mt-16 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16">
            {coreValues.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className=" border-[#D5D7DA] rounded-lg border-[1px] w-12 h-12 flex items-center justify-center">
                  <Icon
                    icon={item.icon}
                    className="text-[#414651]"
                    width={24}
                    height={24}
                  />
                </div>
                <p className="font-semibold text-lg text-[#181D27] mt-2 lg:mt-4 mb-2">
                  {item.title}
                </p>
                <span className="text-md text-[#535862]">{item.descr}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
