// client/src/suby/components/CartDrawer.jsx
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { getProductImageUrl } from '../imageUrl';

const CartDrawer = () => {
  const { cart, cartOpen, setCartOpen, updateQty, cartTotal, placeOrder, user, setShowAuth } = useApp();
  const [address, setAddress]   = useState('');
  const [step,    setStep]      = useState('cart'); // 'cart' | 'address'
  const [placing, setPlacing]   = useState(false);

  const handleCheckout = async () => {
    if (!user) { setShowAuth(true); return; }
    if (step === 'cart') { setStep('address'); return; }
    if (!address.trim()) return;
    setPlacing(true);
    await placeOrder(address);
    setPlacing(false);
    setStep('cart');
    setAddress('');
  };

  if (!cartOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={() => setCartOpen(false)} />
      <div className="cart-drawer">
        {/* Header */}
        <div className="cart-header">
          <h3>
            {step === 'address' ? '📍 Delivery Address' : '🛒 Your Cart'}
          </h3>
          <button className="cart-close" onClick={() => { setCartOpen(false); setStep('cart'); }}>✕</button>
        </div>

        {cart.firmName && (
          <div className="cart-firm-name">
            Ordering from <span>{cart.firmName}</span>
          </div>
        )}

        {/* ADDRESS STEP */}
        {step === 'address' ? (
          <div style={{ flex: 1, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.5 }}>
              Enter your full delivery address
            </p>
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="e.g. 12 Main Street, Kakinada, Andhra Pradesh 533001"
              rows={4}
              style={{
                width: '100%', padding: '12px 14px',
                border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.9rem', resize: 'none',
                outline: 'none', background: 'var(--cream)',
                transition: '0.2s',
              }}
              onFocus={e => { e.target.style.borderColor = 'var(--saffron)'; e.target.style.boxShadow = '0 0 0 3px var(--saffron-lite)'; }}
              onBlur={e  => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
            />
            {/* Order summary */}
            <div style={{ background: 'var(--cream)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 6 }}>Order Summary</div>
              {cart.items.map(i => (
                <div key={i._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 3 }}>
                  <span>{i.productName} × {i.qty}</span>
                  <span style={{ fontWeight: 700 }}>₹{(Number(i.price) * i.qty).toFixed(0)}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', marginTop: 8, paddingTop: 8,
                display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Total</span>
                <span style={{ color: 'var(--saffron)' }}>₹{cartTotal.toFixed(0)}</span>
              </div>
            </div>
            <button onClick={() => setStep('cart')}
              style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer',
                fontSize: '0.85rem', textAlign: 'left', marginTop: 4 }}>
              ← Back to cart
            </button>
          </div>
        ) : (
          /* CART ITEMS */
          cart.items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-emoji">🍽️</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--charcoal)' }}>Your cart is empty</div>
              <div style={{ fontSize: '0.85rem' }}>Add items from a restaurant to get started</div>
              <button onClick={() => setCartOpen(false)} className="btn-primary" style={{ marginTop: 8 }}>
                Browse Restaurants
              </button>
            </div>
          ) : (
            <div className="cart-items">
              {cart.items.map(item => {
                const img = getProductImageUrl(item.image);
                return (
                  <div className="cart-item" key={item._id}>
                    {img
                      ? <img src={img} alt={item.productName} className="cart-item-img"
                          onError={e => { e.target.style.display='none'; }} />
                      : <div className="cart-item-img-placeholder">🍴</div>
                    }
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.productName}</div>
                      <div className="cart-item-price">₹{(Number(item.price) * item.qty).toFixed(0)}</div>
                    </div>
                    <div className="cart-qty">
                      <button className="qty-btn" onClick={() => updateQty(item._id, -1)}>−</button>
                      <span className="qty-num">{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item._id, 1)}>+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* Footer */}
        {(cart.items.length > 0 || step === 'address') && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <span className="cart-total-label">
                {step === 'address' ? 'Amount to pay' : `${cart.items.reduce((s,i)=>s+i.qty,0)} items`}
              </span>
              <span className="cart-total-amount">₹{cartTotal.toFixed(0)}</span>
            </div>
            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={placing || (step === 'address' && !address.trim())}
            >
              {placing ? 'Placing order…' : step === 'address' ? '✓ Place Order' : user ? 'Proceed to Checkout →' : 'Login to Checkout →'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
