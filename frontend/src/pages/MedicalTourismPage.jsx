import React, { useState } from 'react';
import {
    BuildingOfficeIcon,
    HomeModernIcon,
    UserGroupIcon,
    HeartIcon,
    CalendarDaysIcon,
    CurrencyDollarIcon,
    DocumentMagnifyingGlassIcon,
    ShoppingCartIcon,
    TruckIcon,
    PhoneIcon,
    ShieldCheckIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InnerBanner from '../components/InnerBanner';

function MedicalTourismPage() {
    const [activeService, setActiveService] = useState(null);

    const services = [
        {
            id: 1,
            icon: BuildingOfficeIcon,
            title: "Hotel/Lodge Booking",
            description: "Booking with L2G partnered hotels/lodges near reputed hospitals based on affordability"
        },
        {
            id: 2,
            icon: HomeModernIcon,
            title: "Homestay Services",
            description: "L2G partnered homestays for longer stays and periodic checkups of patients"
        },
        {
            id: 3,
            icon: UserGroupIcon,
            title: "Local Coordinator",
            description: "Travel assistance to hospital and other testing centres in medical hub cities"
        },
        {
            id: 4,
            icon: HeartIcon,
            title: "Attendant Services",
            description: "Arranging Male/Female Attendant services (Aaya service) for patients"
        },
        {
            id: 5,
            icon: HeartIcon,
            title: "Nursing Services",
            description: "Arranging nursing services based on availability, location, and requirements"
        },
        {
            id: 6,
            icon: CalendarDaysIcon,
            title: "Consultation Booking",
            description: "Offline consultation booking / OPD booking support at required hospitals/clinics"
        },
        {
            id: 7,
            icon: CurrencyDollarIcon,
            title: "Cost Optimization",
            description: "Cross opinion on package costs without compromising hospital standards"
        },
        {
            id: 8,
            icon: DocumentMagnifyingGlassIcon,
            title: "Test Cost Estimates",
            description: "Estimates from 2-3 reputed clinics to reduce testing expenses"
        },
        {
            id: 9,
            icon: ShoppingCartIcon,
            title: "Medicine Discounts",
            description: "Negotiating discounts for non-emergency medicine bulk purchases"
        },
        {
            id: 10,
            icon: TruckIcon,
            title: "Intercity Cab Services",
            description: "Non-emergency intercity cab services for patient transportation"
        }
    ];

    const costSensitiveFeatures = [
        "Cross opinion on surgery package costs",
        "Estimates from multiple reputed clinics",
        "Medicine purchase discounts negotiation"
    ];

    return (
        <>

            <Navbar />

            <InnerBanner 
                title="Medical Tourism Services"  
                backgroundImage= {'https://plus.unsplash.com/premium_photo-1664303503818-a6fab2dcfd91?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170'}
            />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

                {/* Services Section */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                                Our Services
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Our current services are available only for hospitals and nursing homes in Kolkata and nearby areas, catering to patients & families traveling from other cities, states, or countries.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {services.map((service, index) => {
                                const IconComponent = service.icon;
                                return (
                                    <div
                                        key={service.id}
                                        className="service-card bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl cursor-pointer transition-all duration-300 fade-in"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                        onMouseEnter={() => setActiveService(service.id)}
                                        onMouseLeave={() => setActiveService(null)}
                                    >
                                        <div className={`p-3 rounded-lg w-12 h-12 mb-4 transition-colors ${activeService === service.id ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
                                            }`}>
                                            <IconComponent className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                            {service.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {service.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Cost Sensitive Section */}
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
                            <div className="flex flex-col md:flex-row items-center justify-between">
                                <div className="md:w-2/3 mb-6 md:mb-0">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                        Special Support for Cost-Sensitive Customers
                                    </h3>
                                    <ul className="space-y-2">
                                        {costSensitiveFeatures.map((feature, index) => (
                                            <li key={index} className="flex items-center space-x-3 text-gray-700">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-white rounded-xl p-6 shadow-lg">
                                    <CurrencyDollarIcon className="h-12 w-12 text-green-600 mx-auto mb-3" />
                                    <p className="text-sm text-gray-600 text-center">
                                        Maximizing value without compromising quality
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Disclaimer Section */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-orange-500">
                                <div className="flex items-start space-x-4">
                                    <ShieldCheckIcon className="h-8 w-8 text-orange-500 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Disclaimer</h3>
                                        <p className="text-gray-700 leading-relaxed mb-4">
                                            We are not responsible for services or treatment provided by hospitals / clinics / doctors / nurses / attendants.
                                            Any dispute, difference of services, or quality of service or treatment will be between the service provider
                                            and the customer.
                                        </p>
                                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                            <p className="text-blue-800 font-semibold">
                                                <strong>L2G Cruise & Cure Travel Management Private Limited</strong> works as a catalyst
                                                <strong> on behalf of customers</strong> to <strong>reduce cost and time</strong> against any medical treatment,
                                                and assist in arranging support services if asked.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Ready to Begin Your Medical Journey?
                        </h2>
                        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                            Contact us today to get started with our comprehensive medical tourism services
                        </p>

                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
                            <div className="flex items-center justify-center space-x-4 mb-4">
                                <div className="bg-white p-3 rounded-full">
                                    <PhoneIcon className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm opacity-80">Call us at</p>
                                    <a
                                        href="tel:8209976417"
                                        className="text-2xl font-bold hover:text-blue-200 transition-colors"
                                    >
                                        +91 8209976417
                                    </a>
                                </div>
                            </div>
                            <p className="text-sm opacity-80 mt-4">
                                Available for hospitals and nursing homes in Kolkata and nearby areas
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />

        </>
    );
}

export default MedicalTourismPage;