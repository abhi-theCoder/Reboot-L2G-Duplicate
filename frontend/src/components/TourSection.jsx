"use client";

import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ArrowLeft from "../../public/icons/arrow-left.svg";
import ArrowRight from "../../public/icons/arrow-right.svg";

const tourPackages = [
  {
    title: "Low Budget Tour",
    description: "Experience amazing destinations without breaking the bank.",
    image: "/Images/place-01.jpg",
    icon: "/icons/low-tour.svg",
    bgColor: "bg-blue-100",
  },
  {
    title: "Standard Tour",
    description: "Perfect balance of comfort and adventure.",
    image: "/Images/place-02.jpg",
    icon: "/icons/standard-tour.svg",
    bgColor: "bg-green-100",
  },
  {
    title: "Premium Tour",
    description: "Tailored luxury experiences for the discerning traveler.",
    image: "/Images/place-03.jpg",
    icon: "/icons/Premium-tour.svg",
    bgColor: "bg-orange-100",
  },
];

const TourSection = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="bg-blue-50 py-12 px-6">
      <div className="max-w-[1440px] mx-auto">
        <h2 className="lg:text-6xl text-3xl font-bold text-black mb-10">
          <span className="text-[#011A4D]">Leisure Adventures:</span> <br /> <span className="text-[#086A16]">Travel at Your Own Pace</span>
        </h2>

        <div className="relative">
          <div className="px-[10vh]">
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              navigation={false}
              onInit={(swiper) => {
                if (swiper.params.navigation && typeof swiper.params.navigation !== "boolean") {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                  swiper.navigation.init();
                  swiper.navigation.update();
                }
              }}
              className="py-6"
            >
              {tourPackages.map((tour, index) => (
                <SwiperSlide key={index}>
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden min-h-[380px] mb-4">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="w-full max-h-[270px] object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-start gap-2">
                        <span className="rounded-full pt-[5px] shrink-0">
                          <img src={tour.icon} alt="" />
                        </span>
                        <div>
                          <h4 className="font-bold capitalize text-[20px] text-[#011A4D]">
                            {tour.title}
                          </h4>
                          <p className="text-[#4A4A4A] mt-2 text-[15px]">{tour.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourSection;
