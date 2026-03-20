// client/src/suby/components/ProductMenu.jsx
import React, { useState, useEffect } from 'react';
import { API_URL } from '../api';
import { useParams } from 'react-router-dom';
import TopBar, { Toast, OrderSuccessModal } from './TopBar';
import { getProductImageUrl } from '../imageUrl';
import { useApp } from '../AppContext';

const PLACEHOLDER = 'https://placehold.co/110x110/FEE8DF/F4622A?text=🍴';
const CAT_STYLE = {
  veg:       { bg: 'var(--green-lite)', color: 'var(--green)' },
  'non-veg': { bg: 'var(--red-lite)',   color: 'var(--red)'   },
  snacks:    { bg: '#fff8e1',           color: '#f57f17'       },
};

const ProductMenu = () => {
  const [products, setProducts] = useState([]);
  const [filter,   setFilter]   = useState('all');
  const [loading,  setLoading]  = useState(true);
  const { firmId, firmName }    = useParams();
  const { addToCart, setCartOpen } = useApp();

  useEffect(() => {
    fetch(`${API_URL}/product/${firmId}/products`)
      .then(r => r.json())
      .then(d => { setProducts(d.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [firmId]);

  const FILTERS = [
    { label: 'All',           value: 'all'   },
    { label: '🥦 Veg',        value: 'veg'   },
    { label: '🍗 Non-Veg',    value: 'non-veg'},
    { label: '🍟 Snacks',     value: 'snacks'},
    { label: '⭐ Best Sellers',value: 'best'  },
  ];

  const filtered = products.filter(p => {
    if (filter === 'all')  return true;
    if (filter === 'best') return p.bestSeller;
    return p.category?.includes(filter);
  });

  return (
    <>
      <TopBar />
      <Toast />
      <OrderSuccessModal />

      <section className="productSection">
        <h3>{decodeURIComponent(firmName)}</h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', margin: '4px 0 0' }}>
          {products.length} items on the menu
        </p>

        {/* Filters */}
        <div className="product-filters">
          {FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`product-filter-btn ${filter === value ? 'active' : ''}`}
            >{label}</button>
          ))}
        </div>

        {loading && (
          <div className="loaderSection"><div>Loading menu…</div></div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🍽️</div>
            No items found.
          </div>
        )}

        {filtered.map((item, idx) => {
          const imgUrl = getProductImageUrl(item.image);
          return (
            <div className="productBox" key={item._id}
              style={{ animationDelay: `${idx * 0.05}s` }}>

              {/* Info */}
              <div className="product-info">
                {/* Badges */}
                <div className="product-badges">
                  {item.category?.map(c => (
                    <span key={c} className="badge"
                      style={{ background: CAT_STYLE[c]?.bg || '#f3f4f6', color: CAT_STYLE[c]?.color || '#374151' }}>
                      {c}
                    </span>
                  ))}
                  {item.cuisine?.map(c => (
                    <span key={c} className="badge badge-blue">{c}</span>
                  ))}
                  {item.bestSeller && (
                    <span className="badge" style={{ background: '#fff8e1', color: '#f57f17' }}>⭐ Best Seller</span>
                  )}
                </div>
                <div className="product-name">{item.productName}</div>
                <div className="product-price">₹{item.price}</div>
                {item.description && (
                  <div className="product-desc">{item.description}</div>
                )}
              </div>

              {/* Image + ADD */}
              <div className="productGroup">
                <img
                  src={imgUrl || PLACEHOLDER}
                  alt={item.productName}
                  onError={e => { e.target.src = PLACEHOLDER; }}
                />
                <button
                  className="addButton"
                  onClick={() => {
                    addToCart(item, firmId, decodeURIComponent(firmName));
                    setCartOpen(true);
                  }}
                >
                  ADD +
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
};

export default ProductMenu;
