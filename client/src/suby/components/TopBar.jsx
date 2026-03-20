// client/src/suby/components/TopBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../AppContext';

export const Toast = () => {
  const { toasts } = useApp();
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}&nbsp;&nbsp;{t.message}
        </div>
      ))}
    </div>
  );
};

export const OrderSuccessModal = () => {
  const { orderSuccess, setOrderSuccess } = useApp();
  if (!orderSuccess) return null;
  return (
    <div className="modal-overlay" onClick={() => setOrderSuccess(null)}>
      <div className="order-success-modal">
        <div className="success-icon">✓</div>
        <div className="success-title">Order Placed!</div>
        <div className="success-sub">
          Your order from <strong>{orderSuccess.firmName}</strong> has been received.
          We'll have it ready soon! 🍽️
        </div>
        <div className="order-id-box">
          Order ID: <strong>{orderSuccess.orderId}</strong><br />
          Total: <strong>₹{Number(orderSuccess.total).toFixed(0)}</strong>
        </div>
        <button className="btn-primary" style={{ width: '100%', padding: '12px' }}
          onClick={() => setOrderSuccess(null)}>
          Continue Browsing
        </button>
      </div>
    </div>
  );
};

const TopBar = () => {
  const { user, logout, setShowAuth, cartCount, setCartOpen } = useApp();
  const initial = user?.username?.[0]?.toUpperCase();

  return (
    <section className="topBarSection">
      <div className="companyTitle">
        <Link to="/" className="link"><h2>🍛 SnackSprint</h2></Link>
      </div>

      <div className="searchBar" style={{ display: 'flex' }}>
        <span style={{ color: 'var(--muted)' }}>🔍</span>
        <input type="text" placeholder="Search restaurants…" />
      </div>

      <div className="nav-right">
        {/* Cart */}
        <button className="cart-btn" onClick={() => setCartOpen(true)}>
          🛒 Cart
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>

        {/* Auth */}
        {user ? (
          <div className="user-pill" onClick={logout} title="Click to logout">
            <div className="user-avatar">{initial}</div>
            <span className="user-name">{user.username}</span>
          </div>
        ) : (
          <>
            <button className="btn-ghost" onClick={() => setShowAuth(true)}>Login</button>
            <button className="btn-primary" onClick={() => setShowAuth(true)}>Register</button>
          </>
        )}
      </div>
    </section>
  );
};

export default TopBar;
