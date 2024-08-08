import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Импортируем стили Bootstrap

const NavigationBar = () => {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light border-bottom"
      style={{ width: "100vw" }}
    >
      <div className="container">
        <Link className="navbar-brand" to="/">
          MyApp
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/tree">
                Tree
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/employees">
                Employees
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/register">
                Register
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
