import React, { useEffect, useState } from 'react';
import axios from '../api';

// Recursive TreeNode Component
const TreeNode = ({ node, onAgentClick }) => {
  const handleClick = (event) => {
    event.stopPropagation(); // Prevent bubbling to parent nodes
    onAgentClick(node._id);
  };
  return (
    <div className="flex flex-col items-center relative cursor-pointer" onClick={handleClick}>
      {/* Node Circle */}
      <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg z-10">
        {node.name[0]}
      </div>
      <div className="text-sm mt-1 font-medium text-blue-700">{node.name}</div>

      {/* Children Connector */}
      {node.children && node.children.length > 0 && (
        <>
          {/* Vertical line from this node to children */}
          <div className="w-px h-6 bg-gray-400"></div>

          {/* Horizontal and Vertical connectors for children */}
          <div className="flex justify-center items-start relative mt-2">
            {/* Horizontal Line connecting all children */}
            <div
              className="absolute top-3 left-0 right-0 h-px bg-gray-400 "
              style={{ margin: '0 auto', width: `${node.children.length * 80}px` }}
            />

            {/* Child nodes */}
            <div className="flex justify-center gap-10">
              {node.children.map((child) => (
                <div className="flex flex-col items-center relative" key={child._id}>
                  {/* Vertical connector from horizontal line to child */}
                  <div className="w-px h-3 bg-gray-400" />
                  <TreeNode node={child} onAgentClick={onAgentClick} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const AgentTreeView = () => {
  const handleAgentClick = async (agentId) => {
    try {
      console.log("Requesting agent ID:", agentId); 
      const response = await axios.get(`/api/agents/${agentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('Token')}` }
      });
      setSelectedAgent(response.data);
    } catch (error) {
      console.error("Failed to fetch agent details", error);
    }
  };
  
  const [treeData, setTreeData] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);

  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        const response = await axios.get('/api/agents/agent-tree', {
          headers: { Authorization: `Bearer ${localStorage.getItem('Token')}` }
        });
        setTreeData(response.data?.tree || null);
      } catch (error) {
        console.error('Error fetching agent tree data:', error);
      }
    };

    fetchTreeData();
  }, []);

  return (
    <div className="p-8 bg-white shadow rounded overflow-x-auto min-h-screen">
      {treeData ? (
        <div className="flex flex-col items-center">
          {/* Optional: Parent info above */}
          {treeData.parent && (
            <div className="mb-6 text-center">
              <div className="text-sm text-gray-500">Parent</div>
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-800 font-semibold">
                {treeData.parent.name[0]}
              </div>
              <div className="text-xs mt-1 text-gray-700">{treeData.parent.name}</div>
            </div>
          )}

          {/* Render Root Agent Tree */}
          {/* <TreeNode node={treeData} /> */}
          <TreeNode node={treeData} onAgentClick={handleAgentClick} />
          {selectedAgent && (
            <div className="mt-8 border p-4 rounded-lg shadow w-full max-w-md">
              <h3 className="text-lg font-semibold mb-2">Agent Details</h3>
              <p><strong>Name:</strong> {selectedAgent.name}</p>
              <p><strong>Email:</strong> {selectedAgent.email}</p>
              <p><strong>Phone:</strong> {selectedAgent.phone_calling}</p>
              <p><strong>Gender:</strong> {selectedAgent.gender}</p>
              <p><strong>DOB:</strong> {new Date(selectedAgent.dob).toLocaleDateString()}</p>
              {/* Add more fields if needed, excluding earnings */}
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500">Loading agent tree...</p>
      )}
    </div>
  );
};


export default AgentTreeView;
