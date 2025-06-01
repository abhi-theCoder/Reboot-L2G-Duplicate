import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import TopNav from '../components/TopNav';
import AgentRequests from '../components/AgentRequest';

function Layout() { // State to control sidebar collapse

    return ( 
        <div className="flex">
            {/* Pass collapsed and setCollapsed to Sidebar */}
            <Sidebar/>

            {/* Main content wrapper shifts based on sidebar collapse */}
            <main
                className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out bg- ${
                    collapsed ? 'md:ml-20' : 'md:ml-64'
                }`}
            >
                <TopNav />
                <MainContent />
            </main>
        </div>
    );
}

export default Layout;
