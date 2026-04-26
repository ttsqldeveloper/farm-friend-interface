import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Camera, MessageCircle } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function History() {
  const [diagnoses, setDiagnoses] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [d, c] = await Promise.all([api.diagnoses(50), api.chats(50)]);
        setDiagnoses(d.items || []);
        setChats(c.items || []);
      } catch (err: any) { toast.error(err.message); }
      finally { setLoading(false); }
    })();
  }, []);

  const fmt = (d: string) => new Date(d).toLocaleString();

  return (
    <div className="container py-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Your History</h1>
        <p className="text-muted-foreground mt-2">Review past diagnoses and chats.</p>
      </div>
      {loading ? (
        <div className="flex justify-center py-12 text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : (
        <Tabs defaultValue="diagnoses">
          <TabsList className="mb-6">
            <TabsTrigger value="diagnoses"><Camera className="w-4 h-4 mr-2" />Diagnoses ({diagnoses.length})</TabsTrigger>
            <TabsTrigger value="chats"><MessageCircle className="w-4 h-4 mr-2" />Chats ({chats.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="diagnoses" className="space-y-3">
            {diagnoses.length === 0 && <p className="text-muted-foreground text-center py-8">No diagnoses yet.</p>}
            {diagnoses.map((d) => (
              <Card key={d.id} className="p-4 flex gap-4 items-center">
                {(d.image_url || d.imageUrl) && (
                  <img src={d.image_url || d.imageUrl} alt="Leaf" className="w-20 h-20 rounded-lg object-cover" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{d.prediction || d.label || d.result || "Diagnosis"}</p>
                  {typeof d.confidence === "number" && (
                    <p className="text-sm text-muted-foreground">Confidence: {(d.confidence * 100).toFixed(1)}%</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{fmt(d.created_at || d.createdAt)}</p>
                </div>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="chats" className="space-y-3">
            {chats.length === 0 && <p className="text-muted-foreground text-center py-8">No chats yet.</p>}
            {chats.map((c) => (
              <Card key={c.id} className="p-4">
                <p className="font-medium">Q: {c.question}</p>
                <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">A: {c.answer || c.response}</p>
                <p className="text-xs text-muted-foreground mt-2">{fmt(c.created_at || c.createdAt)}</p>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
