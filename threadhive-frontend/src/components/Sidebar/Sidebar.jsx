import { useNavigate, useLocation } from "react-router-dom";
import { Nav, ListGroup } from "react-bootstrap";
import "./Sidebar.css";

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'show' : ''}`}
        onClick={onClose}
        role="presentation"
        aria-hidden={!isOpen}
      />
      <aside className={`sidebar ${!isOpen ? 'mobile-hidden' : ''}`} aria-label="Navigation menu">
        <nav className="flex-column">
          {/* Menu Section */}
          <div className="mb-4">
            <h6 className="text-uppercase fw-bold small mb-2 px-3" style={{ color: 'var(--text-muted)' }} id="sidebar-menu-heading">Menu</h6>
            <ListGroup variant="flush" aria-labelledby="sidebar-menu-heading">
              <ListGroup.Item 
                action
                active={isActive("/home")}
                onClick={() => handleNavigation("/home")}
                className="border-0 rounded mx-2"
              >
                <span aria-hidden="true">🏠</span> Home
              </ListGroup.Item>
              <ListGroup.Item 
                action
                active={isActive("/profile")}
                onClick={() => handleNavigation("/profile")}
                className="border-0 rounded mx-2"
              >
                <span aria-hidden="true">👤</span> Profile
              </ListGroup.Item>
            </ListGroup>
          </div>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
