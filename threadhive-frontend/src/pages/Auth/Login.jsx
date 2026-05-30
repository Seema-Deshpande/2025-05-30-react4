import { Container, Card, Form, Button, Spinner } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../../reducers/authSlice.js";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasNavigated = useRef(false);

  const { token, loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  useEffect(() => {
    if (token && !hasNavigated.current) {
      hasNavigated.current = true;
      alert("Login successful!");
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <main className="auth-container d-flex align-items-center justify-content-center">
      <Card className="auth-card shadow-lg border-0 rounded-4 p-4 p-md-5">
        <h1 className="auth-title">Login</h1>

        <Form onSubmit={handleSubmit}>
          <Form.Floating className="mb-4">
            <Form.Control
              id="floatingEmail"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder=" "
              required
              className="auth-form-control"
              aria-required="true"
              aria-describedby="email-hint"
            />
            <label htmlFor="floatingEmail" className="auth-form-label">
              Email Address
            </label>
            <small id="email-hint" className="form-text text-muted d-block mt-1">Enter your registered email</small>
          </Form.Floating>

          <Form.Floating className="mb-4">
            <Form.Control
              id="floatingPassword"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder=" "
              required
              className="auth-form-control"
              aria-required="true"
              aria-describedby="password-hint"
            />
            <label htmlFor="floatingPassword" className="auth-form-label">
              Password
            </label>
            <small id="password-hint" className="form-text text-muted d-block mt-1">Enter your password</small>
          </Form.Floating>

          {error && <div className="auth-error" role="alert"><strong>Error:</strong> {error}</div>}

          <Button
            type="submit"
            variant="primary"
            className="auth-submit-btn"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2" aria-hidden="true"></i>Login
              </>
            )}
          </Button>
        </Form>
      </Card>
    </main>
  );
}

export default Login;
