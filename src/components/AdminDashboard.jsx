import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <main className="container admin-dashboard py-5">
      <div className="mb-4">
        <p className="login-eyebrow mb-2">SNAPBUY ADMIN</p>
        <h1 className="h2">Welcome, {user.email}</h1>
        <p className="text-secondary">Choose a management area to continue.</p>
      </div>
      <div className="row g-4">
        <div className="col-md-6">
          <Link className="admin-action-card card h-100 border-0 shadow-sm text-decoration-none" to="/admin/add-product">
            <div className="card-body p-4">
              <i className="bi bi-plus-square fs-2 text-primary" aria-hidden="true" />
              <h2 className="h5 mt-3">Add a product</h2>
              <p className="text-secondary mb-0">Create a new item for the SnapBuy catalog.</p>
            </div>
          </Link>
        </div>
        <div className="col-md-6">
          <Link className="admin-action-card card h-100 border-0 shadow-sm text-decoration-none" to="/admin/orders">
            <div className="card-body p-4">
              <i className="bi bi-receipt fs-2 text-primary" aria-hidden="true" />
              <h2 className="h5 mt-3">All orders</h2>
              <p className="text-secondary mb-0">Review customer orders and their details.</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
