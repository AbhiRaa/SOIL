import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Filter from 'bad-words';
import { FETCH_REVIEW_LIST } from '../../graphql/queries/fetchReviewList';
import { UPDATE_REVIEW_VISIBILITY } from '../../graphql/mutations/updateReviewVisibility';
import additionalProfanities from '../../assets/additionalProfanities';
import StarRatings from 'react-star-ratings';

const filter = new Filter();
filter.addWords(...additionalProfanities);

const ReviewManagement = () => {
  const { data, loading, error } = useQuery(FETCH_REVIEW_LIST);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [profanityFilter, setProfanityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedReviews, setSelectedReviews] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const [updateVisibility] = useMutation(UPDATE_REVIEW_VISIBILITY, {
    refetchQueries: [{ query: FETCH_REVIEW_LIST }],
    onError: (err) => {
      setErrorMessage('Failed to update review visibility: ' + err.message);
      setSuccessMessage('');
    },
    onCompleted: () => {
      setErrorMessage('');
      setSuccessMessage('Review visibility updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  });

  const toggleVisibility = (id, isVisible) => {
    updateVisibility({ variables: { id, isVisible: !isVisible } });
  };

  const isProfane = (text) => filter.isProfane(text);

  // Filter and sort reviews
  const filteredAndSortedReviews = useMemo(() => {
    if (!data?.reviews) return [];
    
    let filtered = data.reviews.filter(review => {
      const matchesSearch = review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           review.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           review.author.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
      
      const matchesVisibility = visibilityFilter === 'all' ||
                               (visibilityFilter === 'visible' && review.is_visible) ||
                               (visibilityFilter === 'hidden' && !review.is_visible);
      
      const matchesProfanity = profanityFilter === 'all' ||
                              (profanityFilter === 'flagged' && isProfane(review.content)) ||
                              (profanityFilter === 'clean' && !isProfane(review.content));
      
      return matchesSearch && matchesRating && matchesVisibility && matchesProfanity;
    });

    // Sort reviews
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'author':
          aValue = a.author.name.toLowerCase();
          bValue = b.author.name.toLowerCase();
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'date':
          aValue = new Date(Number(a.updated_at));
          bValue = new Date(Number(b.updated_at));
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
  }, [data, searchTerm, ratingFilter, visibilityFilter, profanityFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedReviews.length / itemsPerPage);
  const paginatedReviews = filteredAndSortedReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectReview = (reviewId) => {
    const newSelected = new Set(selectedReviews);
    if (newSelected.has(reviewId)) {
      newSelected.delete(reviewId);
    } else {
      newSelected.add(reviewId);
    }
    setSelectedReviews(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedReviews.size === paginatedReviews.length) {
      setSelectedReviews(new Set());
    } else {
      setSelectedReviews(new Set(paginatedReviews.map(review => review.review_id)));
    }
  };

  const bulkToggleVisibility = async (makeVisible) => {
    for (const reviewId of selectedReviews) {
      const review = paginatedReviews.find(r => r.review_id === reviewId);
      if (review && review.is_visible !== makeVisible) {
        await updateVisibility({ variables: { id: reviewId, isVisible: makeVisible } });
      }
    }
    setSelectedReviews(new Set());
  };

  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReviewStats = () => {
    if (!data?.reviews) return { total: 0, visible: 0, hidden: 0, flagged: 0 };
    
    return {
      total: filteredAndSortedReviews.length,
      visible: filteredAndSortedReviews.filter(r => r.is_visible).length,
      hidden: filteredAndSortedReviews.filter(r => !r.is_visible).length,
      flagged: filteredAndSortedReviews.filter(r => isProfane(r.content)).length
    };
  };

  const stats = getReviewStats();

  const exportToCSV = () => {
    const headers = ['Review ID', 'Author Name', 'Author Email', 'Product', 'Rating', 'Content', 'Visible', 'Flagged', 'Updated'];
    const csvData = filteredAndSortedReviews.map(review => [
      review.review_id,
      review.author.name,
      review.author.email,
      review.product?.product_name || 'Unknown Product',
      review.rating,
      review.content.replace(/"/g, '""'), // Escape quotes
      review.is_visible ? 'Yes' : 'No',
      isProfane(review.content) ? 'Yes' : 'No',
      formatDate(review.updated_at)
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reviews_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalReviews: filteredAndSortedReviews.length,
      stats: stats,
      reviews: filteredAndSortedReviews.map(review => ({
        review_id: review.review_id,
        author: {
          name: review.author.name,
          email: review.author.email
        },
        product_name: review.product?.product_name || 'Unknown Product',
        rating: review.rating,
        content: review.content,
        is_visible: review.is_visible,
        is_flagged: isProfane(review.content),
        updated_at: review.updated_at,
        formatted_updated_at: formatDate(review.updated_at)
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reviews_export_${new Date().toISOString().split('T')[0]}.json`);
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
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-16 bg-slate-100 rounded"></div>
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
              <h3 className="text-red-800 font-semibold">Error Loading Reviews</h3>
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
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Review Management</h1>
          <p className="text-slate-600">Monitor and moderate user reviews with advanced filtering and bulk actions</p>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Reviews</p>
                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Visible</p>
                <p className="text-2xl font-bold text-green-600">{stats.visible}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Hidden</p>
                <p className="text-2xl font-bold text-red-600">{stats.hidden}</p>
              </div>
              <div className="bg-red-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Flagged</p>
                <p className="text-2xl font-bold text-orange-600">{stats.flagged}</p>
              </div>
              <div className="bg-orange-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Search Reviews</label>
              <div className="relative">
                <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by content, author name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            {/* Visibility Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Visibility</label>
              <select
                value={visibilityFilter}
                onChange={(e) => setVisibilityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Reviews</option>
                <option value="visible">Visible Only</option>
                <option value="hidden">Hidden Only</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Profanity Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Content Filter</label>
              <select
                value={profanityFilter}
                onChange={(e) => setProfanityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Content</option>
                <option value="flagged">Flagged Only</option>
                <option value="clean">Clean Only</option>
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
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="rating-desc">Highest Rating</option>
                <option value="rating-asc">Lowest Rating</option>
                <option value="author-asc">Author (A-Z)</option>
                <option value="author-desc">Author (Z-A)</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedReviews.size > 0 && (
            <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4 mt-4">
              <span className="text-blue-700 font-medium">
                {selectedReviews.size} review{selectedReviews.size !== 1 ? 's' : ''} selected
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => bulkToggleVisibility(false)}
                  className="btn-danger text-sm"
                >
                  Hide Selected
                </button>
                <button
                  onClick={() => bulkToggleVisibility(true)}
                  className="btn-success text-sm"
                >
                  Show Selected
                </button>
                <button
                  onClick={() => setSelectedReviews(new Set())}
                  className="btn-secondary text-sm"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}

          {/* Export Options */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mt-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-200 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-slate-800 font-semibold">Export Reviews</h4>
                  <p className="text-sm text-slate-600">Download {filteredAndSortedReviews.length} filtered reviews with moderation data</p>
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

        {/* Reviews Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {filteredAndSortedReviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-slate-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-slate-500 font-medium">No reviews found</p>
              <p className="text-sm text-slate-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedReviews.size === paginatedReviews.length && paginatedReviews.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Review Content
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {paginatedReviews.map((review) => {
                      const flagged = isProfane(review.content);
                      return (
                        <tr 
                          key={review.review_id} 
                          className={`hover:bg-slate-50 transition-colors ${
                            selectedReviews.has(review.review_id) ? 'bg-blue-50' : 
                            flagged ? 'bg-red-50' : ''
                          }`}
                        >
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={selectedReviews.has(review.review_id)}
                              onChange={() => handleSelectReview(review.review_id)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2 rounded-full mr-3">
                                <span className="text-white font-medium text-sm">
                                  {review.author.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">{review.author.name}</p>
                                <p className="text-sm text-slate-500">{review.author.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="max-w-md">
                              <p className="text-slate-700 text-sm leading-relaxed line-clamp-3">
                                {review.content}
                              </p>
                              {flagged && (
                                <div className="flex items-center mt-2">
                                  <svg className="w-4 h-4 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                  </svg>
                                  <span className="text-red-600 text-xs font-medium">Flagged for moderation</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex flex-col items-center">
                              <StarRatings
                                rating={review.rating}
                                starRatedColor="#f59e0b"
                                numberOfStars={5}
                                name={`rating-${review.review_id}`}
                                starDimension="16px"
                                starSpacing="1px"
                              />
                              <span className="text-xs text-slate-500 mt-1">{review.rating}/5</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              review.is_visible 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              <div className={`w-2 h-2 rounded-full mr-1 ${
                                review.is_visible ? 'bg-green-500' : 'bg-red-500'
                              }`}></div>
                              {review.is_visible ? 'Visible' : 'Hidden'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <button
                              onClick={() => toggleVisibility(review.review_id, review.is_visible)}
                              className={`text-sm font-medium transition-colors ${
                                review.is_visible 
                                  ? 'text-red-600 hover:text-red-700' 
                                  : 'text-green-600 hover:text-green-700'
                              }`}
                            >
                              {review.is_visible ? 'Hide' : 'Show'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-slate-700">
                      <span>
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedReviews.length)} of {filteredAndSortedReviews.length} results
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewManagement;