"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ArrowLeft, Loader2, Phone, Home } from "lucide-react";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Determine method from URL params
    const method = searchParams.get("method") || "email";
    const emailToken = searchParams.get("token");
    const mobileNumber = searchParams.get("mobile");

    // Form states
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            alert("Password must be at least 8 characters");
            return;
        }

        setIsLoading(true);

        try {
            const endpoint = method === "email"
                ? "/api/auth/reset-password/email"
                : "/api/auth/reset-password/mobile";

            const payload = method === "email"
                ? { token: emailToken, password }
                : { mobile: mobileNumber, otp, password };

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
            } else {
                alert(data.error || "An error occurred. Your token or OTP may have expired.");
            }
        } catch (error: any) {
            alert("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-xl border text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Lock className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold">Password Reset!</h2>
                <p className="text-muted-foreground">
                    Your password has been successfully updated. You can now log in with your new credentials.
                </p>
                <div className="pt-4">
                    <Link href="/login">
                        <Button className="w-full">Go to Login</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Basic validation to ensure they arrived here correctly
    if (method === "email" && !emailToken) {
        return (
            <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-xl border text-center space-y-6">
                <p className="text-destructive font-semibold">Invalid Reset Link</p>
                <p className="text-muted-foreground text-sm">You are missing the secure token in the URL.</p>
                <Link href="/forgot-password">
                    <Button variant="outline" className="mt-4">Request New Link</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-xl border">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Create New Password</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    {method === "email"
                        ? "Your email has been verified. Enter your new password below."
                        : `Enter the 6-digit OTP sent to ${mobileNumber}`}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {method === "mobile" && (
                    <div className="space-y-2 mb-4">
                        <Label htmlFor="otp">6-Digit OTP</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="otp"
                                type="text"
                                placeholder="123456"
                                className="pl-9 tracking-widest"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // only allow numbers
                                required
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-9"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            className="pl-9"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>
                </div>

                <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Resetting...
                        </>
                    ) : (
                        "Reset Password"
                    )}
                </Button>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
            <Link href="/" style={{
                position: "absolute", top: "24px", left: "24px", padding: "10px 20px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white", textDecoration: "none", borderRadius: "10px",
                fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)", zIndex: 50
            }}>
                <Home size={18} />
                Home
            </Link>
            <Suspense fallback={<div className="animate-pulse w-full max-w-md h-96 bg-card rounded-2xl shadow-xl border"></div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
