"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Home } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 5000);
    }
  }, [searchParams]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { alert("Please fill in all fields"); return; }
    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Login successful! Redirecting to dashboard...");
        router.push("/");
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err: any) {
      alert("Login failed: " + err.message);
    }
  }

  function handleRegisterNav(e: React.MouseEvent) {
    e.preventDefault();
    containerRef.current?.classList.add("auth-page-flip");
    setTimeout(() => router.push("/register"), 400);
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !mobile || !newPassword) { alert("Please fill in all fields"); return; }
    try {
      const res = await fetch("http://localhost:8000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mobile, new_password: newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setIsForgotPassword(false); // Switch back to login
        setPassword("");
        setNewPassword("");
        setMobile("");
      } else {
        alert(data.error || "Password reset failed");
      }
    } catch (err: any) {
      alert("Password reset failed: " + err.message);
    }
  }

  const labelStyle: React.CSSProperties = {
    display: "block", marginBottom: "8px", color: "#2a2a2a",
    fontWeight: 800, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px",
  };
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 18px", border: "2px solid #d0d0d0",
    borderRadius: "10px", fontSize: "14px", background: "white",
    color: "#1a1a1a", fontWeight: 500,
  };

  return (
    <div className="auth-bg" style={{ position: "relative", minHeight: "100vh" }}>
      <div
        ref={containerRef}
        className="auth-container"
        style={{
          background: "white", width: "100%", maxWidth: "1200px",
          height: "90vh", minHeight: "550px", maxHeight: "700px",
          display: "flex", borderRadius: "20px",
          boxShadow: "0 20px 80px rgba(0,0,0,0.3)",
          overflow: "hidden", position: "relative", zIndex: 1,
        }}
      >
        {/* ── LEFT: FORM ── */}
        <div style={{
          flex: 1, padding: "50px", display: "flex",
          flexDirection: "column", justifyContent: "center", background: "white",
        }}>
          {/* Heading */}
          <div style={{ marginBottom: "25px" }}>
            <h1 style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text", fontSize: "32px", marginBottom: "8px",
              fontWeight: 900, letterSpacing: "-0.5px",
            }}>
              {isForgotPassword ? "Reset Password" : "Welcome Back!"}
            </h1>
            <p style={{ color: "#4a4a4a", fontSize: "15px", fontWeight: 600 }}>
              {isForgotPassword
                ? "Verify your email and mobile to reset your password"
                : "Sign in to continue to Ask-Lytics"
              }
            </p>
          </div>

          {/* Success banner */}
          {successMsg && (
            <div style={{
              background: "#d4edda", color: "#155724", padding: "10px",
              borderRadius: "8px", marginBottom: "15px", fontSize: "13px", fontWeight: 600,
            }}>
              Registration successful! Please login.
            </div>
          )}

          <form onSubmit={isForgotPassword ? handleForgotPassword : handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle}>Email Address</label>
              <input type="email" placeholder="Enter your email" className="auth-input"
                style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            {!isForgotPassword ? (
              <>
                {/* Password for Login */}
                <div style={{ marginBottom: "18px" }}>
                  <label style={labelStyle}>Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="auth-input"
                      style={{ ...inputStyle, paddingRight: "45px" }}
                      value={password} onChange={e => setPassword(e.target.value)} required
                    />
                    <span onClick={() => setShowPassword(v => !v)} style={{
                      position: "absolute", right: "15px", top: "50%",
                      transform: "translateY(-50%)", cursor: "pointer",
                      display: "flex", alignItems: "center", userSelect: "none",
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
                        {showPassword
                          ? <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                          : <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        }
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Forgot password */}
                <div style={{ textAlign: "right", marginTop: "-10px", marginBottom: "15px" }}>
                  <a href="/forgot-password" onClick={e => { e.preventDefault(); router.push('/forgot-password'); }}
                    style={{ color: "#667eea", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
                    Forgot Password?
                  </a>
                </div>
              </>
            ) : (
              <>
                {/* Mobile Number for Reset */}
                <div style={{ marginBottom: "18px" }}>
                  <label style={labelStyle}>Registered Mobile Number</label>
                  <input type="tel" placeholder="Enter your 10-digit mobile number" className="auth-input"
                    style={inputStyle} value={mobile} onChange={e => setMobile(e.target.value)} required maxLength={10} />
                </div>

                {/* New Password for Reset */}
                <div style={{ marginBottom: "18px" }}>
                  <label style={labelStyle}>New Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password (min. 8 chars)"
                      className="auth-input"
                      style={{ ...inputStyle, paddingRight: "45px" }}
                      value={newPassword} onChange={e => setNewPassword(e.target.value)} required
                    />
                    <span onClick={() => setShowPassword(v => !v)} style={{
                      position: "absolute", right: "15px", top: "50%",
                      transform: "translateY(-50%)", cursor: "pointer",
                      display: "flex", alignItems: "center", userSelect: "none",
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
                        {showPassword
                          ? <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                          : <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        }
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Back to Login */}
                <div style={{ textAlign: "right", marginTop: "-10px", marginBottom: "15px" }}>
                  <a href="#" onClick={e => { e.preventDefault(); setIsForgotPassword(false); }}
                    style={{ color: "#764ba2", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
                    &larr; Back to Login
                  </a>
                </div>
              </>
            )}

            <button type="submit" className="auth-btn" style={{
              width: "100%", padding: "14px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white", border: "none", borderRadius: "10px",
              fontSize: "15px", fontWeight: 800, cursor: "pointer",
              textTransform: "uppercase", letterSpacing: "0.5px",
            }}>
              {isForgotPassword ? "Reset Password" : "Sign In"}
            </button>
          </form>

          {/* OR divider */}
          {!isForgotPassword && (
            <div style={{ display: "flex", alignItems: "center", margin: "20px 0", color: "#999", fontSize: "13px", fontWeight: 600 }}>
              <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
              <span style={{ padding: "0 15px" }}>OR</span>
              <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
            </div>
          )}

          {/* Social buttons */}
          {!isForgotPassword && (
            <div style={{ display: "flex", gap: "12px" }}>
              {[
                {
                  label: "Google",
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  ),
                },
                {
                  label: "GitHub",
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#333">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  ),
                },
              ].map(({ label, icon }) => (
                <button key={label} className="auth-social-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    if (label === "Google") signIn("google", { callbackUrl: "/" });
                    if (label === "GitHub") signIn("github", { callbackUrl: "/" });
                  }}
                  style={{
                    flex: 1, padding: "10px", border: "2px solid #d0d0d0",
                    borderRadius: "10px", background: "white", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: "8px", fontSize: "13px", fontWeight: 700, color: "#2a2a2a",
                  }}>
                  {icon} {label}
                </button>
              ))}
            </div>
          )}

          {/* Register link */}
          <div style={{ textAlign: "center", marginTop: "20px", color: "#4a4a4a", fontSize: "14px", fontWeight: 600 }}>
            New user?{" "}
            <a href="/register" onClick={handleRegisterNav}
              style={{ color: "#667eea", textDecoration: "none", fontWeight: 700 }}>
              Create an account
            </a>
          </div>
        </div>

        {/* ── RIGHT: GRAPHICS ── */}
        <div className="auth-graphics-section" style={{
          flex: 1, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden",
        }}>
          {/* Floating shapes */}
          <div className="auth-shape-1" style={{ position: "absolute", top: "10%", left: "10%", width: "100px", height: "100px", background: "rgba(255,255,255,0.1)", borderRadius: "50%", opacity: 0.4 }} />
          <div className="auth-shape-2" style={{ position: "absolute", top: "60%", left: "80%", width: "150px", height: "150px", background: "rgba(255,255,255,0.1)", borderRadius: "20%", opacity: 0.4 }} />
          <div className="auth-shape-3" style={{ position: "absolute", top: "80%", left: "20%", width: "80px", height: "80px", background: "rgba(255,255,255,0.1)", borderRadius: "50%", opacity: 0.4 }} />

          {/* 3D Graphics content */}
          <div style={{ textAlign: "center", color: "white", zIndex: 2, position: "relative" }}>
            <div className="auth-database-3d" style={{ width: "250px", height: "250px", margin: "0 auto" }}>
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="100" cy="60" rx="60" ry="20" fill="#ffffff" opacity="0.3" />
                <rect x="40" y="60" width="120" height="80" fill="#ffffff" opacity="0.2" />
                <ellipse cx="100" cy="140" rx="60" ry="20" fill="#ffffff" opacity="0.4" />
                <ellipse cx="100" cy="90" rx="60" ry="20" fill="#ffffff" opacity="0.3" />
                <ellipse cx="100" cy="115" rx="60" ry="20" fill="#ffffff" opacity="0.35" />
                <circle cx="100" cy="75" r="3" fill="#ffffff" />
                <circle cx="85" cy="75" r="3" fill="#ffffff" />
                <circle cx="115" cy="75" r="3" fill="#ffffff" />
                <circle cx="100" cy="100" r="3" fill="#ffffff" />
                <circle cx="90" cy="100" r="3" fill="#ffffff" />
                <circle cx="110" cy="100" r="3" fill="#ffffff" />
                <circle cx="100" cy="125" r="3" fill="#ffffff" />
                <circle cx="85" cy="125" r="3" fill="#ffffff" />
                <circle cx="115" cy="125" r="3" fill="#ffffff" />
              </svg>
            </div>
            <h2 style={{
              fontSize: "36px", fontWeight: 900, marginBottom: "15px", lineHeight: 1.2,
              background: "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>Smart SQL<br />Generation</h2>
            <p style={{ fontSize: "16px", opacity: 0.95, fontWeight: 600, color: "rgba(255,255,255,0.95)", marginBottom: "30px" }}>
              Transform natural language into powerful database queries with AI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100vh", display: "flex", justifyContent: "center",
        alignItems: "center", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }} />
    }>
      <LoginForm />
    </Suspense>
  );
}