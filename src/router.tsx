import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IndexPage from './pages/root';
import TreePage from './pages/tree';
import EmployeePage from './pages/employees';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import AdminPanelPage from './pages/admin-panel';
import AddEmployeePage from './pages/add-employee';
import ProtectedWrapper from './components/protected';
// import TreePage from './TreePage';
// import EmployeePage from './EmployeePage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/tree" element={<TreePage />} />
        <Route path="/employees" element={<EmployeePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/employees/admin"
          element={
            <ProtectedWrapper>
              <AdminPanelPage />
            </ProtectedWrapper>
          }
        />
        <Route
          path="/employees/add"
          element={
            <ProtectedWrapper>
              <AddEmployeePage />
            </ProtectedWrapper>
          }
        />
      </Routes>

      {/* <Route path="/employee" element={EmployeePage} />
      <Route path="/" element={() => <div>Home Page</div>} /> */}
    </BrowserRouter>
  );
};

export default AppRouter;
