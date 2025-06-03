import React from "react";
import { FaUmbrellaBeach } from "react-icons/fa";
import { GiTempleGate } from "react-icons/gi";
import { PiHouseLineBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import InnerBanner from "../components/InnerBanner";
import InnerBannerImage from "../../public/Images/inner-banner-image.jpg";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NeedHelp from "../components/NeedHelp";
import TravelTips from "../components/TravelTips";

const experiences = [
  {
    title: "Leisure Tour",
    description: "Relax and unwind at beautiful beaches and serene locations",
    icon: FaUmbrellaBeach,
    places: ["Goa", "Kerala"],
    image: "https://i.imgur.com/WxNKZs0.jpg",
  },
  {
    title: "Religious Tourism",
    description: "Explore sacred sites and spiritual destinations",
    icon: GiTempleGate,
    places: ["Varanasi", "Tirupati"],
    image: "https://i.imgur.com/AEnTXvb.jpg",
  },
  {
    title: "Rural Tourism",
    description: "Experience authentic village life and traditions",
    icon: PiHouseLineBold,
    places: ["Rajasthan Villages", "Gujarat Crafts"],
    image: "https://i.imgur.com/kGS6tUp.jpg",
  },
];

const TravelExperience = () => {
  return (
    <>
      <Navbar />
      <InnerBanner
        backgroundImage={InnerBannerImage}
        title="Our Tour Programs"
      />
      <div className="min-h-screen bg-blue-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="xl:text-[50px] font-bold text-[#011A4D] leading-none">Choose Your</h1>
          <h1 className="xl:text-[50px] font-bold text-[#011A4D] leading-none mb-4">Travel Experience</h1>
          <p className="text-gray-700 mb-8 max-w-2xl">
            Embark on a journey through India's diverse landscapes, rich culture, and timeless traditions. Select from our carefully curated collection of unique travel experiences.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {experiences.map((exp, index) => {
              const Icon = exp.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl shadow-md overflow-hidden bg-white min-h-[400px] hover:shadow-lg transition-shadow duration-300"
                >
                  <div
                    className="h-[250px] bg-cover bg-center"
                    style={{ backgroundImage: `url(${exp.image})` }}
                  >
                    <div className="h-full w-full flex items-center justify-center flex-col backdrop-brightness-50">
                      <div className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full">
                        <Icon className="text-white text-2xl bg-[#D95697] p-2 w-[50px] h-[50px] rounded-xl" />
                        <span className="text-white xl:text-xl font-bold text-md">{exp.title}</span>
                      </div>
                      <p className="text-white max-w-[290px] mx-auto text-center">{exp.description}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center lg:gap-3.5 gap-1.5 mb-4 py-6 border-b border-gray-200">
                      {exp.places.map((place, i) => (
                        <span
                          key={i}
                          className="text-sm text-[#D95697] font-medium"
                        >
                          {place}
                        </span>
                      ))}
                      <span className="text-sm bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                        +1
                      </span>
                    </div>
                    <Link className="flex items-center justify-between w-full text-sm text-gray-600 font-medium gap-1">
                      Explore destinations
                      <span className="text-white bg-[#D95697] w-[20px] h-[20px] rounded-full flex items-center justify-center">→</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <TravelTips />
      <NeedHelp className="!mt-0" />
      <Footer />
    </>
  );
};

export default TravelExperience;