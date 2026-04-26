import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Loader2, Leaf, AlertCircle, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function Diagnose() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onPick = (f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) return toast.error("Please choose an image");
    setFile(f);
    setResult(null);
    setPreview(URL.createObjectURL(f));
  };

  const onDrop = (e) => {
    e.preventDefault();
    onPick(e.dataTransfer.files?.[0] ?? null);
  };

  const submit = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await api.predict(file);
      setResult(res);
      toast.success("Diagnosis complete");
    } catch (err) {
      toast.error(err.message);
    } finally {setLoading(false);}
  };

  const prediction = result?.prediction || result?.result || result;
  const label = prediction?.class || prediction?.label || prediction?.disease || prediction?.prediction;
  const confidence = prediction?.confidence ?? prediction?.score;
  const recommendation = prediction?.recommendation || prediction?.advice || prediction?.treatment;
  const imageUrl = result?.imageUrl || result?.image_url || result?.cloudinary_url;

  return (
    <div className="container py-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
          <Leaf className="w-8 h-8 text-primary" /> Plant Disease Diagnosis
        </h1>
        <p className="text-muted-foreground mt-2">Upload a clear photo of a leaf and our AI will identify potential diseases.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl aspect-square flex flex-col items-center justify-center text-center p-6 cursor-pointer hover:border-primary hover:bg-secondary/30 transition-smooth overflow-hidden">
            
            {preview ?
            <img src={preview} alt="Selected leaf" className="w-full h-full object-cover rounded-lg" /> :

            <>
                <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4 shadow-soft">
                  <Upload className="w-7 h-7 text-primary-foreground" />
                </div>
                <p className="font-medium">Drop a leaf image here</p>
                <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
              </>
            }
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPick(e.target.files?.[0] ?? null)} />
          </div>
          <Button onClick={submit} disabled={!file || loading} variant="hero" className="w-full mt-4" size="lg">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</> : "Diagnose Now"}
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-lg mb-4">Result</h2>
          {!result && !loading &&
          <div className="text-muted-foreground text-sm flex flex-col items-center justify-center h-64 text-center">
              <AlertCircle className="w-10 h-10 mb-3 opacity-40" />
              Your diagnosis will appear here.
            </div>
          }
          {loading &&
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Loader2 className="w-10 h-10 animate-spin mb-3 text-primary" />
              Analyzing image…
            </div>
          }
          {result &&
          <div className="space-y-4">
              {imageUrl && <img src={imageUrl} alt="Uploaded" className="w-full rounded-lg" />}
              <div className="p-4 rounded-lg bg-secondary">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Detected
                </div>
                <p className="text-xl font-semibold">{label || "Unknown"}</p>
                {typeof confidence === "number" &&
              <p className="text-sm text-muted-foreground mt-1">Confidence: {(confidence * 100).toFixed(1)}%</p>
              }
              </div>
              {recommendation &&
            <div className="p-4 rounded-lg border border-border">
                  <p className="text-sm font-medium mb-1">Recommendation</p>
                  <p className="text-sm text-muted-foreground">{recommendation}</p>
                </div>
            }
              <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer">Raw response</summary>
                <pre className="mt-2 p-3 bg-muted rounded overflow-auto">{JSON.stringify(result, null, 2)}</pre>
              </details>
            </div>
          }
        </Card>
      </div>
    </div>);

}