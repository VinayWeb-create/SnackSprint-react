import React, { useState, useEffect } from 'react';
import { API_URL } from '../api';
import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft } from 'react-icons/fa';
import { MagnifyingGlass } from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import { getFirmImageUrl } from '../imageUrl';

const PLACEHOLDER = 'https://res.cloudinary.com/demo/image/upload/v1/samples/food/spices';

const Chains = () => {
  const [vendorData, setVendorData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/vendor/all-vendors?order=desc`)
      .then(r => r.json())
      .then(data => { setVendorData(data); setLoading(false); })
      .catch(() => { console.error('Failed to fetch vendors'); setLoading(false); });
  }, []);

  const handleScroll = (direction) => {
    const gallery = document.getElementById('chainGallery');
    gallery.scrollTo({ left: gallery.scrollLeft + (direction === 'left' ? -500 : 500), behavior: 'smooth' });
  };

  return (
    <div className="mediaChainSection">
      {loading && (
        <div className="loaderSection">
          <div>Your 🥣 is Loading...</div>
          <MagnifyingGlass visible height="80" width="80"
            ariaLabel="magnifying-glass-loading"
            glassColor="#c0efff" color="#e15b64" />
        </div>
      )}

      <div className="btnSection">
        <button onClick={() => handleScroll('left')}>
          <FaRegArrowAltCircleLeft className="btnIcons" />
        </button>
        <button onClick={() => handleScroll('right')}>
          <FaRegArrowAltCircleRight className="btnIcons" />
        </button>
      </div>

      <h3 className="chainTitle">Top restaurant chains in Kakinada</h3>

      <section className="chainSection" id="chainGallery">
        {vendorData.vendors && vendorData.vendors.map((vendor, vi) =>
          vendor.firm.map((item) => {
            const imgUrl = getFirmImageUrl(item.image);
            return (
              <div className="vendorBox" key={item._id}>
                <Link to={`/products/${item._id}/${item.firmName}`} className="link">
                  <div className="firmImage" style={{ position: 'relative' }}>
                    <img
                      src={imgUrl || PLACEHOLDER}
                      alt={item.firmName}
                      onError={e => { e.target.src = PLACEHOLDER; }}
                      style={{
                        width: 350, height: 220,
                        objectFit: 'cover', borderRadius: 10,
                        marginRight: 30, display: 'block',
                      }}
                    />
                    {/* Firm name overlay */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0,
                      width: 'calc(100% - 30px)',
                      background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.75))',
                      color: 'white', padding: '20px 10px 8px',
                      borderBottomLeftRadius: 10, borderBottomRightRadius: 10,
                      fontWeight: 700, fontSize: '0.95rem',
                    }}>
                      {item.firmName}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};

export default Chains;
