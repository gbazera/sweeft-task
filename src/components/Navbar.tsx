import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  useEffect(() => {
    const handleScroll = () => {
      const up = document.querySelector('.up') as HTMLElement;
      if (up) {
        const isBelow = window.scrollY - window.outerHeight >= up.offsetTop + up.offsetHeight;
        if (isBelow) {
          up.classList.add('visible');
        } else {
          up.classList.remove('visible');
        }

      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const up = document.querySelector('.up') as HTMLElement;
    if (up) {
      up.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }, []);

  return (
    <>
      <nav>
        <Link className="logo" to={'/'} >Photo Gallery</Link>
        <ul>
          <li><Link to={'/'}>Home</Link></li>
          <li><Link to={'/history'}>History</Link></li>
        </ul>
      </nav>
      <button className="up"><span className="material-symbols-outlined">arrow_upward</span></button>
    </>
  );
};

export default Navbar;