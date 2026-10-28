"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import api from "@/lib/api";
import { Briefcase, ArrowRight, Lock, Mail, User, Phone, AlertCircle, Award, CheckCircle2 } from "lucide-react";

const inputClass =
  "w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-aviation-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-aviation-yellow focus:border-transparent transition-all";
const labelClass = "block text-xs font-bold text-aviation-charcoal uppercase tracking-wider mb-1.5";
const iconClass = "w-4 h-4 text-aviation-muted absolute left-3.5 top-1/2 -translate-y-1/2";

export default function MentorRegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    bio: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [key]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await api.post("/auth/register/mentor", formData);
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-aviation-offWhite relative">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-aviation-black text-aviation-yellow flex items-center justify-center mx-auto shadow-sm">
              <Briefcase className="w-6 h-6 text-aviation-yellow" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-aviation-black tracking-tight font-heading">
              Mentor Registration
            </h1>
            <p className="text-xs text-aviation-muted">
              Apply to teach at Ignited Dreams. Your account becomes active once an admin approves it.
            </p>
          </div>

          <Card padding="lg" variant="default" className="shadow-card">
            {submitted ? (
              <div className="text-center space-y-4 py-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h2 className="text-lg font-bold text-aviation-black font-heading">Application submitted</h2>
                <p className="text-xs text-aviation-muted leading-relaxed">
                  Thanks, {formData.name.split(" ")[0] || "mentor"}. An admin will review your application. Once approved,
                  you can sign in with <strong>{formData.email}</strong> and the password you just created.
                </p>
                <Link href="/login" className="inline-block text-xs font-bold text-aviation-black hover:underline">
                  Go to Sign In
                </Link>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <div className="relative">
                      <User className={iconClass} />
                      <input type="text" required value={formData.name} onChange={set("name")} placeholder="Your full name" className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Email Address *</label>
                    <div className="relative">
                      <Mail className={iconClass} />
                      <input type="email" required value={formData.email} onChange={set("email")} placeholder="mentor@example.com" className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <div className="relative">
                      <Phone className={iconClass} />
                      <input type="tel" value={formData.phone} onChange={set("phone")} placeholder="+91 98765 00000" className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Teaching Area *</label>
                    <div className="relative">
                      <Award className={iconClass} />
                      <input
                        type="text"
                        required
                        minLength={2}
                        value={formData.specialization}
                        onChange={set("specialization")}
                        placeholder="e.g. Logistics, SAP ERP, Aviation"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Short Bio</label>
                    <textarea
                      rows={3}
                      maxLength={1000}
                      value={formData.bio}
                      onChange={set("bio")}
                      placeholder="Your experience and qualifications"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-aviation-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-aviation-yellow focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Create Password *</label>
                    <div className="relative">
                      <Lock className={iconClass} />
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={formData.password}
                        onChange={set("password")}
                        placeholder="Minimum 8 characters (1 uppercase, 1 number)"
                        className={inputClass}
                      />
                    </div>
                    <p className="text-[11px] text-aviation-muted mt-1">Must include at least 1 uppercase letter and 1 numeric digit.</p>
                  </div>

                  <div className="pt-2">
                    <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading} rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Submit Application
                    </Button>
                  </div>
                </form>

                <div className="mt-6 pt-4 border-t border-aviation-border text-center text-xs text-aviation-muted space-y-1.5">
                  <div>
                    Already approved?{" "}
                    <Link href="/login" className="font-bold text-aviation-black hover:underline">Sign In</Link>
                  </div>
                  <div>
                    Want to learn instead?{" "}
                    <Link href="/register" className="font-bold text-aviation-black hover:underline">Student registration</Link>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
