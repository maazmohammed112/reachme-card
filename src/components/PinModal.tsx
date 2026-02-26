import { useState } from "react";
import { Lock, X } from "lucide-react";

interface PinModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CORRECT_PIN = "26112002";

const PinModal = ({ open, onClose, onSuccess }: PinModalProps) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  if (!open) return null;

  const handleSubmit = () => {
    if (pin === CORRECT_PIN) {
      setPin("");
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setPin("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ backgroundColor: "hsl(220 40% 13% / 0.6)", backdropFilter: "blur(10px)" }}
    >
      <div className="w-full max-w-xs auto-card p-6 animate-modal-in relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
          <X size={18} />
        </button>
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "hsl(var(--navy) / 0.1)" }}>
            <Lock size={22} style={{ color: "hsl(220, 65%, 28%)" }} />
          </div>
        </div>
        <p className="text-center text-sm font-semibold text-foreground mb-1">Enter Owner PIN</p>
        <p className="text-center text-xs text-muted-foreground mb-4">Access settings panel</p>
        <input
          type="password"
          inputMode="numeric"
          maxLength={8}
          value={pin}
          onChange={(e) => { setPin(e.target.value); setError(false); }}
          onKeyDown={handleKeyDown}
          placeholder="••••••••"
          className="w-full text-center text-lg tracking-[0.3em] font-mono rounded-xl border border-border bg-secondary/50 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        {error && <p className="text-center text-xs mt-2" style={{ color: "hsl(0 78% 55%)" }}>Incorrect PIN</p>}
        <button
          onClick={handleSubmit}
          className="btn-3d btn-3d-call w-full mt-4 rounded-xl py-2.5 text-sm font-semibold"
        >
          Unlock
        </button>
      </div>
    </div>
  );
};

export default PinModal;
