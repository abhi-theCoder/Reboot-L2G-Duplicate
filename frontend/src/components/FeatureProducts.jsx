import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ArrowLeft from "../../public/icons/arrow-left.svg";
import ArrowRight from "../../public/icons/arrow-right.svg";

const products = [
    {
        title: "realme Buds T310",
        description: "12.4mm Driver, 46dB ANC, Spatial Audio",
        price: "₹2,199",
        rating: "4.3",
        image: "/Images/product-img-01.png",
    },
    {
        title: "realme Buds T310",
        description: "12.4mm Driver, 46dB ANC, Spatial Audio",
        price: "₹2,199",
        rating: "4.3",
        image: "/Images/product-img-01.png",
    },
    {
        title: "realme Buds T310",
        description: "12.4mm Driver, 46dB ANC, Spatial Audio",
        price: "₹2,199",
        rating: "4.3",
        image: "/Images/product-img-01.png",
    },
    {
        title: "realme Buds T310",
        description: "12.4mm Driver, 46dB ANC, Spatial Audio",
        price: "₹2,199",
        rating: "4.3",
        image: "/Images/product-img-01.png",
    },
];

const FeaturedProductsSection = () => {
    return (
        <section className="bg-blue-50 py-12 px-6">
            <div className="max-w-[1440px] mx-auto">
                <h2 className="lg:text-6xl text-3xl font-bold text-[#011A4D] mb-16">
                    Featured Products
                </h2>

                <div className="max-w-[1300px] mx-auto">
                    <div className="relative px-[10vh]">
                        {/* Swiper Slider */}
                        <Swiper
                            modules={[Navigation]}
                            spaceBetween={20}
                            slidesPerView={1}
                            breakpoints={{
                                640: { slidesPerView: 1 },
                                768: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                            }}
                            navigation={{
                                nextEl: ".swiper-button-next",
                                prevEl: ".swiper-button-prev",
                            }}
                            className="py-6"
                        >
                            {products.map((product, index) => (
                                <SwiperSlide key={index}>
                                    <div className="bg-white rounded-xl shadow-lg overflow-hidden p-4 mb-6">
                                        <div className="relative">
                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                className="w-full max-h-[230px] h-full object-contain mb-5"
                                            />
                                            <span className="absolute top-2 right-2 bg-[#F4B41A] text-white text-sm px-2 py-1 w-[36px] h-[24px] rounded-lg font-bold leading-none flex items-center justify-center">
                                                {product.rating}
                                            </span>
                                        </div>
                                        <div className="p-4">
                                            {/* <h4 className="font-semibold">{product.title}</h4> */}
                                            <p className="text-[#3A5A40] font-medium text-xl leading-none mb-4">{product.description}</p>
                                            <div className="flex items-center justify-between">
                                                <p className="text-3xl font-bold mt-2 leading-none">{product.price}</p>
                                                <button className="mt-3 bg-[#011A4D]
                                                    max-w-[150px] w-full text-white text-xl font-bold leading-none px-4 py-3 rounded-full hover:shadow-lg">
                                                    Buy Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Navigation Buttons */}
                        <button className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 bg-[#011A4D] shadow-md rounded-lg !w-12 !h-12 hover:bg-black p-0 after:hidden">
                            <img src={ArrowLeft} alt="" />
                        </button>
                        <button className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 bg-[#011A4D] shadow-md rounded-lg !w-12 !h-12 hover:bg-black p-0 after:hidden">
                            <img src={ArrowRight} alt="" />
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default FeaturedProductsSection;
