import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Login = () => {
  const { user, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />;

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    const result = login(email, password);
    if (!result.success) {
      setError(result.error);
      return;
    }

    const requestedPath = location.state?.from?.pathname;
    const defaultPath = result.role === "admin" ? "/admin" : "/";
    navigate(requestedPath || defaultPath, { replace: true });
  };

  return (
    <main className="container login-page py-5">
      <div className="login-card card border-0 shadow-lg mx-auto">
        <div className="card-body p-4 p-md-5">
          <Link to="/" className="login-brand d-flex justify-content-center mb-4" aria-label="SnapBuy home">
            <img src="/snapbuy-logo.svg" alt="SnapBuy" />
          </Link>
          <div className="text-center mb-4">
            <p className="login-eyebrow mb-2">WELCOME BACK</p>
            <h1 className="h3 mb-2">Sign in to SnapBuy</h1>
            <p className="text-secondary mb-0">Use your account email to continue shopping.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                className="form-control form-control-lg"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="input-group input-group-lg">
                <input
                  id="login-password"
                  className="form-control"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} aria-hidden="true" />
                </button>
              </div>
            </div>

            {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

            <button className="btn btn-primary btn-lg w-100 mt-2" type="submit">Sign in</button>
          </form>

          <div className="text-center mt-4">
            <Link to="/" className="text-decoration-none">Continue browsing as a guest</Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
