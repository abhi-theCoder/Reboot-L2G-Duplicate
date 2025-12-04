import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// InnerBanner is imported but not used, as noted in previous version.
import { ShieldCheckIcon, CalendarDaysIcon, MapPinIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';

function PrivacyPolicyPage() {

    const policySections = [
        {
            id: 1,
            title: "Objective",
            content: "This Privacy Policy outlines the privacy and data protection practices that L2G Cruise & Cure Travel Management Private Limited (“L2G”) follows in handling the personal information of its customers, patients, agents, employees, and all other individuals whose data is collected, processed, or stored as part of its services. The company is committed to maintain the confidentiality, integrity, and security of all personal information entrusted to us. This Privacy Policy explains how we collect, use, disclose, transfer, and protect your personal information when you interact with us through our website or agents."
        },
        {
            id: 2,
            title: "Scope of this Privacy Statement",
            content: "This Privacy Statement covers our information practices, including how we collect, use, share and protect the personal information that you provide to us, through our websites that link to this Privacy Statement. L2G Cruise & Cure Travel Management Private Limited is committed to safeguarding your personal information and ensuring transparent practices in the way we handle your data."
        },
        {
            id: 3,
            title: "Links to Third-Party Websites and Data Collection",
            content: (
                <>
                    <p className="mb-3">L2G’s Website (i.e. https://l2gcruise.com) does not contain any links to third-party websites for advertisements. Any personal information that you choose to provide to, or which is collected by, any third parties—including social media platforms featured on our website—is not governed by this Privacy Statement. We strongly encourage you to review the privacy statements or policies of each website you visit before providing any personal information.</p>
                    <p className="mb-3">We may also provide social media features on our website that enable you to share L2G’s information with your social networks and to interact with L2G on various social media sites. Your use of these features may result in the collection or sharing of information about you, depending on the feature. We encourage you to review the privacy policies and settings on the social media sites with which you interact to make sure you understand how the information provided by you could be used or shared by those sites.</p>
                    <p className="mb-3 font-semibold text-orange-600">L2G’s websites are not directed at nor targeted at children. No one who has not reached the age of thirteen may use the websites unless supervised by an adult. By accessing this website you represent and warrant that you are 13 years of age or older.</p>
                    <p className="mb-3">L2G will not be liable for any unsolicited information provided by you. You consent to L2G using such information as per L2G's Privacy Statement.</p>
                    <p className="font-bold mt-4">Personal information collected by L2G CRUISE & CURE TRAVEL MANAGEMENT PRIVATE LIMITED:</p>
                    <p className="mb-3">We may collect personal information such as your First Name, Last Name, E-mail Address, DOB, Medical condition, Age, Gender, Address, Banking details, Current occupation, Income, Country, City and Phone Number, ID proofs. When you provide information that enables us to respond to your request for services, we will, wherever permissible by relevant laws, collect, use and disclose this information to third parties for the purposes described in this Privacy Statement.</p>
                    <p>Personal information that is automatically collected by L2G when you fill forms on our websites and submit. L2G’s websites will collect a combination of IP address and cookie ID from website visitors. The data stored in the cookie is the unique identifier of the user that gets deleted if the user clears their cookie.</p>
                </>
            )
        },
        {
            id: 4,
            title: "Personal information that is collected from third party sources",
            content: "You can engage with us through social media websites or through features on L2G’s websites that integrate with social media sites. When you engage with us through social media sites, you may allow us to have access to certain information from your social media profile based upon your privacy preference settings on such platform."
        },
        {
            id: 5,
            title: "Data Protection and Confidentiality",
            content: (
                <>
                    <p className="mb-3">L2G CRUISE & CURE TRAVEL MANAGEMENT PRIVATE LIMITED has implemented reasonable and adequate technical and administrative security measures to protect personal information from loss. L2G discloses information to third parties only for legitimate purposes such as our service providers and agents who are bound to maintain the confidentiality of personal information and may not use the information for any unauthorized purpose.</p>
                    <p className="mb-3">L2G CRUISE & CURE TRAVEL MANAGEMENT will ensure through formally executed contracts that the Agents are committed to “same level of data protection” as applicable data protection laws and regulations.</p>
                    <p className="mb-3">L2G will take reasonable steps to ensure that all dealings in Personal Information, shall:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
                        <li>be processed fairly & lawfully.</li>
                        <li>be obtained only with the consent of the information provider.</li>
                        <li>be collected, only when:
                            <ul className="list-circle list-inside ml-6">
                                <li>the information is collected for a lawful purpose connected with a function or activity of L2G; and</li>
                                <li>the collection of the sensitive personal data or information is considered necessary for that purpose.</li>
                            </ul>
                        </li>
                        <li>be available for review by the information provider, as and when requested.</li>
                        <li>be kept secure against unauthorized or unlawful processing and against accidental loss, destruction or damage.</li>
                    </ul>
                </>
            )
        },
        {
            id: 6,
            title: "Your rights with respect to your personal information",
            content: (
                <>
                    <p className="mb-3">Your rights may differ depending on applicable data protection local laws. We respect your right to be informed, access, correct, request deletion or request restriction, portability, objection, and rights in relation to automated decision making and profiling, in our usage of your personal information as may be required under applicable law. We also take steps to ensure that the personal information we collect is accurate and up to date. Subject to such laws, you may have the following rights:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
                        <li>You have the right to know what personal information we maintain about you.</li>
                        <li>We will provide you with a copy of your personal information in a structured, commonly used format on request.</li>
                        <li>If your personal information is incorrect or incomplete, you have the right to ask us to update it.</li>
                        <li>You have the right to object to our processing of your personal information.</li>
                        <li>You can also ask us to delete or restrict how we use your personal information, but this right is determined by applicable law and may impact your access to our services.</li>
                        <li>You can have the right to access your personal information.</li>
                        <li>You have a right to object to processing of your personal information where it is so conducted by automated means and involves any kind of decision-making.</li>
                    </ul>
                    <p className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
                        Please note: You will also not to be subject to a decision based solely on automated processing, including profiling, which produces legal effects concerning you or similarly significantly affects you.
                    </p>
                </>
            )
        },
        {
            id: 7,
            title: "Right to Opt Out (Simple Version)",
            content: "L2G Cruise & Cure Travel Management Private Limited respects your privacy and gives you the choice to not share any personal information if you do not wish to. You can also withdraw the consent you had previously given us at any time by sending us a written request. This withdrawal will not affect any processing we did before your consent was taken back."
        },
        {
            id: 8,
            title: "Access and Correction of Your Personal Information",
            content: "You have the right to ask us what personal information we have about you, and we will share it with you when you request it. You also have the right to get any incorrect or incomplete information corrected. If you have an account on our website, you can usually update your details directly in the “Your Account” or “Profile” section. If you do not have an account or cannot update it yourself, you can simply email us at l2gcruise@gmail.com and request a correction. We will make every effort to respond quickly and update your information as needed. If you are writing to us about incorrect details, please include the information that needs correction so we can update it accurately."
        },
        {
            id: 9,
            title: "Retention of personal information",
            content: "We will retain your personal information for as long as necessary to provide the services you have requested, or for other essential purposes such as performance of a contract, complying with our legal obligations, resolving disputes, and enforcing our policies."
        },
        {
            id: 10,
            title: "Disclosure of information",
            content: "We may share your personal information with your consent, or where the disclosure is necessary for compliance of a legal obligation or where required by government agencies mandated under law to procure such disclosure. It shall also take steps to ensure that the information transferred to a third party is not further disclosed by it except where permissible under law."
        },
        {
            id: 11,
            title: "Effective Date",
            content: "This Privacy Statement is effective from 30 November 2025 and it supersedes all existing policies on the subject matter."
        },
        {
            id: 12,
            title: "Changes to this Privacy Statement",
            content: "Please note that this Privacy Statement may be subject to change from time to time. The revised Privacy Statement will accordingly be published on this page. We will not reduce your rights under this Privacy Statement without your explicit consent. Please regularly check this Privacy Statement to ensure you are aware of the latest updates with respect to the same."
        },
        {
            id: 13,
            title: "Use and Sharing of Information",
            content: (
                <>
                    <p className="mb-3">L2G Cruise & Cure Travel Management Private Limited may use and share customer and agent information only under the following circumstances:</p>
                    <ul className="space-y-3">
                        <li>
                            <p className="font-semibold text-gray-800">Legal and Regulatory Requirements:</p>
                            <p className="text-gray-700">Information may be disclosed if required by a court of law, government authority, or investigative agency for the purpose of complying with legal obligations, investigations, or lawful requests.</p>
                        </li>
                        <li>
                            <p className="font-semibold text-gray-800">Marketing and Communication:</p>
                            <p className="text-gray-700">Information may be used by L2G to send push notifications, updates, promotional offers, and marketing communications related to our tour programs, services.</p>
                        </li>
                        <li>
                            <p className="font-semibold text-gray-800">Service Delivery and Bookings:</p>
                            <p className="text-gray-700">Customer information will be shared only with the agent assigned to or responsible for the specific tour booked by the customer. This sharing is necessary to complete various travel and service-related arrangements, including but not limited to:</p>
                            <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-600">
                                <li>Train ticket bookings</li>
                                <li>Flight ticket bookings</li>
                                <li>Hotel reservations</li>
                                <li>Ground transportation</li>
                                <li>Medical tourism-related bookings</li>
                                <li>Any other bookings required to provide leisure or medical tour services</li>
                            </ul>
                            <p className="text-gray-700 mt-2">L2G ensures that all agents receiving such information maintain appropriate confidentiality and use the data strictly for fulfilling the requested services.</p>
                        </li>
                    </ul>
                </>
            )
        }
    ];

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-50 py-16">
                <div className="container bg-white mx-auto px-4 max-w-5xl rounded-lg shadow-xl p-8">

                    {/* Effective Date Info (Right Aligned, content-width box) */}
                    <div className="flex justify-end mb-12">
                        <div className="bg-blue-50 p-4 w-fit rounded-lg border border-blue-200 flex items-center">
                            <CalendarDaysIcon className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0" />
                            <p className="text-base font-medium text-gray-700 whitespace-nowrap">
                                Effective Date: 30 November 2025
                            </p>
                        </div>
                    </div>

                    {/* Main Title Section */}
                    <div className="text-center pb-8 border-b border-gray-200 mb-8">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 inline-block">
                            PRIVACY POLICY
                        </h1>
                    </div>




                    {/* Policy Content */}
                    <div className="space-y-12">
                        {policySections.map((section) => (
                            <section key={section.id} className="policy-section">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">
                                    {section.id}. {section.title}
                                </h2>
                                <div className="text-gray-700 leading-relaxed pl-3">
                                    {section.content}
                                </div>
                            </section>
                        ))}
                    </div>

                    {/* Signatures section removed as requested. */}
                </div>
            </div>

            <Footer />
        </>
    );
}

export default PrivacyPolicyPage;