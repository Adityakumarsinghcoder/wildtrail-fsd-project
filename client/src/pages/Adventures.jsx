import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Search } from 'lucide-react';
import api from '../api/client';

const Adventures = () => {
  const [adventures, setAdventures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [destinationFilter, setDestinationFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');

  useEffect(() => {
    fetchAdventures();
  }, [destinationFilter, difficultyFilter]);

  const fetchAdventures = async () => {
    try {
      setLoading(true);
      let url = '/adventures?';
      if (destinationFilter) url += `destination=${encodeURIComponent(destinationFilter)}&`;
      if (difficultyFilter) url += `difficulty=${encodeURIComponent(difficultyFilter)}&`;

      const res = await api.get(url);
      setAdventures(res.data);
    } catch (err) {
      console.error('Error fetching adventures:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page">
      <div className="section-header">
        <div>
          <h2>Adventure Expeditions</h2>
          <p>Explore thrilling treks, river rafting, and mountain safaris across India</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
          <Search size={18} color="#6b7280" />
          <input
            type="text"
            placeholder="Search by destination (e.g. Manali, Ladakh, Goa)..."
            value={destinationFilter}
            onChange={(e) => setDestinationFilter(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Moderate">Moderate</option>
          <option value="Extreme">Extreme</option>
        </select>
      </div>

      {/* Adventures List */}
      {loading ? (
        <p>Loading expeditions...</p>
      ) : adventures.length === 0 ? (
        <div className="form-card" style={{ textAlign: 'center' }}>
          <h3>No adventures found</h3>
          <p style={{ color: '#6b7280', margin: '10px 0' }}>Try adjusting your search or filters.</p>
          <button
            onClick={() => {
              setDestinationFilter('');
              setDifficultyFilter('');
            }}
            className="btn btn-outline btn-sm"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {adventures.map((adv) => (
            <div key={adv._id} className="card">
              <img src={adv.image} alt={adv.title} className="card-img" />
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge badge-info">{adv.sport}</span>
                  <span className={`badge ${adv.difficulty === 'Extreme' ? 'badge-warning' : 'badge-success'}`}>
                    {adv.difficulty}
                  </span>
                </div>
                <h3 className="card-title">{adv.title}</h3>
                <div className="card-meta">
                  <MapPin size={14} /> {adv.destination}
                </div>
                <div className="card-meta">
                  <Calendar size={14} /> {adv.duration}
                </div>
                <p className="card-desc">{adv.description}</p>
                <div className="card-footer">
                  <div className="price">₹{adv.price.toLocaleString()}</div>
                  <Link to={`/adventures/${adv._id}`} className="btn btn-primary btn-sm">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Adventures;
