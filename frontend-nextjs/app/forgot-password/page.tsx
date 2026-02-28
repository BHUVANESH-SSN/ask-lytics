"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, ArrowLeft, Loader2, Home } from "lucide-react";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [method, setMethod] = useState<"email" | "mobile">("email");

    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const endpoint = method === "email"
                ? "/api/auth/forgot-password/email"
                : "/api/auth/forgot-password/mobile";

            const payload = method === "email" ? { email } : { mobile };

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
            } else {
                alert(data.error || "An error occurred");
            }
        } catch (error: any) {
            alert("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
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
                <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-xl border text-center space-y-6">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        {method === "email" ? <Mail className="w-8 h-8 text-primary" /> : <Phone className="w-8 h-8 text-primary" />}
                    </div>
                    <h2 className="text-2xl font-bold">Check your {method === "email" ? "inbox" : "mobile"}</h2>
                    <p className="text-muted-foreground">
                        {method === "email"
                            ? "We've sent a password reset link to your email."
                            : "We've sent a 6-digit OTP to your mobile number."}
                    </p>

                    {method === "mobile" && (
                        <div className="pt-4">
                            <Link href={`/reset-password?method=mobile&mobile=${mobile}`}>
                                <Button className="w-full">Enter OTP and Reset</Button>
                            </Link>
                        </div>
                    )}

                    <div className="pt-4">
                        <Link href="/login" className="text-sm font-medium text-primary hover:underline flex items-center justify-center gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

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
            <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-xl border">

                <div className="mb-6">
                    <Link href="/login" className="text-sm text-muted-foreground hover:text-primary mb-6 inline-flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Link>
                    <h1 className="text-2xl font-bold mt-2">Reset Password</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Choose how you want to reset your password
                    </p>
                </div>

                <Tabs defaultValue="email" onValueChange={(v) => setMethod(v as "email" | "mobile")}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="email">Email Link</TabsTrigger>
                        <TabsTrigger value="mobile">Mobile OTP</TabsTrigger>
                    </TabsList>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <TabsContent value="email" className="space-y-4 mt-0">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className="pl-9"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required={method === "email"}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="mobile" className="space-y-4 mt-0">
                            <div className="space-y-2">
                                <Label htmlFor="mobile">Mobile Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="mobile"
                                        type="tel"
                                        placeholder="Enter your 10-digit number"
                                        className="pl-9"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        required={method === "mobile"}
                                        maxLength={15}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Send Reset Instructions"
                            )}
                        </Button>
                    </form>
                </Tabs>

            </div>
        </div>
    );
}
