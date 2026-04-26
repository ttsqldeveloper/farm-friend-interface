import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Sprout, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function Crops() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.crops(search || undefined);
        setItems(res.items || []);
      } catch (err) {toast.error(err.message);} finally
      {setLoading(false);}
    }, 250);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Crop Guides</h1>
        <p className="text-muted-foreground mt-2">Seasonal tips and disease awareness for your crops.</p>
      </div>
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search crops…" className="pl-10" />
      </div>

      {loading ?
      <div className="flex justify-center py-12 text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin" /></div> :
      items.length === 0 ?
      <p className="text-muted-foreground text-center py-12">No crops found.</p> :

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((c) =>
        <Card key={c.id} className="p-6 hover:shadow-elegant transition-smooth hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-soft">
                <Sprout className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">{c.crop_name}</h3>
              <p className="text-sm text-accent font-medium mt-1">{c.season}</p>
              <p className="text-sm text-muted-foreground mt-3">{c.notes}</p>
              {c.common_diseases &&
          <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Common diseases</p>
                  <p className="text-sm">{c.common_diseases}</p>
                </div>
          }
            </Card>
        )}
        </div>
      }
    </div>);

}