import { Leaf, Activity } from 'lucide-react';

function Header({ modelStatus }) {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-icon">
          <Leaf size={24} />
        </div>
        <h1 className="brand-text">
          Nutri<span className="brand-highlight">Vision</span>
        </h1>
      </div>

      <div className="header-status">
        <span className="status-badge">
          <Activity size={14} />
          <span>{modelStatus}</span>
        </span>
      </div>
    </header>
  );
}

export default Header;