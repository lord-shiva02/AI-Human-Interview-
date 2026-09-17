import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#070A12] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
        <Navbar />
        <main className="flex-1">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
