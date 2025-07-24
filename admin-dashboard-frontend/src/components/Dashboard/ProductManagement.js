import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { FETCH_PRODUCT_LIST } from '../../graphql/queries/fetchProductList';
import { ADD_PRODUCT } from '../../graphql/mutations/addProduct';
import { EDIT_PRODUCT } from '../../graphql/mutations/editProduct';
import { DELETE_PRODUCT } from '../../graphql/mutations/deleteProduct';
import ProductModal from './ProductModal';

const ProductManagement = () => {
  const { loading, error, data } = useQuery(FETCH_PRODUCT_LIST, {
    onError: (err) => console.error('Failed to fetch products:', err)
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [addProduct] = useMutation(ADD_PRODUCT, {
    refetchQueries: [{ query: FETCH_PRODUCT_LIST }],
    onError: (error) => {
      console.error("Error adding product:", error);
      setErrorMessage(error.message);
      setSuccessMessage('');
    },
    onCompleted: () => {
      setSuccessMessage('Product added successfully!');
      setErrorMessage('');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  });
  
  const [editProduct] = useMutation(EDIT_PRODUCT, {
    refetchQueries: [{ query: FETCH_PRODUCT_LIST }],
    onError: (error) => {
      console.error("Error editing product:", error);
      setErrorMessage(error.message);
      setSuccessMessage('');
    },
    onCompleted: () => {
      setSuccessMessage('Product updated successfully!');
      setErrorMessage('');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  });
  
  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    refetchQueries: [{ query: FETCH_PRODUCT_LIST }],
    onError: (error) => {
      console.error("Error deleting product:", error);
      setErrorMessage(error.message);
      setSuccessMessage('');
    },
    onCompleted: () => {
      setSuccessMessage('Product deleted successfully!');
      setErrorMessage('');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  });

  const handleOpenModalForAdd = () => {
    setCurrentProduct(null);
    setModalOpen(true);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleOpenModalForEdit = (product) => {
    setCurrentProduct(product);
    setModalOpen(true);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (currentProduct) {
        await editProduct({ variables: { id: currentProduct.product_id, productInput: productData } });
      } else {
        await addProduct({ variables: { productInput: productData } });
      }
      setModalOpen(false);
    } catch (err) {
      setErrorMessage("Failed to save product: " + err.message);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const executeDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct({ variables: { id: productToDelete.product_id } });
        setShowDeleteConfirm(false);
        setProductToDelete(null);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  // Calculate metrics
  const totalProducts = data?.products?.length || 0;
  const specialProducts = data?.products?.filter(product => product.is_special)?.length || 0;
  const lowStockProducts = data?.products?.filter(product => product.product_stock < 10)?.length || 0;

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    if (!data?.products) return [];
    
    let filtered = data.products.filter(product => {
      const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.product_description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStock = stockFilter === 'all' || 
                          (stockFilter === 'low' && product.product_stock < 10) ||
                          (stockFilter === 'out' && product.product_stock === 0) ||
                          (stockFilter === 'in' && product.product_stock > 0);
      
      const matchesCategory = categoryFilter === 'all' ||
                             (categoryFilter === 'special' && product.is_special) ||
                             (categoryFilter === 'regular' && !product.is_special);
      
      return matchesSearch && matchesStock && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.product_name.toLowerCase();
          bValue = b.product_name.toLowerCase();
          break;
        case 'price':
          aValue = parseFloat(a.product_price);
          bValue = parseFloat(b.product_price);
          break;
        case 'stock':
          aValue = a.product_stock;
          bValue = b.product_stock;
          break;
        case 'updated':
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
  }, [data, searchTerm, categoryFilter, stockFilter, sortBy, sortOrder]);

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'red' };
    if (stock < 10) return { label: 'Low Stock', color: 'yellow' };
    return { label: 'In Stock', color: 'green' };
  };

  const exportToCSV = () => {
    const headers = ['Product ID', 'Name', 'Description', 'Price', 'Stock', 'Min Purchase Unit', 'Special', 'Updated'];
    const csvData = filteredAndSortedProducts.map(product => [
      product.product_id,
      product.product_name,
      product.product_description.replace(/"/g, '""'), // Escape quotes
      product.product_price,
      product.product_stock,
      product.minimum_purchase_unit,
      product.is_special ? 'Yes' : 'No',
      formatDate(product.updated_at)
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalProducts: filteredAndSortedProducts.length,
      products: filteredAndSortedProducts.map(product => ({
        product_id: product.product_id,
        product_name: product.product_name,
        product_description: product.product_description,
        product_price: parseFloat(product.product_price),
        product_stock: product.product_stock,
        minimum_purchase_unit: product.minimum_purchase_unit,
        is_special: product.is_special,
        stock_status: getStockStatus(product.product_stock).label,
        updated_at: product.updated_at,
        formatted_updated_at: formatDate(product.updated_at)
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.json`);
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-slate-100 rounded-lg p-4">
                  <div className="h-48 bg-slate-200 rounded mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                </div>
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
              <h3 className="text-red-800 font-semibold">Error Loading Products</h3>
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
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <h1 className='text-4xl font-bold text-white mb-2'>Product Management</h1>
                  <p className='text-xl text-white/90'>Manage your product catalog, inventory, and pricing</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-sm text-white/80">{totalProducts} Total Products</span>
                    </div>
                    <div className="text-sm text-white/80">•</div>
                    <span className="text-sm text-white/80">{specialProducts} Special</span>
                    <div className="text-sm text-white/80">•</div>
                    <span className="text-sm text-white/80 font-medium">{lowStockProducts} Low Stock</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden lg:flex items-center space-x-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 text-center">
                    <p className="text-2xl font-bold text-white">{totalProducts > 0 ? Math.round(((totalProducts - lowStockProducts) / totalProducts) * 100) : 0}%</p>
                    <p className="text-sm text-white/80">Stock Health</p>
                  </div>
                </div>
                <button
                  onClick={handleOpenModalForAdd}
                  className="bg-white text-green-700 font-medium px-6 py-3 rounded-xl hover:bg-white/90 transition-all duration-200 flex items-center gap-2 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Product
                </button>
              </div>
            </div>
          </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Search Products</label>
              <div className="relative">
                <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Products</option>
                <option value="special">Special Items</option>
                <option value="regular">Regular Items</option>
              </select>
            </div>

            {/* Stock Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Stock Status</label>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Stock</option>
                <option value="in">In Stock</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
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
                <option value="price-asc">Price (Low-High)</option>
                <option value="price-desc">Price (High-Low)</option>
                <option value="stock-asc">Stock (Low-High)</option>
                <option value="stock-desc">Stock (High-Low)</option>
                <option value="updated-desc">Recently Updated</option>
              </select>
            </div>
          </div>

          {/* View Toggle and Export */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">
                Showing {filteredAndSortedProducts.length} of {data?.products?.length || 0} products
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Export Buttons */}
              <div className="flex items-center space-x-3 bg-gradient-to-r from-green-50 to-blue-50 px-4 py-2 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <div className="bg-green-200 p-1.5 rounded-lg">
                    <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-700">Export:</span>
                </div>
                <button
                  onClick={exportToCSV}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium text-sm py-2 px-3 rounded-lg transition-all duration-200 flex items-center space-x-1.5 shadow-sm hover:shadow-md transform hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>CSV</span>
                </button>
                <button
                  onClick={exportToJSON}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 px-3 rounded-lg transition-all duration-200 flex items-center space-x-1.5 shadow-sm hover:shadow-md transform hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <span>JSON</span>
                </button>
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">View:</span>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Display */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-slate-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-slate-500 font-medium">No products found</p>
              <p className="text-sm text-slate-400">Try adjusting your search or filters</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {filteredAndSortedProducts.map((product) => {
                const stockStatus = getStockStatus(product.product_stock);
                return (
                  <div key={product.product_id} className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <div className="relative">
                      <img 
                        src={product.product_image ? `http://localhost:4001/${product.product_image}` : '/images/product-default.jpeg'} 
                        alt={product.product_name} 
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = '/images/product-default.jpeg';
                        }}
                      />
                      {product.is_special && (
                        <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Special
                        </div>
                      )}
                      <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-medium ${
                        stockStatus.color === 'red' ? 'bg-red-100 text-red-700' :
                        stockStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {stockStatus.label}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2">{product.product_name}</h3>
                      <p className="text-slate-600 text-sm mb-3 line-clamp-2">{product.product_description}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-green-600">${product.product_price}</span>
                        <span className="text-sm text-slate-500">Stock: {product.product_stock}</span>
                      </div>
                      
                      <div className="text-xs text-slate-500 mb-4">
                        <p>Min unit: {product.minimum_purchase_unit}</p>
                        <p>Updated: {formatDate(product.updated_at)}</p>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleOpenModalForEdit(product)}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium text-sm py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md transform hover:scale-105"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => confirmDelete(product)}
                          className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium text-sm py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md transform hover:scale-105"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredAndSortedProducts.map((product) => {
                const stockStatus = getStockStatus(product.product_stock);
                return (
                  <div key={product.product_id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={product.product_image ? `http://localhost:4001/${product.product_image}` : '/images/product-default.jpeg'} 
                        alt={product.product_name} 
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = '/images/product-default.jpeg';
                        }}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-bold text-slate-800 text-lg">{product.product_name}</h3>
                          {product.is_special && (
                            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                              Special
                            </span>
                          )}
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            stockStatus.color === 'red' ? 'bg-red-100 text-red-700' :
                            stockStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {stockStatus.label}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-2 line-clamp-1">{product.product_description}</p>
                        <div className="flex items-center text-sm text-slate-500 space-x-4">
                          <span>Stock: {product.product_stock}</span>
                          <span>Min unit: {product.minimum_purchase_unit}</span>
                          <span>Updated: {formatDate(product.updated_at)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl font-bold text-green-600">${product.product_price}</span>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleOpenModalForEdit(product)}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium text-sm py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md transform hover:scale-105"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => confirmDelete(product)}
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium text-sm py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md transform hover:scale-105"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Modal */}
        {modalOpen && (
          <ProductModal 
            isOpen={modalOpen} 
            onClose={handleCloseModal} 
            product={currentProduct} 
            onSave={handleSaveProduct}
          />
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900">Delete Product</h3>
              </div>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete "{productToDelete?.product_name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  className="btn-danger"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;