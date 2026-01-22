"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Link from "next/link";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ServiceSlider({ services }) {
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        navigation={{
          prevEl: ".swiper-button-prev-custom",
          nextEl: ".swiper-button-next-custom",
        }}
        pagination={{
          clickable: true,
          el: ".swiper-pagination-custom",
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1280: {
            slidesPerView: 4,
          },
        }}
        className="!pb-12"
      >
        {services.map((service) => (
          <SwiperSlide key={service._id}>
            <div className="relative h-[380px] rounded-2xl overflow-hidden group cursor-pointer shadow-lg">
              {/* Background Image */}
              <img
                src={service.image}
                alt={service.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                {/* Title */}
                <h3 className="text-xl font-semibold text-white drop-shadow-lg">
                  {service.name}
                </h3>

                {/* Bottom */}
                <div className="flex items-center justify-between">
                  {service.isComingSoon ? (
                    <>
                      <span className="px-3 py-1 bg-yellow-400 text-secondary text-xs font-bold rounded-full">
                        Coming Soon
                      </span>
                      <span className="text-white/80 text-sm flex items-center gap-1">
                        Learn More
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                          />
                        </svg>
                      </span>
                    </>
                  ) : (
                    <Link
                      href={
                        service.isAvailable
                          ? `/get-started?service=${service._id}`
                          : "#"
                      }
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-secondary text-sm font-medium rounded-full hover:bg-white transition-colors shadow-md"
                    >
                      Learn More
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation */}
      <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-secondary hover:bg-white transition-colors -ml-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-secondary hover:bg-white transition-colors -mr-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

      {/* Custom Pagination */}
      <div className="swiper-pagination-custom flex justify-center gap-2 mt-4" />

      {/* Custom Styles */}
      <style jsx global>{`
        .swiper-pagination-custom .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #d1d5db;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .swiper-pagination-custom .swiper-pagination-bullet-active {
          background: var(--color-primary, #c4a962);
          width: 24px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
