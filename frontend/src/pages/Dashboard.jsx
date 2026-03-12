import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { groupsAPI } from '../api/api';

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  // Normalize stored user id: some places store `id`, others `userId`.
  const currentUserId = currentUser?.id ?? currentUser?.userId;
  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) return;
    try {
      await groupsAPI.delete(groupId);
      setGroups(groups.filter(g => g.id !== groupId));
    } catch (err) {
      alert('Failed to delete group. You must be the group creator.');
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const response = await groupsAPI.getAll();
      setGroups(response.data || []);
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error loading groups:', err);
      let errorMessage = 'Failed to load groups';
      
      if (err.response) {
        // Server responded with error
        if (err.response.status === 401) {
          errorMessage = 'Unauthorized. Please login again.';
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else {
          errorMessage = `Server error: ${err.response.status} ${err.response.statusText}`;
        }
      } else if (err.request) {
        // Request made but no response
        errorMessage = 'Cannot connect to server. Make sure backend is running on http://localhost:8080';
      } else {
        errorMessage = err.message || 'Failed to load groups';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Groups</h1>
        <Link
          to="/groups/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Create Group
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {groups.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 mb-4">No groups yet. Create your first group!</p>
          <Link
            to="/groups/new"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Create Group
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition relative"
            >
              <Link to={`/groups/${group.id}`} className="block">
                <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Created by: {group.createdByName}
                </p>
                <p className="text-sm text-gray-500">
                  Members: {group.members?.length || 0}
                </p>
              </Link>
              {currentUserId && group.createdById === currentUserId && (
                <button
                  onClick={() => handleDeleteGroup(group.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                  title="Delete Group"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
