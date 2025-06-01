import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ArrowLeft from "../../public/icons/arrow-left.svg";
import ArrowRight from "../../public/icons/arrow-right.svg";
// import TavelHeadingIcon from "../../public/icons/travel-section-icon.svg";
import TravelBackground01 from "../../public/Images/travel-section-bg-1.jpg";

const medicalTourismPackages = [
    {
        title: "Homestay Services",
        description: "Comfortable and caring environment for medical tourists.",
        image: "/Images/Home-stay-service-01.jpg",
    },
    {
        title: "Rental Service and Medical Hub",
        description: "Comfortable and caring environment for medical tourists.",
        image: "/Images/Home-stay-service-03.jpg",
    },
    {
        title: "Non-emergency Cab Services",
        description: "Reliable transportation for all your medical appointments.",
        image: "/Images/Home-stay-service-02.jpg",
    },
    {
        title: "Arogyabandhan",
        description: "Arogyabandhan: Strengthening health bonds for a happier, healthier future.",
        image: "/Images/Home-stay-service-03.jpg",
    },
];

const MedicalTourismSection = () => {
    return (
        <section className="bg-[#53974A80] py-12 px-6">
            <div className="max-w-[1440px] mx-auto">
                <h2 className="lg:text-6xl text-3xl font-bold text-black mb-10">
                    <span className="text-[#011A4D]">Health Meets Travel:</span>
                    <span className="inline-flex gap-6 text-[#086A16]">Redefining Medical Tourism</span>
                </h2>
                <div className="flex items-center gap-3">
                    <div className="max-w-[850px] w-full">
                        <div className="relative">
                            {/* Swiper Slider */}
                            <div className="max-w-[760px] mx-auto">
                                <Swiper
                                    modules={[Navigation]}
                                    spaceBetween={20}
                                    slidesPerView={1}
                                    breakpoints={{
                                        768: { slidesPerView: 1 },
                                    }}
                                    navigation={{
                                        nextEl: ".swiper-button-next",
                                        prevEl: ".swiper-button-prev",
                                    }}

                                    className="py-6"
                                >
                                    {medicalTourismPackages.map((item, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="bg-[#E8F3FF] rounded-xl shadow-lg overflow-hidden flex items-start gap-6 p-5 m-6">
                                                <img src={item.image} alt={item.title} className="w-full max-h-[260px] h-full object-cover rounded-lg" />
                                                <div className="mt-12">
                                                    <h4 className="font-bold text-xl mb-3 text-[#011A4D]">{item.title}</h4>
                                                    <p className="text-[#4A4A4A] mt-2">{item.description}</p>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                            {/* Navigation Buttons */}
                            <button className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 bg-[#011A4D] transition-all shadow-md rounded-lg !w-12 !h-12 hover:bg-black p-0 after:hidden">
                                <img src={ArrowLeft} alt="" />
                            </button>
                            <button className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 bg-[#011A4D] transition-all shadow-md rounded-lg !w-12 !h-12 hover:bg-black p-0 after:hidden">
                                <img src={ArrowRight} alt="" />
                            </button>
                        </div>
                    </div>
                    <div className="rounded-lg overflow-hidden">
                        <img src={TravelBackground01} alt="" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MedicalTourismSection;
