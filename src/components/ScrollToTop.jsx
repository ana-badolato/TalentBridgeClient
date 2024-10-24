import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Mueve la ventana al principio de la página
  }, [pathname]);

  return null;
}

export default ScrollToTop;
