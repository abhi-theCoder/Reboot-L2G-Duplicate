import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaClock } from "react-icons/fa";
// import { ChevronLeft, ChevronRight } from "lucide-react";

const specialOffers = [
    {
        title: "Early Bird Special",
        description: "Book 60 days in advance and save up to 40% on international flights",
        image: "/Images/offers-01.jpg",
        validity: "Valid until 2024-05-30",
        badge: "40% OFF",
    },
    {
        title: "Family Package Deal",
        description: "Special rates for family bookings with kids under 12 flying free",
        image: "/Images/offers-01.jpg",
        validity: "Valid until 2024-05-30",
        badge: "Kids Fly Free",
    },
];

const SpecialOffers = () => {
    return (
        <section className="bg-white py-12 px-6">
            <div className="max-w-[1440px] mx-auto">
                <h2 className="lg:text-6xl text-3xl font-bold text-[#011A4D] mb-10">Special Offers</h2>

                <div className="relative">
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={20}
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            1024: { slidesPerView: 2 },
                        }}
                        navigation={false}
                        className="py-6"
                    >
                        {specialOffers.map((offer, index) => (
                            <SwiperSlide key={index}>
                                <div className="bg-[#E8F3FF] rounded-xl shadow-lg overflow-hidden flex mb-6">
                                    <img
                                        src={offer.image}
                                        alt={offer.title}
                                        className="w-1/2 object-cover"
                                    />
                                    <div className="p-4 pl-5 w-1/2">
                                        <div className="flex justify-between items-center pt-[40px] relative">
                                            <h4 className="font-bold text-[#011A4D] text-xl">{offer.title}</h4>
                                            <span className="bg-[#086A16] text-white text-xs px-4 py-2 rounded-[30px] absolute top-0 right-0 max-w-fit text-center w-full font-bold">
                                                {offer.badge}
                                            </span>
                                        </div>
                                        <p className="text-[#4A4A4A] leading-none mt-2">{offer.description}</p>
                                        <div className="flex items-center text-gray-500 mt-2">
                                            <FaClock className="mr-2 text-black" />
                                            <span className="text-black">{offer.validity}</span>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default SpecialOffers;
