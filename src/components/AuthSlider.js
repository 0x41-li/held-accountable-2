import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export default function AuthSlider({ slides }) {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const startX = useRef(0);
  const endX = useRef(0);
  const isDragging = useRef(false);
  const startTime = useRef(0);

  const handlePointerDown = (e) => {
    e.preventDefault();
    isDragging.current = true;
    startX.current = e.clientX;
    endX.current = e.clientX;
    startTime.current = Date.now();

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    endX.current = e.clientX;
  };

  const handlePointerUp = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    isDragging.current = false;

    const diff = startX.current - endX.current;
    const swipeDistance = Math.abs(diff);
    const swipeDuration = Date.now() - startTime.current;

    const minSwipeDistance = 30;
    const maxTapDuration = 300;

    if (swipeDuration < maxTapDuration && swipeDistance < minSwipeDistance) {
      return;
    }

    if (swipeDistance > minSwipeDistance) {
      if (diff > minSwipeDistance) {
        nextSlide();
      } else if (diff < -minSwipeDistance) {
        prevSlide();
      }
    }
  };

  const handlePointerCancel = (e) => {
    isDragging.current = false;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="bg-blue w-full h-full rounded-bl-[40px] md:rounded-2xl flex flex-col justify-center items-center overflow-hidden select-none pt-[20px]">
      <div
        className="flex transition-transform duration-500 w-full"
        style={{
          transform: `translateX(-${current * 100}%)`,
          touchAction: "none",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        id="slider-container"
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 flex flex-col justify-center items-center select-none"
          >
            <Image
              src={slide.img}
              className="w-[60%] object-cover md:w-[80%] max-w-none select-none"
              draggable={false}
              alt="slide image"
              width={400}
              height={400}
              loading="eager"
              unoptimized
            />
            <div className="flex flex-col items-center text-center text-white gap-0 md:gap-[8px] max-w-[456px] m-auto px-[10px]">
              <div className="flex items-center gap-[8px]">
                <Image
                  src="/images/logo.png"
                  className="flex md:hidden w-[47px]"
                  alt="slide image"
                  height={47}
                  width={47}
                  unoptimized
                />
                <p className="font-bold text-[18px] md:text-[24px]">
                  {slide.title}
                </p>
              </div>
              <span className="opacity-[77%] text-[12px] md:text-[16px]">
                {slide.desc}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-[8px] md:mt-[32px] mb-[16px] flex items-center gap-[50px]">
        <button
          onClick={prevSlide}
          className="hidden md:flex text-white text-2xl w-[24px]"
        >
          ‹
        </button>
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-[6px] md:w-[10px] h-[6px] md:h-[10px] rounded-full transition 
                  ${current === index ? "bg-white" : "bg-white/40"}`}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          className="hidden md:flex text-white text-2xl w-[24px]"
        >
          ›
        </button>
      </div>
    </div>
  );
}
