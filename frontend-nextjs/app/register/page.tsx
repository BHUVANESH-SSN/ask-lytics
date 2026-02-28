"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({ name: "", mobile: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState({ password: false, confirm: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fieldState, setFieldState] = useState<Record<string, "error" | "success" | "">>({});
  const [passwordStrength, setPasswordStrength] = useState<"" | "weak" | "medium" | "strong">("");

  function getStrength(p: string): "" | "weak" | "medium" | "strong" {
    let s = 0;
    if (p.length >= 6) s++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^a-zA-Z0-9]/.test(p)) s++;
    if (s >= 4) return "strong";
    if (s >= 2) return "medium";
    if (s >= 1) return "weak";
    return "";
  }

  function handlePasswordChange(val: string) {
    setForm(f => ({ ...f, password: val }));
    setPasswordStrength(getStrength(val));
    if (val.length >= 6) setFieldState(s => ({ ...s, password: "success" }));
    else setFieldState(s => ({ ...s, password: "" }));
    // also recheck confirm match
    if (form.confirmPassword && val !== form.confirmPassword)
      setFieldState(s => ({ ...s, confirmPassword: "error" }));
    else if (form.confirmPassword && val === form.confirmPassword)
      setFieldState(s => ({ ...s, confirmPassword: "success" }));
  }

  function handleConfirmChange(val: string) {
    setForm(f => ({ ...f, confirmPassword: val }));
    if (val && form.password !== val) {
      setFieldState(s => ({ ...s, confirmPassword: "error" }));
      setErrors(e => ({ ...e, confirmPassword: "Passwords do not match" }));
    } else {
      setFieldState(s => ({ ...s, confirmPassword: val ? "success" : "" }));
      setErrors(e => { const n = { ...e }; delete n.confirmPassword; return n; });
    }
  }

  function validate() {
    const errs: Record<string, string> = {};
    const states: Record<string, "error" | "success"> = {};
    if (form.name.length < 3) { errs.name = "Name must be at least 3 characters"; states.name = "error"; } else states.name = "success";
    if (!/^[0-9]{10}$/.test(form.mobile)) { errs.mobile = "Please enter a valid 10-digit mobile number"; states.mobile = "error"; } else states.mobile = "success";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errs.email = "Please enter a valid email address"; states.email = "error"; } else states.email = "success";
    if (form.password.length < 6) { errs.password = "Password must be at least 6 characters"; states.password = "error"; } else states.password = "success";
    if (form.password !== form.confirmPassword) { errs.confirmPassword = "Passwords do not match"; states.confirmPassword = "error"; } else states.confirmPassword = "success";
    setErrors(errs);
    setFieldState(states);
    return Object.keys(errs).length === 0;
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, mobile: form.mobile, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Registration successful! Redirecting to dashboard...");
        router.push("/");
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (err: any) {
      alert("Registration failed: " + err.message);
    }
  }

  function handleLoginNav(e: React.MouseEvent) {
    e.preventDefault();
    containerRef.current?.classList.add("auth-page-flip");
    setTimeout(() => router.push("/login"), 400);
  }

  const labelStyle: React.CSSProperties = {
    display: "block", marginBottom: "6px", color: "#2a2a2a",
    fontWeight: 800, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px",
  };
  const strengthColors = { weak: "#e74c3c", medium: "#f39c12", strong: "#27ae60" };
  const strengthWidths = { weak: "33.33%", medium: "66.66%", strong: "100%" };

  function inputClass(field: string) {
    return `auth-input${fieldState[field] === "error" ? " input-error" : fieldState[field] === "success" ? " input-success" : ""}`;
  }

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
        {/* ── LEFT: GRAPHICS ── */}
        <div className="auth-graphics-section" style={{
          flex: 1, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden",
        }}>
          <div className="auth-shape-1" style={{ position: "absolute", top: "10%", left: "10%", width: "100px", height: "100px", background: "rgba(255,255,255,0.1)", borderRadius: "50%", opacity: 0.4 }} />
          <div className="auth-shape-2" style={{ position: "absolute", top: "60%", right: "10%", width: "150px", height: "150px", background: "rgba(255,255,255,0.1)", borderRadius: "20%", opacity: 0.4 }} />
          <div className="auth-shape-3" style={{ position: "absolute", bottom: "10%", left: "20%", width: "80px", height: "80px", background: "rgba(255,255,255,0.1)", borderRadius: "50%", opacity: 0.4 }} />

          <div style={{ textAlign: "center", color: "white", zIndex: 2, position: "relative" }}>
            <div className="auth-database-3d" style={{ width: "250px", height: "250px", margin: "0 auto" }}>
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <rect x="40" y="30" width="120" height="30" rx="5" fill="#ffffff" opacity="0.3" />
                <rect x="40" y="70" width="120" height="30" rx="5" fill="#ffffff" opacity="0.35" />
                <rect x="40" y="110" width="120" height="30" rx="5" fill="#ffffff" opacity="0.4" />
                <rect x="40" y="150" width="120" height="30" rx="5" fill="#ffffff" opacity="0.45" />
                <line x1="100" y1="60" x2="100" y2="70" stroke="#ffffff" strokeWidth="3" opacity="0.5" />
                <line x1="100" y1="100" x2="100" y2="110" stroke="#ffffff" strokeWidth="3" opacity="0.5" />
                <line x1="100" y1="140" x2="100" y2="150" stroke="#ffffff" strokeWidth="3" opacity="0.5" />
                <circle cx="55" cy="45" r="2" fill="#00ff00" />
                <circle cx="65" cy="45" r="2" fill="#00ff00" />
                <circle cx="55" cy="85" r="2" fill="#00ff00" />
                <circle cx="65" cy="85" r="2" fill="#00ff00" />
                <circle cx="55" cy="125" r="2" fill="#00ff00" />
                <circle cx="65" cy="125" r="2" fill="#00ff00" />
                <circle cx="55" cy="165" r="2" fill="#00ff00" />
                <circle cx="65" cy="165" r="2" fill="#00ff00" />
              </svg>
            </div>
            <h2 style={{
              fontSize: "36px", fontWeight: 900, marginBottom: "15px", lineHeight: 1.2,
              background: "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>Join Our<br />Data Platform</h2>
            <p style={{ fontSize: "16px", opacity: 0.95, fontWeight: 600, color: "rgba(255,255,255,0.95)", marginBottom: "30px" }}>
              Start your journey with AI-powered database insights
            </p>
          </div>
        </div>

        {/* ── RIGHT: FORM ── */}
        <div style={{
          flex: 1, padding: "30px 40px", display: "flex", flexDirection: "column",
          justifyContent: "flex-start", background: "white", overflowY: "auto",
        }}>
          <div style={{ marginBottom: "20px" }}>
            <h1 style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text", fontSize: "32px", marginBottom: "8px",
              fontWeight: 900, letterSpacing: "-0.5px",
            }}>Create Account</h1>
            <p style={{ color: "#4a4a4a", fontSize: "15px", fontWeight: 600 }}>Join Ask-Lytics today!</p>
          </div>

          <form onSubmit={handleRegister}>
            {/* Full Name */}
            <div style={{ marginBottom: "12px" }}>
              <label style={labelStyle}>Full Name</label>
              <input type="text" placeholder="Enter your full name" className={inputClass("name")}
                style={{ width: "100%", padding: "10px 16px", border: "2px solid #d0d0d0", borderRadius: "10px", fontSize: "14px", background: "white", color: "#1a1a1a", fontWeight: 500 }}
                value={form.name}
                onChange={e => {
                  setForm(f => ({ ...f, name: e.target.value }));
                  if (e.target.value.length >= 3) { setFieldState(s => ({ ...s, name: "success" })); setErrors(er => { const n = { ...er }; delete n.name; return n; }); }
                }}
              />
              {errors.name && <p style={{ color: "#e74c3c", fontSize: "11px", marginTop: "4px", fontWeight: 600 }}>{errors.name}</p>}
            </div>

            {/* Mobile */}
            <div style={{ marginBottom: "12px" }}>
              <label style={labelStyle}>Mobile Number</label>
              <input type="tel" placeholder="Enter your mobile number" className={inputClass("mobile")}
                style={{ width: "100%", padding: "10px 16px", border: "2px solid #d0d0d0", borderRadius: "10px", fontSize: "14px", background: "white", color: "#1a1a1a", fontWeight: 500 }}
                value={form.mobile} maxLength={10}
                onChange={e => {
                  setForm(f => ({ ...f, mobile: e.target.value }));
                  if (/^[0-9]{10}$/.test(e.target.value)) { setFieldState(s => ({ ...s, mobile: "success" })); setErrors(er => { const n = { ...er }; delete n.mobile; return n; }); }
                }}
              />
              {errors.mobile && <p style={{ color: "#e74c3c", fontSize: "11px", marginTop: "4px", fontWeight: 600 }}>{errors.mobile}</p>}
            </div>

            {/* Email */}
            <div style={{ marginBottom: "12px" }}>
              <label style={labelStyle}>Email Address</label>
              <input type="email" placeholder="Enter your email" className={inputClass("email")}
                style={{ width: "100%", padding: "10px 16px", border: "2px solid #d0d0d0", borderRadius: "10px", fontSize: "14px", background: "white", color: "#1a1a1a", fontWeight: 500 }}
                value={form.email}
                onChange={e => {
                  setForm(f => ({ ...f, email: e.target.value }));
                  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)) { setFieldState(s => ({ ...s, email: "success" })); setErrors(er => { const n = { ...er }; delete n.email; return n; }); }
                }}
              />
              {errors.email && <p style={{ color: "#e74c3c", fontSize: "11px", marginTop: "4px", fontWeight: 600 }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: "12px" }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPassword.password ? "text" : "password"} placeholder="Create a strong password"
                  className={inputClass("password")}
                  style={{ width: "100%", padding: "10px 40px 10px 16px", border: "2px solid #d0d0d0", borderRadius: "10px", fontSize: "14px", background: "white", color: "#1a1a1a", fontWeight: 500 }}
                  value={form.password} onChange={e => handlePasswordChange(e.target.value)}
                />
                <span onClick={() => setShowPassword(s => ({ ...s, password: !s.password }))}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", display: "flex", alignItems: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#666">
                    {showPassword.password
                      ? <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                      : <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    }
                  </svg>
                </span>
              </div>
              {/* Strength bar */}
              <div style={{ height: "3px", background: "#e0e0e0", borderRadius: "2px", marginTop: "6px", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: "2px", transition: "all 0.3s ease",
                  width: passwordStrength ? strengthWidths[passwordStrength] : "0%",
                  background: passwordStrength ? strengthColors[passwordStrength] : "transparent",
                }} />
              </div>
              {errors.password && <p style={{ color: "#e74c3c", fontSize: "11px", marginTop: "4px", fontWeight: 600 }}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: "12px" }}>
              <label style={labelStyle}>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPassword.confirm ? "text" : "password"} placeholder="Re-enter your password"
                  className={inputClass("confirmPassword")}
                  style={{ width: "100%", padding: "10px 40px 10px 16px", border: "2px solid #d0d0d0", borderRadius: "10px", fontSize: "14px", background: "white", color: "#1a1a1a", fontWeight: 500 }}
                  value={form.confirmPassword} onChange={e => handleConfirmChange(e.target.value)}
                />
                <span onClick={() => setShowPassword(s => ({ ...s, confirm: !s.confirm }))}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", display: "flex", alignItems: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#666">
                    {showPassword.confirm
                      ? <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                      : <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    }
                  </svg>
                </span>
              </div>
              {errors.confirmPassword && <p style={{ color: "#e74c3c", fontSize: "11px", marginTop: "4px", fontWeight: 600 }}>{errors.confirmPassword}</p>}
            </div>

            <button type="submit" className="auth-btn" style={{
              width: "100%", padding: "12px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white", border: "none", borderRadius: "10px",
              fontSize: "15px", fontWeight: 800, cursor: "pointer",
              marginTop: "8px", textTransform: "uppercase", letterSpacing: "0.5px",
            }}>Create Account</button>
          </form>

          <p style={{ marginTop: "15px", textAlign: "center", fontSize: "11px", color: "#999", fontWeight: 500 }}>
            By signing up, you agree to our{" "}
            <a href="#" style={{ color: "#667eea", textDecoration: "none", fontWeight: 600 }}>Terms of Service</a>
            {" "}and{" "}
            <a href="#" style={{ color: "#667eea", textDecoration: "none", fontWeight: 600 }}>Privacy Policy</a>
          </p>

          <div style={{ display: "flex", alignItems: "center", margin: "15px 0", color: "#999", fontSize: "12px", fontWeight: 600 }}>
            <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
            <span style={{ padding: "0 15px" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
          </div>

          <div style={{ textAlign: "center", color: "#4a4a4a", fontSize: "14px", fontWeight: 600 }}>
            Already a user?{" "}
            <a href="/login" onClick={handleLoginNav}
              style={{ color: "#667eea", textDecoration: "none", fontWeight: 700 }}>
              Sign in to your account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}