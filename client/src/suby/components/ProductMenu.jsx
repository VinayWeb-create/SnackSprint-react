import React, { useState, useEffect } from 'react';
import { API_URL } from '../api';
import { useParams } from 'react-router-dom';
import TopBar from './TopBar';
import { getProductImageUrl } from '../imageUrl';

const PLACEHOLDER = 'https://res.cloudinary.com/demo/image/upload/v1/samples/food/spices';

const CAT_STYLE = {
  veg:      { bg: '#dcfce7', color: '#16a34a' },
  'non-veg':{ bg: '#fee2e2', color: '#dc2626' },
  snacks:   { bg: '#fef9c3', color: '#ca8a04' },
};

const ProductMenu = () => {
  const [products,   setProducts]   = useState([]);
  const [firmInfo,   setFirmInfo]   = useState(null);
  const [filter,     setFilter]     = useState('all');
  const [loading,    setLoading]    = useState(true);

  const { firmId, firmName } = useParams();

  useEffect(() => {
    fetch(`${API_URL}/product/${firmId}/products`)
      .then(r => r.json())
      .then(data => {
        setProducts(data.products || []);
        setFirmInfo(data);
        setLoading(false);
      })
      .catch(err => { console.error('product failed to fetch', err); setLoading(false); });
  }, [firmId]);

  const filters = [
    { label: 'All',          value: 'all'      },
    { label: '🥦 Veg',       value: 'veg'      },
    { label: '🍗 Non-Veg',   value: 'non-veg'  },
    { label: '🍟 Snacks',    value: 'snacks'   },
    { label: '⭐ Best Seller',value: 'best'     },
  ];

  const filtered = products.filter(p => {
    if (filter === 'all')  return true;
    if (filter === 'best') return p.bestSeller;
    return p.category?.includes(filter);
  });

  return (
    <>
      <TopBar />
      <section className="productSection">

        {/* Firm name header */}
        <h3>{firmName}</h3>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, justifyContent: 'center' }}>
          {filters.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              style={{
                padding: '6px 14px', borderRadius: 99, fontSize: '0.82rem',
                fontWeight: 600, cursor: 'pointer', border: '1px solid',
                borderColor: filter === value ? 'orangered' : '#ccc',
                background:  filter === value ? 'orangered' : 'white',
                color:       filter === value ? 'white'     : '#333',
                transition: '0.2s',
              }}
            >{label}</button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>
            Loading menu...
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>
            No items found.
          </div>
        )}

        {/* Product list */}
        {filtered.map((item) => {
          const imgUrl = getProductImageUrl(item.image);
          return (
            <div className="productBox" key={item._id}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px 20px', borderTop: '1px solid #eee', gap: 12 }}>

              {/* Left: info */}
              <div style={{ flex: 1 }}>
                {/* Category + cuisine badges */}
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 4 }}>
                  {item.category?.map(c => (
                    <span key={c} style={{
                      fontSize: '0.68rem', fontWeight: 700,
                      padding: '2px 7px', borderRadius: 99,
                      background: CAT_STYLE[c]?.bg    || '#f3f4f6',
                      color:      CAT_STYLE[c]?.color || '#374151',
                    }}>{c}</span>
                  ))}
                  {item.cuisine?.map(c => (
                    <span key={c} style={{
                      fontSize: '0.68rem', fontWeight: 700,
                      padding: '2px 7px', borderRadius: 99,
                      background: '#eff6ff', color: '#2563eb',
                    }}>{c}</span>
                  ))}
                  {item.bestSeller && (
                    <span style={{
                      fontSize: '0.68rem', fontWeight: 700,
                      padding: '2px 7px', borderRadius: 99,
                      background: '#fffbeb', color: '#d97706',
                    }}>⭐ Best Seller</span>
                  )}
                </div>

                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a' }}>
                  {item.productName}
                </div>
                <div style={{ fontWeight: 600, color: 'orangered', marginTop: 2 }}>
                  ₹{item.price}
                </div>
                {item.description && (
                  <div style={{ fontSize: '0.82rem', color: '#666', marginTop: 4, maxWidth: 340, lineHeight: 1.4 }}>
                    {item.description}
                  </div>
                )}
              </div>

              {/* Right: image + ADD button */}
              <div className="productGroup" style={{ position: 'relative', flexShrink: 0 }}>
                <img
                  src={imgUrl || PLACEHOLDER}
                  alt={item.productName}
                  onError={e => { e.target.src = PLACEHOLDER; }}
                  style={{
                    width: 100, height: 100,
                    objectFit: 'cover', borderRadius: 8,
                    display: 'block',
                  }}
                />
                <button className="addButton"
                  style={{
                    position: 'absolute', bottom: -12, left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'white', border: '1px solid #ccc',
                    color: 'green', fontWeight: 700, fontSize: '0.8rem',
                    padding: '3px 18px', borderRadius: 5,
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                  }}
                >ADD +</button>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
};

export default ProductMenu;
