"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import LoadErrorBanner from "@/components/ui/LoadErrorBanner";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Plus } from "lucide-react";

interface AdminItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  createdAt: string;
}

const emptyForm = { name: "", email: "", phone: "", password: "" };
const inputClass = "w-full px-3 py-2 rounded-lg border border-aviation-border text-xs";
const labelClass = "block text-xs font-bold text-aviation-charcoal uppercase tracking-wider mb-1";

export default function AdminAdminsPage() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<AdminItem[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const loadAdmins = async () => {
    try {
      setAdmins(await api.get<AdminItem[]>("/admin/admins"));
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Request failed");
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await api.post<{ email: string; temporaryPassword?: string }>("/admin/admins", formData);
      setModalOpen(false);
      setFormData(emptyForm);
      loadAdmins();
      if (created.temporaryPassword) {
        window.prompt(
          `Admin account created for ${created.email}. Copy this one-time password and share it securely:`,
          created.temporaryPassword
        );
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to create admin");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (admin: AdminItem) => {
    const status = admin.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    if (!confirm(`${status === "ACTIVE" ? "Re-activate" : "Suspend"} admin ${admin.email}?`)) return;
    try {
      await api.patch(`/admin/admins/${admin.id}/status`, { status });
      loadAdmins();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update admin");
    }
  };

  return (
    <div className="space-y-6">
      {loadError && <LoadErrorBanner message={loadError} />}
      <div className="border-b border-aviation-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-aviation-black tracking-tight font-heading">Administrators</h1>
          <p className="text-xs sm:text-sm text-aviation-muted mt-1">
            People with full access to this admin panel. Only an existing admin can add a new one.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Add Admin
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {admins.map((a) => (
          <Card key={a.id} padding="lg" variant="default" className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-aviation-black font-heading truncate">
                {a.name} {a.id === user?.id && <span className="text-xs text-aviation-muted font-normal">(you)</span>}
              </h3>
              <Badge variant={a.status === "ACTIVE" ? "ready" : "expired"} size="sm">{a.status}</Badge>
            </div>
            <div className="text-xs text-aviation-charcoal space-y-1">
              <div>Email: <span className="font-mono text-aviation-muted break-all">{a.email}</span></div>
              <div>Phone: <span className="font-mono text-aviation-muted">{a.phone || "—"}</span></div>
            </div>
            {a.id !== user?.id && (
              <div className="pt-3 border-t border-aviation-border flex justify-end">
                <Button variant="ghost" size="sm" onClick={() => toggleStatus(a)}>
                  {a.status === "ACTIVE" ? "Suspend" : "Re-activate"}
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Administrator" description="Leave password empty to generate a one-time password.">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className={labelClass}>Full Name *</label>
            <input type="text" required minLength={2} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email *</label>
            <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Password (optional)</label>
            <input
              type="password"
              minLength={8}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="8+ chars, 1 uppercase, 1 number"
              className={inputClass}
            />
          </div>
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-aviation-border">
            <Button variant="ghost" size="sm" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit" isLoading={saving}>Create Admin</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
