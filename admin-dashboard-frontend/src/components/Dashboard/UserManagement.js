import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { FETCH_USER_LIST } from '../../graphql/queries/fetchUserList';
import { BLOCK_USER } from '../../graphql/mutations/blockUser';
import { UNBLOCK_USER } from '../../graphql/mutations/unblockUser';

const UserManagement = () => {
  const { loading, error, data } = useQuery(FETCH_USER_LIST);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState(null);

  const [blockUser] = useMutation(BLOCK_USER, {
    refetchQueries: [{ query: FETCH_USER_LIST }],
    onError: (err) => {
      setErrorMessage('Failed to block user: ' + err.message);
      setSuccessMessage('');
    },
    onCompleted: () => {
      setErrorMessage('');
      setSuccessMessage('User blocked successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  });

  const [unblockUser] = useMutation(UNBLOCK_USER, {
    refetchQueries: [{ query: FETCH_USER_LIST }],
    onError: (err) => {
      setErrorMessage('Failed to unblock user: ' + err.message);
      setSuccessMessage('');
    },
    onCompleted: () => {
      setErrorMessage('');
      setSuccessMessage('User unblocked successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  });
  
  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    if (!data?.users) return [];
    
    let filtered = data.users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && !user.is_blocked) ||
                           (statusFilter === 'blocked' && user.is_blocked);
      return matchesSearch && matchesStatus;
    });

    // Sort users
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'join_date':
          aValue = new Date(Number(a.join_date));
          bValue = new Date(Number(b.join_date));
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [data, searchTerm, statusFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const paginatedUsers = filteredAndSortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleSelectUser = (userId) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === paginatedUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(paginatedUsers.map(user => user.user_id)));
    }
  };

  const confirmAction = (action, userId = null) => {
    setActionToConfirm({ action, userId });
    setShowConfirmDialog(true);
  };

  const executeAction = async () => {
    if (!actionToConfirm) return;
    
    const { action, userId } = actionToConfirm;
    
    try {
      if (action === 'block') {
        if (userId) {
          await blockUser({ variables: { id: userId } });
        } else {
          // Bulk block
          for (const id of selectedUsers) {
            await blockUser({ variables: { id } });
          }
          setSelectedUsers(new Set());
        }
      } else if (action === 'unblock') {
        if (userId) {
          await unblockUser({ variables: { id: userId } });
        } else {
          // Bulk unblock
          for (const id of selectedUsers) {
            await unblockUser({ variables: { id } });
          }
          setSelectedUsers(new Set());
        }
      }
    } catch (error) {
      console.error('Action failed:', error);
    }
    
    setShowConfirmDialog(false);
    setActionToConfirm(null);
  };

  const exportToCSV = () => {
    const headers = ['User ID', 'Name', 'Email', 'Status', 'Join Date'];
    const csvData = filteredAndSortedUsers.map(user => [
      user.user_id,
      user.name,
      user.email,
      user.is_blocked ? 'Blocked' : 'Active',
      formatDate(user.join_date)
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalUsers: filteredAndSortedUsers.length,
      users: filteredAndSortedUsers.map(user => ({
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        is_blocked: user.is_blocked,
        join_date: user.join_date,
        formatted_join_date: formatDate(user.join_date)
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="bg-white rounded-xl p-6">
            <div className="h-10 bg-slate-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-12 bg-slate-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-red-800 font-semibold">Error Loading Users</h3>
              <p className="text-red-600">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">User Management</h1>
          <p className="text-slate-600">Manage user accounts, permissions, and access controls</p>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 font-medium">{errorMessage}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-700 font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Search Users</label>
              <div className="relative">
                <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status Filter</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Users</option>
                <option value="active">Active Only</option>
                <option value="blocked">Blocked Only</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="email-asc">Email (A-Z)</option>
                <option value="email-desc">Email (Z-A)</option>
                <option value="join_date-desc">Newest First</option>
                <option value="join_date-asc">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.size > 0 && (
            <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4">
              <span className="text-blue-700 font-medium">
                {selectedUsers.size} user{selectedUsers.size !== 1 ? 's' : ''} selected
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => confirmAction('block')}
                  className="btn-danger text-sm"
                >
                  Block Selected
                </button>
                <button
                  onClick={() => confirmAction('unblock')}
                  className="btn-success text-sm"
                >
                  Unblock Selected
                </button>
                <button
                  onClick={() => setSelectedUsers(new Set())}
                  className="btn-secondary text-sm"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}

          {/* Export Options */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-4 mt-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-slate-200 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-slate-800 font-semibold">Export Data</h4>
                  <p className="text-sm text-slate-600">Download {filteredAndSortedUsers.length} filtered users</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={exportToCSV}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md transform hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={exportToJSON}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md transform hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <span>Export JSON</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Users</p>
                <p className="text-2xl font-bold text-slate-800">{filteredAndSortedUsers.length}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Users</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredAndSortedUsers.filter(u => !u.is_blocked).length}
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Blocked Users</p>
                <p className="text-2xl font-bold text-red-600">
                  {filteredAndSortedUsers.filter(u => u.is_blocked).length}
                </p>
              </div>
              <div className="bg-red-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.size === paginatedUsers.length && paginatedUsers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedUsers.map((user, index) => (
                  <tr key={user.user_id} className={`hover:bg-slate-50 transition-colors ${
                    selectedUsers.has(user.user_id) ? 'bg-blue-50' : ''
                  }`}>
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(user.user_id)}
                        onChange={() => handleSelectUser(user.user_id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-full mr-3">
                          <span className="text-white font-medium text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{user.name}</p>
                          <p className="text-sm text-slate-500">ID: {user.user_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{user.email}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.is_blocked 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-1 ${
                          user.is_blocked ? 'bg-red-500' : 'bg-green-500'
                        }`}></div>
                        {user.is_blocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      <div>
                        <p>{formatDate(user.join_date)}</p>
                        <p className="text-xs text-slate-500">{formatTime(user.join_date)}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex space-x-2">
                        {user.is_blocked ? (
                          <button
                            onClick={() => confirmAction('unblock', user.user_id)}
                            className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => confirmAction('block', user.user_id)}
                            className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
                          >
                            Block
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-slate-700">
                  <span>
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedUsers.length)} of {filteredAndSortedUsers.length} results
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 text-sm border rounded ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900">Confirm Action</h3>
              </div>
              <p className="text-slate-600 mb-6">
                Are you sure you want to {actionToConfirm?.action} {actionToConfirm?.userId ? 'this user' : `${selectedUsers.size} selected users`}?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={executeAction}
                  className={actionToConfirm?.action === 'block' ? 'btn-danger' : 'btn-success'}
                >
                  Confirm {actionToConfirm?.action === 'block' ? 'Block' : 'Unblock'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;