import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Check } from 'lucide-react';
import api from '../api/client';
import { useCart } from '../context/CartContext';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [addedItem, setAddedItem] = useState(null);

  const { addToCart } = useCart();

  const categories = ['All', 'Trekking', 'Camping', 'Climbing'];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = '/products?';
      if (selectedCategory !== 'All') url += `category=${encodeURIComponent(selectedCategory)}&`;
      if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}&`;

      const res = await api.get(url);
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching gear products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedItem(product._id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  return (
    <div className="container page">
      <div className="section-header">
        <div>
          <h2>Technical Outdoor & Trekking Gear</h2>
          <p>Field-tested rucksacks, alpine sleeping bags, tents and boots ready for high altitudes</p>
        </div>
      </div>

      {/* Filter and Category Bar */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
          <Search size={18} color="#6b7280" />
          <input
            type="text"
            placeholder="Search equipment by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <p>Loading equipment...</p>
      ) : products.length === 0 ? (
        <div className="form-card" style={{ textAlign: 'center' }}>
          <h3>No products found</h3>
          <p style={{ color: '#6b7280', margin: '10px 0' }}>Try searching with different terms.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchTerm('');
            }}
            className="btn btn-outline btn-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid-4">
          {products.map((product) => (
            <div key={product._id} className="card">
              <Link to={`/shop/${product._id}`}>
                <img src={product.image} alt={product.name} className="card-img" style={{ height: '180px' }} />
              </Link>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span className="badge badge-info">{product.category}</span>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>{product.brand}</span>
                </div>

                <Link to={`/shop/${product._id}`}>
                  <h3 className="card-title" style={{ fontSize: '16px' }}>{product.name}</h3>
                </Link>

                <p className="card-desc" style={{ fontSize: '13px' }}>{product.description}</p>

                <div className="card-footer">
                  <div className="price">₹{product.price.toLocaleString()}</div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`btn btn-sm ${addedItem === product._id ? 'btn-secondary' : 'btn-primary'}`}
                  >
                    {addedItem === product._id ? (
                      <>
                        <Check size={14} /> Added
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={14} /> Add
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
