import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, Calendar, Package, MapPin, Tag } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { getLocalBookings, getLocalOrders, mergeRecords } from '../utils/userStore';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('adventures');

  const [adventures, setAdventures] = useState([]);
  const [products, setProducts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Add Adventure form
  const [newAdv, setNewAdv] = useState({
    title: '',
    destination: '',
    sport: 'Trekking',
    difficulty: 'Moderate',
    duration: '3 Days / 2 Nights',
    price: '',
    image: '',
    description: ''
  });

  // Add Product form
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'Trekking',
    price: '',
    stock: 15,
    image: '',
    description: '',
    brand: 'Wildtrail'
  });

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin, activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'adventures') {
        const res = await api.get('/adventures');
        setAdventures(res.data);
      } else if (activeTab === 'products') {
        const res = await api.get('/products');
        setProducts(res.data);
      } else if (activeTab === 'bookings') {
        let apiBookings = [];
        try {
          const res = await api.get('/bookings/all');
          if (Array.isArray(res.data)) apiBookings = res.data;
        } catch (err) {}
        setBookings(mergeRecords(apiBookings, getLocalBookings()));
      } else if (activeTab === 'orders') {
        let apiOrders = [];
        try {
          const res = await api.get('/orders/all');
          if (Array.isArray(res.data)) apiOrders = res.data;
        } catch (err) {}
        setOrders(mergeRecords(apiOrders, getLocalOrders()));
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdventure = async (e) => {
    e.preventDefault();
    try {
      await api.post('/adventures', {
        ...newAdv,
        price: Number(newAdv.price)
      });
      setMessage({ type: 'success', text: 'New Adventure added successfully!' });
      setNewAdv({
        title: '',
        destination: '',
        sport: 'Trekking',
        difficulty: 'Moderate',
        duration: '3 Days / 2 Nights',
        price: '',
        image: '',
        description: ''
      });
      loadData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error creating adventure' });
    }
  };

  const handleDeleteAdventure = async (id) => {
    if (!window.confirm('Are you sure you want to delete this adventure?')) return;
    try {
      await api.delete(`/adventures/${id}`);
      setMessage({ type: 'success', text: 'Adventure deleted' });
      loadData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Error deleting adventure' });
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', {
        ...newProd,
        price: Number(newProd.price),
        stock: Number(newProd.stock)
      });
      setMessage({ type: 'success', text: 'New gear product added!' });
      setNewProd({
        name: '',
        category: 'Trekking',
        price: '',
        stock: 15,
        image: '',
        description: '',
        brand: 'Wildtrail'
      });
      loadData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error creating product' });
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setMessage({ type: 'success', text: 'Product deleted' });
      loadData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Error deleting product' });
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setMessage({ type: 'success', text: `Order status changed to ${newStatus}` });
      loadData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Error updating order status' });
    }
  };

  if (!isAdmin) {
    return (
      <div className="container page" style={{ textAlign: 'center' }}>
        <div className="form-card">
          <h2 style={{ color: '#dc2626' }}>Access Denied</h2>
          <p style={{ color: '#6b7280', margin: '16px 0' }}>
            You need Administrator privileges to view this section.
          </p>
          <p style={{ fontSize: '13px' }}>
            Please log in with the admin account: <strong>admin@wildtrail.com</strong> / <strong>Admin@123</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="section-header">
        <div>
          <h2>Administrator Management Portal</h2>
          <p>Logged in as: {user?.name} ({user?.email})</p>
        </div>
        <span className="badge badge-success" style={{ padding: '6px 12px', fontSize: '13px' }}>
          <ShieldCheck size={16} style={{ display: 'inline', marginRight: '4px' }} /> Master Admin
        </span>
      </div>

      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #e5e7eb', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['adventures', 'products', 'bookings', 'orders'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setMessage({ type: '', text: '' });
            }}
            style={{
              padding: '10px 18px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '3px solid var(--primary)' : 'none',
              fontWeight: '700',
              fontSize: '14px',
              textTransform: 'capitalize',
              color: activeTab === tab ? 'var(--primary)' : '#6b7280',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading admin records...</p>
      ) : activeTab === 'adventures' ? (
        /* Adventures Management */
        <div className="grid-2" style={{ gridTemplateColumns: '1.4fr 1fr', alignItems: 'flex-start' }}>
          <div className="table-container">
            <h3 style={{ padding: '16px 18px', borderBottom: '1px solid #e5e7eb', fontSize: '16px' }}>Current Expeditions</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Title & Destination</th>
                  <th>Sport</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {adventures.map((a) => (
                  <tr key={a._id}>
                    <td>
                      <strong>{a.title}</strong>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{a.destination}</div>
                    </td>
                    <td><span className="badge badge-info">{a.sport}</span></td>
                    <td>₹{a.price.toLocaleString()}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteAdventure(a._id)}
                        className="btn btn-danger btn-sm"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Adventure Form */}
          <div className="form-card" style={{ maxWidth: '100%' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '14px' }}>Add New Adventure</h3>
            <form onSubmit={handleAddAdventure}>
              <div className="form-group">
                <label className="form-label">Trip Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Kedarkantha Winter Summit"
                  value={newAdv.title}
                  onChange={(e) => setNewAdv({ ...newAdv, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Destination</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Sankri, Uttarakhand"
                  value={newAdv.destination}
                  onChange={(e) => setNewAdv({ ...newAdv, destination: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Sport</label>
                  <select
                    className="form-control"
                    value={newAdv.sport}
                    onChange={(e) => setNewAdv({ ...newAdv, sport: e.target.value })}
                  >
                    <option value="Trekking">Trekking</option>
                    <option value="River Rafting">River Rafting</option>
                    <option value="Safari">Safari</option>
                    <option value="Scuba Diving">Scuba Diving</option>
                    <option value="Rock Climbing">Rock Climbing</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select
                    className="form-control"
                    value={newAdv.difficulty}
                    onChange={(e) => setNewAdv({ ...newAdv, difficulty: e.target.value })}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Extreme">Extreme</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 8500"
                    value={newAdv.price}
                    onChange={(e) => setNewAdv({ ...newAdv, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 4 Days / 3 Nights"
                    value={newAdv.duration}
                    onChange={(e) => setNewAdv({ ...newAdv, duration: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://images.unsplash.com/..."
                  value={newAdv.image}
                  onChange={(e) => setNewAdv({ ...newAdv, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Brief summary of the expedition..."
                  value={newAdv.description}
                  onChange={(e) => setNewAdv({ ...newAdv, description: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                <Plus size={16} /> Save Adventure
              </button>
            </form>
          </div>
        </div>
      ) : activeTab === 'products' ? (
        /* Products Management */
        <div className="grid-2" style={{ gridTemplateColumns: '1.4fr 1fr', alignItems: 'flex-start' }}>
          <div className="table-container">
            <h3 style={{ padding: '16px 18px', borderBottom: '1px solid #e5e7eb', fontSize: '16px' }}>Current Gear Catalog</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <strong>{p.name}</strong>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Brand: {p.brand}</div>
                    </td>
                    <td><span className="badge badge-info">{p.category}</span></td>
                    <td>₹{p.price.toLocaleString()}</td>
                    <td>{p.stock}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="btn btn-danger btn-sm"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Product Form */}
          <div className="form-card" style={{ maxWidth: '100%' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '14px' }}>Add New Gear Product</h3>
            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Alpine 45L Pack"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                  >
                    <option value="Trekking">Trekking</option>
                    <option value="Camping">Camping</option>
                    <option value="Climbing">Climbing</option>
                    <option value="Apparel">Apparel</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newProd.brand}
                    onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 2499"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://images.unsplash.com/..."
                  value={newProd.image}
                  onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Technical specifications and material..."
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                <Plus size={16} /> Save Product
              </button>
            </form>
          </div>
        </div>
      ) : activeTab === 'bookings' ? (
        /* Bookings View */
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Booking Details</th>
                <th>Explorer Name & Contact</th>
                <th>Date & Guests</th>
                <th>Total Paid</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>
                    <strong>{b.itemTitle}</strong>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      <span className="badge badge-info">{b.bookingType}</span> &nbsp; {b.destination}
                    </div>
                  </td>
                  <td>
                    {b.user?.name || 'User'}
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{b.user?.email}</div>
                  </td>
                  <td>
                    {b.startDate}
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{b.guests} Guests</div>
                  </td>
                  <td style={{ fontWeight: '700' }}>₹{b.totalPrice.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${b.status === 'Confirmed' ? 'badge-success' : 'badge-warning'}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Orders View */
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Customer</th>
                <th>Items Ordered</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>
                    <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>{o._id.slice(-8)}</span>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>
                      {new Date(o.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <strong>{o.shippingAddress?.name || o.user?.name}</strong>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {o.shippingAddress?.city} (Ph: {o.shippingAddress?.phone})
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '13px' }}>
                      {o.items?.map((it, idx) => (
                        <div key={idx}>• {it.name} (x{it.quantity})</div>
                      ))}
                    </div>
                  </td>
                  <td style={{ fontWeight: '700' }}>₹{o.totalAmount.toLocaleString()}</td>
                  <td><span className="badge badge-info">{o.paymentMethod}</span></td>
                  <td>
                    <select
                      className="form-control"
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                      value={o.status}
                      onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                    >
                      <option value="Placed">Placed</option>
                      <option value="Processing">Processing</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
