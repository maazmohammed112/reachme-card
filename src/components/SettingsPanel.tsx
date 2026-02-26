import { useState, useEffect, useRef } from "react";
import { Settings, Eye, EyeOff, X, Timer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  onToggle: (showDetails: boolean) => void;
  currentState: boolean;
}

const AUTO_LOGOUT_SECONDS = 60;

const SettingsPanel = ({ open, onClose, onToggle, currentState }: SettingsPanelProps) => {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_LOGOUT_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-logout countdown
  useEffect(() => {
    if (!open) {
      setCountdown(AUTO_LOGOUT_SECONDS);
      return;
    }
    setCountdown(AUTO_LOGOUT_SECONDS);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onClose();
          return AUTO_LOGOUT_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleToggle = async () => {
    setLoading(true);
    const newState = !currentState;
    // Immediate UI update
    onToggle(newState);
    // Save to Cloud in background
    // @ts-ignore - table types not yet regenerated
    await supabase
      .from("vehicle_settings")
      .update({ show_details: newState, updated_at: new Date().toISOString() })
      .eq("id", 1);
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: "hsl(220 40% 13% / 0.5)", backdropFilter: "blur(8px)" }}
    >
      <div className="w-full max-w-md auto-card rounded-b-none rounded-t-2xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-primary" />
            <h3 className="text-sm font-bold text-foreground">Owner Settings</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Timer size={12} />
              <span className="font-mono">{countdown}s</span>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Toggle */}
        <div className="auto-card p-4 flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {currentState ? <Eye size={18} className="text-primary" /> : <EyeOff size={18} className="text-muted-foreground" />}
            <div>
              <p className="text-sm font-semibold text-foreground">Show Contact Details</p>
              <p className="text-xs text-muted-foreground">Phone numbers & location</p>
            </div>
          </div>
          <button
            onClick={handleToggle}
            disabled={loading}
            className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
              currentState ? "bg-primary" : "bg-muted"
            }`}
          >
            <div
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-300 ${
                currentState ? "left-[22px]" : "left-0.5"
              }`}
            />
          </button>
        </div>

        {!currentState && (
          <div className="rounded-xl p-3 mb-4" style={{ background: "hsl(40 90% 55% / 0.1)", border: "1px solid hsl(40 90% 55% / 0.2)" }}>
            <p className="text-xs leading-relaxed" style={{ color: "hsl(40 60% 35%)" }}>
              ⚠️ Details are currently hidden. The owner may be driving or the vehicle is not in use. Emergency contacts are always available below.
            </p>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center mt-2">Auto-logout in {countdown}s · Changes saved instantly</p>
      </div>
    </div>
  );
};

export default SettingsPanel;
