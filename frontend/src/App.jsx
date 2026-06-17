import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import AppRouter from './router.jsx';

function App() {
  const { theme } = useSelector((state) => state.ui);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return <AppRouter />;
}

export default App;
