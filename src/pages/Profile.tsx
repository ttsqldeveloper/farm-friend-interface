import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

export default function Profile() {
  const { user, refresh, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", location: "", cropTypes: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      fullName: user.fullName || user.full_name || "",
      location: user.location || "",
      cropTypes: (user.cropTypes || user.crop_types || []).join(", "),
    });
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateMe({
        fullName: form.fullName,
        location: form.location,
        cropTypes: form.cropTypes.split(",").map(s => s.trim()).filter(Boolean),
      });
      await refresh();
      toast.success("Profile updated");
    } catch (err: any) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const remove = async () => {
    if (!confirm("Permanently delete your account? This cannot be undone.")) return;
    try {
      await api.deleteMe();
      logout();
      toast.success("Account deleted");
      navigate("/");
    } catch (err: any) { toast.error(err.message); }
  };

  return (
    <div className="container py-10 max-w-2xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Profile</h1>
      <p className="text-muted-foreground mb-8">{user?.email}</p>

      <Card className="p-6">
        <form onSubmit={save} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="crops">Crops (comma separated)</Label>
            <Input id="crops" value={form.cropTypes} onChange={(e) => setForm({ ...form, cropTypes: e.target.value })} />
          </div>
          <Button type="submit" variant="hero" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
        </form>
      </Card>

      <Card className="p-6 mt-6 border-destructive/30">
        <h2 className="font-semibold text-destructive mb-2">Danger zone</h2>
        <p className="text-sm text-muted-foreground mb-4">Delete your account and all associated data.</p>
        <Button variant="destructive" onClick={remove}><Trash2 className="w-4 h-4" /> Delete account</Button>
      </Card>
    </div>
  );
}
