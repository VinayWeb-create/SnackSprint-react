// client/src/suby/pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { API_URL } from '../api';
import { Link } from 'react-router-dom';
import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft } from 'react-icons/fa';
import { MagnifyingGlass } from 'react-loader-spinner';
import TopBar, { Toast, OrderSuccessModal } from '../components/TopBar';
import AuthModal from '../components/AuthModal';
import CartDrawer from '../components/CartDrawer';
import { useApp } from '../AppContext';
import { getFirmImageUrl } from '../imageUrl';

const PLACEHOLDER = 'https://placehold.co/240x170/FEE8DF/F4622A?text=🍛';
const CHAIN_PLACEHOLDER = 'https://placehold.co/200x130/FEE8DF/F4622A?text=🍛';

const CATEGORIES = [
  { emoji: '🍛', label: 'South Indian', value: 'south-indian' },
  { emoji: '🫓', label: 'North Indian', value: 'north-indian' },
  { emoji: '🥢', label: 'Chinese',       value: 'chinese'      },
  { emoji: '🥐', label: 'Bakery',        value: 'bakery'       },
  { emoji: '🍔', label: 'Fast Food',     value: 'fast-food'    },
  { emoji: '🍨', label: 'Desserts',      value: 'desserts'     },
  { emoji: '🧃', label: 'Beverages',     value: 'beverages'    },
];

const FOOD_ITEMS = [
  { emoji: '🍛', label: 'Biryani' },
  { emoji: '🍕', label: 'Pizza'   },
  { emoji: '🍔', label: 'Burger'  },
  { emoji: '🥘', label: 'Curry'   },
  { emoji: '🍜', label: 'Noodles' },
  { emoji: '🥐', label: 'Bakery'  },
  { emoji: '🍦', label: 'Ice Cream'},
];

const LandingPage = () => {
  const { showAuth } = useApp();
  const [vendors,        setVendors]        = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [search,         setSearch]         = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetch(`${API_URL}/vendor/all-vendors`)
      .then(r => r.json())
      .then(d => { setVendors(d.vendors || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const allFirms = vendors.flatMap(v => v.firm || []);

  const filtered = allFirms.filter(f => {
    const matchCat = activeCategory === 'all' || f.region?.some(r => r.toLowerCase() === activeCategory);
    const matchSearch = !search || f.firmName.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleScroll = (dir) => {
    const el = document.getElementById('chainGallery');
    el?.scrollTo({ left: el.scrollLeft + (dir === 'left' ? -400 : 400), behavior: 'smooth' });
  };

  return (
    <>
      <TopBar />
      <Toast />
      <OrderSuccessModal />
      {showAuth && <AuthModal />}
      <CartDrawer />

      {/* ── HERO ── */}
      <div className="hero-banner">
        <div className="hero-text">
          <div className="hero-tag">🚀 Free delivery this week</div>
          <h1 className="hero-title">
            Delicious food,<br />
            <span>delivered fast</span>
          </h1>
          <p className="hero-sub">
            Order from the best restaurants in Kakinada. Hot food at your door in 30 minutes.
          </p>
          <div className="hero-search">
            <input
              type="text"
              placeholder="Search for restaurants or dishes…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button>Search 🔍</button>
          </div>
        </div>
        <div className="hero-emojis">🍛🍕🍔</div>
      </div>

      <div className="landingSection">

        {/* ── CATEGORY CHIPS ── */}
        <div className="itemSection" style={{ padding: '24px 0 8px' }}>
          <div
            className={`category-chip ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            <span className="chip-emoji">🍽️</span>
            <span className="chip-label">All</span>
          </div>
          {CATEGORIES.map(({ emoji, label, value }) => (
            <div
              key={value}
              className={`category-chip ${activeCategory === value ? 'active' : ''}`}
              onClick={() => setActiveCategory(value)}
            >
              <span className="chip-emoji">{emoji}</span>
              <span className="chip-label">{label}</span>
            </div>
          ))}
        </div>

        {/* ── CHAINS ── */}
        {!loading && allFirms.length > 0 && (
          <>
            <p className="section-title">Top Chains</p>
            <p className="section-sub">Popular restaurants near you</p>
            <div className="btnSection">
              <button onClick={() => handleScroll('left')}><FaRegArrowAltCircleLeft className="btnIcons" /></button>
              <button onClick={() => handleScroll('right')}><FaRegArrowAltCircleRight className="btnIcons" /></button>
            </div>
            <section className="chainSection" id="chainGallery">
              {allFirms.map(item => {
                const img = getFirmImageUrl(item.image);
                return (
                  <div className="vendorBox" key={item._id}>
                    <Link to={`/products/${item._id}/${item.firmName}`} className="link">
                      <div className="chain-card">
                        <img
                          src={img || CHAIN_PLACEHOLDER}
                          alt={item.firmName}
                          onError={e => { e.target.src = CHAIN_PLACEHOLDER; }}
                        />
                        <div className="chain-card-name">{item.firmName}</div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </section>
          </>
        )}

        {/* ── FIRM GRID ── */}
        <p className="section-title" style={{ marginTop: 40 }}>
          {activeCategory === 'all' ? 'All Restaurants' : `${CATEGORIES.find(c=>c.value===activeCategory)?.emoji || ''} ${activeCategory.replace('-',' ')}`}
        </p>
        <p className="section-sub">
          {filtered.length} restaurant{filtered.length !== 1 ? 's' : ''} available
        </p>

        {/* Filter buttons */}
        <div className="filterButtons">
          <button onClick={() => setActiveCategory('all')} className={activeCategory === 'all' ? 'activeButton' : ''}>All</button>
          {CATEGORIES.map(({ emoji, label, value }) => (
            <button key={value}
              onClick={() => setActiveCategory(value)}
              className={activeCategory === value ? 'activeButton' : ''}>
              {emoji} {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loaderSection">
            <MagnifyingGlass visible height="80" width="80" glassColor="#FEE8DF" color="#F4622A" />
            <div>Finding the best restaurants…</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🔍</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 6 }}>No restaurants found</div>
            <div style={{ fontSize: '0.88rem' }}>Try a different category or search term</div>
          </div>
        ) : (
          <section className="firmSection">
            {filtered.map(item => {
              const img = getFirmImageUrl(item.image);
              return (
                <Link to={`/products/${item._id}/${item.firmName}`} className="link" key={item._id}>
                  <div className="firm-card">
                    <div className="firm-card-img">
                      <img
                        src={img || PLACEHOLDER}
                        alt={item.firmName}
                        onError={e => { e.target.src = PLACEHOLDER; }}
                      />
                      {item.offer && <div className="firmOffer">🎁 {item.offer}</div>}
                    </div>
                    <div className="firm-card-body">
                      <div className="firmName">{item.firmName}</div>
                      <div className="firmArea">📍 {item.area}</div>
                      <div className="firm-badges" style={{ marginTop: 8 }}>
                        {item.category?.map(c => (
                          <span key={c} className={`badge badge-${c === 'veg' ? 'veg' : c === 'non-veg' ? 'nonveg' : 'snacks'}`}>
                            {c === 'veg' ? '🥦 Veg' : c === 'non-veg' ? '🍗 Non-Veg' : '🍟 Snacks'}
                          </span>
                        ))}
                        {item.region?.map(r => (
                          <span key={r} className="badge badge-blue">{r}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </section>
        )}
      </div>
    </>
  );
};

export default LandingPage;
