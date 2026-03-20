import React, { useState, useEffect } from 'react';
import { API_URL } from '../api';
import { Link } from 'react-router-dom';
import { getFirmImageUrl } from '../imageUrl';

const PLACEHOLDER = 'https://res.cloudinary.com/demo/image/upload/v1/samples/food/spices';

const FILTERS = [
  { label: 'All',          value: 'all' },
  { label: '🍛 South Indian', value: 'south-indian' },
  { label: '🫓 North Indian', value: 'north-indian' },
  { label: '🥢 Chinese',      value: 'chinese'      },
  { label: '🥐 Bakery',       value: 'bakery'       },
];

const FirmCollections = () => {
  const [firmData,       setFirmData]       = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetch(`${API_URL}/vendor/all-vendors`)
      .then(r => r.json())
      .then(d => setFirmData(d.vendors || []))
      .catch(err => console.error('firm data not fetched', err));
  }, []);

  // Collect all firms flat
  const allFirms = firmData.flatMap(vendor => vendor.firm || []);

  const filtered = activeCategory === 'all'
    ? allFirms
    : allFirms.filter(f =>
        f.region?.some(r => r.toLowerCase() === activeCategory)
      );

  return (
    <>
      <h3>Restaurants with online food delivery in Kakinada</h3>

      {/* Filter buttons */}
      <div className="filterButtons" style={{ flexWrap: 'wrap', gap: 8 }}>
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActiveCategory(value)}
            className={activeCategory === value ? 'activeButton' : ''}
            style={{ borderRadius: 6, padding: '6px 14px', cursor: 'pointer', border: '1px solid #ccc' }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Firm grid */}
      <section className="firmSection">
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', padding: 40 }}>
            No restaurants found for this category.
          </div>
        )}

        {filtered.map((item) => {
          const imgUrl = getFirmImageUrl(item.image);
          return (
            <Link to={`/products/${item._id}/${item.firmName}`} className="link" key={item._id}>
              <div className="zoomEffect">
                <div className="firmGroupBox">
                  <div className="firmGroup" style={{ position: 'relative' }}>
                    <img
                      src={imgUrl || PLACEHOLDER}
                      alt={item.firmName}
                      onError={e => { e.target.src = PLACEHOLDER; }}
                      style={{ width: 240, height: 180, objectFit: 'cover', borderRadius: 10 }}
                    />
                    {item.offer && (
                      <div className="firmOffer">{item.offer}</div>
                    )}
                  </div>

                  <div className="firmDetails">
                    <strong className="firmName">{item.firmName}</strong>

                    {/* Category badges: veg / non-veg / snacks */}
                    {item.category?.length > 0 && (
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
                        {item.category.map(c => (
                          <span key={c} style={{
                            fontSize: '0.68rem', fontWeight: 700,
                            padding: '2px 7px', borderRadius: 99,
                            background: c === 'veg' ? '#dcfce7' : c === 'non-veg' ? '#fee2e2' : '#fef9c3',
                            color:      c === 'veg' ? '#16a34a' : c === 'non-veg' ? '#dc2626' : '#ca8a04',
                          }}>{c}</span>
                        ))}
                      </div>
                    )}

                    {/* Region tags */}
                    <div className="firmArea" style={{ marginTop: 4 }}>
                      {item.region?.join(', ')}
                    </div>
                    <div className="firmArea">{item.area}</div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </>
  );
};

export default FirmCollections;
