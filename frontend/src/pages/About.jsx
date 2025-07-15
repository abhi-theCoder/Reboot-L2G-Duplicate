import { useEffect, useState } from "react";
import { FaSearch, FaUserFriends } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DiscountCover from '../../public/Images/planning-img-About.jpg';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InnerBanner from '../components/InnerBanner';
import axios from '../api';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const AboutL2G = () => {
    const [allAgents, setAllAgents] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState({
        state: "",
        village: "",
        city: "",
        district: "",
        agentId: "",
    });

    const { isLoggedIn } = useAuth();

    const maskPhone = (phone) => {
        if (!phone || typeof phone !== 'string' || phone.length < 6) return "******";
        return phone.slice(0, 6) + "****";
    };

    const fetchAgents = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/agents/active-agents");
            const fetched = res.data.agents || res.data || [];
            
            const cleanedAgents = await Promise.all(
                fetched.map(async (agent) => {
                    let position = [22.9734, 78.6569]; // default center
                    const pincode = agent?.permanent_address?.pincode;
                    
                    if (pincode) {
                        try {
                            const coords = await geocodePincode(pincode);
                            if (coords) position = coords;
                        } catch (err) {
                            console.error("Geocoding error:", err);
                        }
                    }

                    return {
                        id: agent.agentID || agent.id || agent._id,
                        name: agent.name || "N/A",
                        avatar: agent.avatar || "https://ui-avatars.com/api/?name=Agent&background=random",
                        phone: agent.phone_calling || agent.phone_whatsapp || "N/A",
                        position,
                        pincode: agent.permanent_address?.pincode || "N/A",
                        district: agent.permanent_address?.district || "N/A",
                        state: agent.permanent_address?.state || "N/A",
                        village: agent.permanent_address?.village || "N/A",
                        city: agent.permanent_address?.post_office || "N/A",
                    };
                })
            );

            setAllAgents(cleanedAgents);
            setAgents(cleanedAgents);
        } catch (err) {
            console.error("Error fetching agents:", err);
            setAgents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const filtered = allAgents.filter((agent) => {
            const matchesState = search.state ? 
                agent.state.toLowerCase().includes(search.state.toLowerCase()) : true;
            const matchesVillage = search.village ? 
                agent.village.toLowerCase().includes(search.village.toLowerCase()) : true;
            const matchesCity = search.city ? 
                agent.city.toLowerCase().includes(search.city.toLowerCase()) : true;
            const matchesDistrict = search.district ? 
                agent.district.toLowerCase().includes(search.district.toLowerCase()) : true;
            const matchesAgentId = search.agentId ? 
                agent.id.toString().toLowerCase().includes(search.agentId.toLowerCase()) : true;

            return matchesState && matchesVillage && matchesCity && matchesDistrict && matchesAgentId;
        });

        setAgents(filtered);
    };

    const resetSearch = () => {
        setSearch({
            state: "",
            village: "",
            city: "",
            district: "",
            agentId: "",
        });
        setAgents(allAgents);
    };

    const geocodePincode = async (pincode) => {
        try {
            const response = await axios.get("https://nominatim.openstreetmap.org/search", {
                params: {
                    q: pincode,
                    format: "json",
                    limit: 1,
                },
                headers: {
                    'User-Agent': 'L2G-Agent-Locator',
                },
            });
            if (response.data.length > 0) {
                return [
                    parseFloat(response.data[0].lat),
                    parseFloat(response.data[0].lon),
                ];
            }
        } catch (err) {
            console.error("Geocoding error for pincode:", pincode, err);
            return null;
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    return (
        <>
            <Navbar />
            <InnerBanner
                title="About Us"
                backgroundImage="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
            
            <div className="bg-[#E8F3FF] text-[#0D2044] font-sans">
                {/* About Section */}
                <div className="max-w-7xl mx-auto py-12 px-4 md:px-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">About L2G</h2>
                            <p className="mb-4 text-gray-700">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
                            </p>
                            <p className="text-gray-700">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
                            </p>
                        </div>
                        <div className="w-full md:w-1/3">
                            <img src="https://img.freepik.com/free-photo/group-tourist-hiking-mountain_1150-7414.jpg" 
                                 alt="About" 
                                 className="rounded-lg w-full object-cover" />
                        </div>
                    </div>
                </div>

                {/* Search Box */}
                <div className="max-w-7xl mx-auto px-4 md:px-8 mb-10">
                    <div className="bg-white p-4 rounded-md shadow-md">
                        <h3 className="flex gap-2 items-center mb-3 text-lg font-semibold">
                            <FaSearch /> Agent Search
                        </h3>
                        <form onSubmit={handleSearch}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input
                                    type="text"
                                    placeholder="State"
                                    value={search.state}
                                    onChange={(e) => setSearch({ ...search, state: e.target.value })}
                                    className="border border-gray-300 rounded-md px-4 py-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Village"
                                    value={search.village}
                                    onChange={(e) => setSearch({ ...search, village: e.target.value })}
                                    className="border border-gray-300 rounded-md px-4 py-2"
                                />
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={search.city}
                                    onChange={(e) => setSearch({ ...search, city: e.target.value })}
                                    className="border border-gray-300 rounded-md px-4 py-2"
                                />
                                <input
                                    type="text"
                                    placeholder="District"
                                    value={search.district}
                                    onChange={(e) => setSearch({ ...search, district: e.target.value })}
                                    className="border border-gray-300 rounded-md px-4 py-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Agent ID"
                                    value={search.agentId}
                                    onChange={(e) => setSearch({ ...search, agentId: e.target.value })}
                                    className="border border-gray-300 rounded-md px-4 py-2"
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="bg-[#0D2044] text-white px-6 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-[#09172f] cursor-pointer flex-1"
                                    >
                                        <FaSearch /> Search
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetSearch}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Map Section */}
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <h3 className="text-3xl md:text-4xl font-bold mb-4">Agents</h3>
                    {!isLoggedIn && (
                        <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                            <p className="text-yellow-700">
                                <Link to="/login" className="text-blue-600 hover:underline">Login</Link> to view full contact details
                            </p>
                        </div>
                    )}
                    <div className="rounded-md overflow-hidden border border-gray-300 mb-8">
                        {loading ? (
                            <div className="h-[570px] w-full flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0D2044]"></div>
                            </div>
                        ) : (
                            <MapContainer
                                center={[22.9734, 78.6569]}
                                zoom={5}
                                scrollWheelZoom={true}
                                className="h-[570px] w-full z-0"
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                />
                                {agents.map((agent, idx) => (
                                    <Marker key={idx} position={agent.position}>
                                        <Popup>
                                            <div className="min-w-[200px]">
                                                <strong className="block mb-1">{agent.name}</strong>
                                                <div className="mb-1">
                                                    <span className="font-semibold">Phone:</span> {isLoggedIn ? agent.phone : maskPhone(agent.phone)}
                                                </div>
                                                <div>
                                                    <span className="font-semibold">Location:</span> {agent.district}, {agent.state}
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        )}
                    </div>
                </div>

                {/* Agents List */}
                <div className="bg-[#E8F3FF] p-4 md:p-6 rounded-lg w-full max-w-7xl mx-auto mb-12">
                    <div className="bg-white p-4 md:p-6 rounded-md shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-[#0D2044] font-semibold text-lg">
                            <FaUserFriends />
                            <span>Agents List</span>
                            {!isLoggedIn && (
                                <span className="text-sm text-gray-500 ml-auto">
                                    <Link to="/login" className="text-blue-600 hover:underline">Login</Link> to view full contact details
                                </span>
                            )}
                        </div>
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0D2044]"></div>
                                </div>
                            ) : agents.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No agents found. {!isLoggedIn && (
                                        <span>Try <Link to="/login" className="text-blue-600 hover:underline">logging in</Link> or adjusting your search criteria.</span>
                                    )}
                                </div>
                            ) : (
                                <table className="w-full text-sm text-left border-separate border-spacing-y-2">
                                    <thead className="text-gray-600 text-xs uppercase">
                                        <tr>
                                            <th className="px-4 py-4 border-b border-gray-200 bg-gray-300">Agent</th>
                                            <th className="px-4 py-4 border-b border-gray-200 bg-gray-300">Agent ID</th>
                                            <th className="px-4 py-4 border-b border-gray-200 bg-gray-300">Mobile Number</th>
                                            <th className="px-4 py-4 border-b border-gray-200 bg-gray-300">Agent Location</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-800">
                                        {agents.map((agent) => (
                                            <tr key={agent.id} className="bg-white hover:bg-gray-50">
                                                <td className="px-4 py-3 flex items-center gap-3 border-b border-gray-200">
                                                    <img
                                                        src={agent.avatar}
                                                        alt={agent.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                    <span className="font-semibold text-sm">{agent.name}</span>
                                                </td>
                                                <td className="px-4 py-3 border-b border-gray-200 uppercase">{agent.id}</td>
                                                <td className="px-4 py-3 border-b border-gray-200">
                                                    {isLoggedIn ? agent.phone : maskPhone(agent.phone)}
                                                </td>
                                                <td className="px-4 py-3 border-b border-gray-200">
                                                    {agent.district}, {agent.pincode}, {agent.village}, {agent.city}, {agent.state}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="relative">
                    <img
                        src={DiscountCover}
                        alt="cta"
                        className="w-full h-[400px] object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white px-4">
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2">Start Planning Your Trip Now and</h3>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#E87400] mb-4">Get 30% Discount</h1>
                            <p className="max-w-xl mx-auto mb-4 text-sm sm:text-base">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                            <button className="bg-[#0D2044] text-white px-[100px] py-2 rounded-full text-lg hover:bg-[#09172f]">Book Now</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AboutL2G;