import { useState } from 'react';
import {
    FiUsers,
    FiUserCheck,
    FiDollarSign,
    FiSearch,
    FiFilter,
    FiRefreshCw,
    FiChevronLeft,
    FiChevronRight,
    FiDownload
} from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Utility function to convert array of objects to CSV
const convertToCSV = (data) => {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [];

    csvRows.push(headers.join(','));

    for (const row of data) {
        const values = headers.map(header => {
            const escaped = ('' + row[header]).replace(/"/g, '\\"');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
};

const MasterDataDashboard = () => {
    // Sample data
    const [agents] = useState([
        {
            id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890',
            registrationDate: '2023-01-15', totalCustomers: 12, pendingPayments: 3, totalCommission: 4500
        },
        {
            id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '9876543210',
            registrationDate: '2023-02-20', totalCustomers: 8, pendingPayments: 1, totalCommission: 3200
        },
        {
            id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '5551234567',
            registrationDate: '2023-03-10', totalCustomers: 15, pendingPayments: 5, totalCommission: 6200
        },
    ]);

    const [customers] = useState([
        {
            id: 1, name: 'Alice Brown', email: 'alice@example.com', phone: '1112223333',
            agentId: 1, agentName: 'John Doe', tourBooked: 'Bali Adventure', paymentStatus: 'Paid',
            amount: 1200, bookingDate: '2023-05-10'
        },
        {
            id: 2, name: 'Bob Wilson', email: 'bob@example.com', phone: '4445556666',
            agentId: 1, agentName: 'John Doe', tourBooked: 'European Tour', paymentStatus: 'Pending',
            amount: 1800, bookingDate: '2023-05-15'
        },
        {
            id: 3, name: 'Carol Davis', email: 'carol@example.com', phone: '7778889999',
            agentId: 2, agentName: 'Jane Smith', tourBooked: 'Japan Explorer', paymentStatus: 'Paid',
            amount: 1500, bookingDate: '2023-05-20'
        },
    ]);

    const [payments] = useState([
        {
            id: 1,
            agentId: 1,
            agentName: 'John Doe',
            customerId: 2,
            customerName: 'Bob Wilson',
            tourName: 'European Tour',
            amount: 180,
            status: 'Pending',
            dueDate: '2023-06-15',
            commissionRate: 10, // 10% commission
            commissionAmount: 18, // 10% of 180
            month: 6,
            year: 2023
        },
        {
            id: 2,
            agentId: 1,
            agentName: 'John Doe',
            customerId: 1,
            customerName: 'Alice Brown',
            tourName: 'Bali Adventure',
            amount: 120,
            status: 'Received',
            paidDate: '2023-06-12',
            commissionRate: 10,
            commissionAmount: 12,
            month: 6,
            year: 2023
        },
        {
            id: 3,
            agentId: 2,
            agentName: 'Jane Smith',
            customerId: 3,
            customerName: 'Carol Davis',
            tourName: 'Japan Explorer',
            amount: 150,
            status: 'Received',
            paidDate: '2023-06-05',
            commissionRate: 15,
            commissionAmount: 22.5,
            month: 6,
            year: 2023
        },
        {
            id: 4,
            agentId: 2,
            agentName: 'Jane Smith',
            customerId: 4,
            customerName: 'David Wilson',
            tourName: 'Thai Paradise',
            amount: 200,
            status: 'Pending',
            dueDate: '2023-06-25',
            commissionRate: 15,
            commissionAmount: 30,
            month: 6,
            year: 2023
        },
        {
            id: 5,
            agentId: 3,
            agentName: 'Mike Johnson',
            customerId: 5,
            customerName: 'Eva Green',
            tourName: 'Dubai Luxury',
            amount: 250,
            status: 'Received',
            paidDate: '2023-05-28',
            commissionRate: 20,
            commissionAmount: 50,
            month: 5,
            year: 2023
        },
    ]);

    const [activeTab, setActiveTab] = useState('agents');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [timeFilter, setTimeFilter] = useState('currentMonth');
    const itemsPerPage = 5;

    // Filter data based on search term
    const filteredAgents = agents.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.phone.includes(searchTerm)
    );

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.agentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredPayments = payments.filter(payment => {
        const matchesSearch =
            payment.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.status.toLowerCase().includes(searchTerm.toLowerCase());

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        const matchesTimeFilter =
            timeFilter === 'all' ||
            (payment.month === currentMonth && payment.year === currentYear);

        return matchesSearch && matchesTimeFilter;
    });

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAgents = filteredAgents.slice(indexOfFirstItem, indexOfLastItem);
    const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
    const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calculate totals for summary cards
    const totalAgents = agents.length;
    const totalCustomers = customers.length;
    const totalPendingPayments = payments.filter(p => p.status === 'Pending').length;
    const totalCommission = agents.reduce((sum, agent) => sum + agent.totalCommission, 0);
    // Calculate payment summaries
    const receivedPayments = filteredPayments.filter(p => p.status === 'Received');
    const pendingPayments = filteredPayments.filter(p => p.status === 'Pending');

    const totalReceived = receivedPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalPending = pendingPayments.reduce((sum, payment) => sum + payment.amount, 0);

    // Function to trigger download
    const downloadCSV = (data, filename) => {
        const csvData = convertToCSV(data);
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('hidden', '');
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Master Data Dashboard</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4 flex items-center">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <FiUsers className="text-blue-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Agents</p>
                        <p className="text-2xl font-bold">{totalAgents}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 flex items-center">
                    <div className="bg-green-100 p-3 rounded-full mr-4">
                        <FiUserCheck className="text-green-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Customers</p>
                        <p className="text-2xl font-bold">{totalCustomers}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 flex items-center">
                    <div className="bg-yellow-100 p-3 rounded-full mr-4">
                        <FiDollarSign className="text-yellow-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Pending Payments</p>
                        <p className="text-2xl font-bold">{totalPendingPayments}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 flex items-center">
                    <div className="bg-purple-100 p-3 rounded-full mr-4">
                        <FiDollarSign className="text-purple-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Commission</p>
                        <p className="text-2xl font-bold">${totalCommission.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Tabs and Search */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b">
                    <div className="flex space-x-2 mb-4 md:mb-0">
                        <button
                            onClick={() => { setActiveTab('agents'); setCurrentPage(1); }}
                            className={`px-4 py-2 rounded-md ${activeTab === 'agents' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        >
                            Agents
                        </button>
                        <button
                            onClick={() => { setActiveTab('customers'); setCurrentPage(1); }}
                            className={`px-4 py-2 rounded-md ${activeTab === 'customers' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        >
                            Customers
                        </button>
                        <button
                            onClick={() => { setActiveTab('payments'); setCurrentPage(1); }}
                            className={`px-4 py-2 rounded-md ${activeTab === 'payments' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        >
                            Payments
                        </button>
                    </div>

                    <div className="flex w-full md:w-auto space-x-2">
                        <div className="relative flex-grow md:flex-grow-0">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 border rounded-md w-full md:w-64"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                        <button
                            onClick={() => {
                                if (activeTab === 'agents') downloadCSV(filteredAgents, 'agents.csv');
                                if (activeTab === 'customers') downloadCSV(filteredCustomers, 'customers.csv');
                                if (activeTab === 'payments') downloadCSV(filteredPayments, 'payments.csv');
                            }}
                            className="px-3 py-2 bg-green-600 text-white rounded-md flex items-center hover:bg-green-700"
                        >
                            <FiDownload className="mr-1" />
                            <span className="hidden md:inline">Download CSV</span>
                        </button>
                        <button
                            className="px-3 py-2 bg-gray-100 rounded-md"
                            onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                        >
                            <FiRefreshCw />
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-4 overflow-x-auto">
                    {activeTab === 'agents' && (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customers</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Payments</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Commission</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentAgents.length > 0 ? (
                                    currentAgents.map(agent => (
                                        <tr key={agent.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{agent.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                                                <div className="text-sm text-gray-500">{agent.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.phone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.registrationDate}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.totalCustomers}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.pendingPayments}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">${agent.totalCommission.toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No agents found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'customers' && (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour Booked</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentCustomers.length > 0 ? (
                                    currentCustomers.map(customer => (
                                        <tr key={customer.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{customer.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                                <div className="text-sm text-gray-500">{customer.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.phone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{customer.agentName}</div>
                                                <div className="text-sm text-gray-500">ID: #{customer.agentId}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.tourBooked}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${customer.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {customer.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">${customer.amount.toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.bookingDate}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No customers found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'payments' && (
                        <>
                            {/* Payment Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="bg-white rounded-lg shadow p-4">
                                    <div className="flex items-center">
                                        <div className="bg-green-100 p-3 rounded-full mr-4">
                                            <FiDollarSign className="text-green-600 text-xl" />
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm">Received Amount</p>
                                            <p className="text-xl font-bold">${totalReceived.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow p-4">
                                    <div className="flex items-center">
                                        <div className="bg-yellow-100 p-3 rounded-full mr-4">
                                            <FiDollarSign className="text-yellow-600 text-xl" />
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm">Pending Amount</p>
                                            <p className="text-xl font-bold">${totalPending.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow p-4">
                                    <div className="flex items-center">
                                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                                            <FiDollarSign className="text-blue-600 text-xl" />
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm">Total Commission</p>
                                            <p className="text-xl font-bold">${totalCommission.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Time Filter Buttons */}
                            <div className="flex space-x-2 mb-4">
                                <button
                                    onClick={() => { setTimeFilter('currentMonth'); setCurrentPage(1); }}
                                    className={`px-4 py-2 rounded-md ${timeFilter === 'currentMonth' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                                >
                                    Current Month
                                </button>
                                <button
                                    onClick={() => { setTimeFilter('all'); setCurrentPage(1); }}
                                    className={`px-4 py-2 rounded-md ${timeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                                >
                                    All Payments
                                </button>
                            </div>

                            {/* Payments Table */}
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentPayments.length > 0 ? (
                                        currentPayments.map(payment => (
                                            <tr key={payment.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{payment.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{payment.agentName}</div>
                                                    <div className="text-sm text-gray-500">ID: #{payment.agentId}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{payment.customerName}</div>
                                                    <div className="text-sm text-gray-500">ID: #{payment.customerId}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.tourName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">${payment.amount.toLocaleString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    ${payment.commissionAmount.toLocaleString()} ({payment.commissionRate}%)
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${payment.status === 'Received' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {payment.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {payment.status === 'Received' ? (
                                                        <div>
                                                            <div>Paid on {payment.paidDate}</div>
                                                            <div className="text-xs text-gray-400">{payment.month}/{payment.year}</div>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <div>Due by {payment.dueDate}</div>
                                                            <div className="text-xs text-gray-400">{payment.month}/{payment.year}</div>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                                No payments found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </>
                    )}

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 bg-gray-100 rounded-md flex items-center disabled:opacity-50"
                        >
                            <FiChevronLeft className="mr-1" />
                            Previous
                        </button>

                        <div className="flex space-x-1">
                            {Array.from({
                                length: Math.ceil(
                                    activeTab === 'agents' ? filteredAgents.length / itemsPerPage :
                                        activeTab === 'customers' ? filteredCustomers.length / itemsPerPage :
                                            filteredPayments.length / itemsPerPage
                                )
                            }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => paginate(index + 1)}
                                    className={`w-8 h-8 rounded-md ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev =>
                                Math.min(prev + 1,
                                    Math.ceil(
                                        activeTab === 'agents' ? filteredAgents.length / itemsPerPage :
                                            activeTab === 'customers' ? filteredCustomers.length / itemsPerPage :
                                                filteredPayments.length / itemsPerPage
                                    )
                                )
                            )}
                            disabled={currentPage === Math.ceil(
                                activeTab === 'agents' ? filteredAgents.length / itemsPerPage :
                                    activeTab === 'customers' ? filteredCustomers.length / itemsPerPage :
                                        filteredPayments.length / itemsPerPage
                            )}
                            className="px-3 py-1 bg-gray-100 rounded-md flex items-center disabled:opacity-50"
                        >
                            Next
                            <FiChevronRight className="ml-1" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MasterDataDashboard;