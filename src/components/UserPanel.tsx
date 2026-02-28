import { useState, useEffect, useCallback, useRef } from "react";
import { X, Eye, EyeOff, Lock, Timer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface UserPanelProps {
  open: boolean;
  onClose: () => void;
  showDetails: boolean;
  onToggle: (val: boolean) => void;
}

const PIN = "26112002";
const AUTO_LOGOUT_SECONDS = 60;

const UserPanel = ({ open, onClose, showDetails, onToggle }: UserPanelProps) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_LOGOUT_SECONDS);
  const [toggling, setToggling] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const logout = useCallback(() => {
    setAuthenticated(false);
    setPin("");
    setError(false);
    setCountdown(AUTO_LOGOUT_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    onClose();
  }, [onClose]);

  // Auto-logout timer
  useEffect(() => {
    if (!authenticated) return;
    setCountdown(AUTO_LOGOUT_SECONDS);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          logout();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [authenticated, logout]);

  // Logout on close / page refresh
  useEffect(() => {
    if (!open && authenticated) logout();
  }, [open, authenticated, logout]);

  useEffect(() => {
    const handleBeforeUnload = () => logout();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [logout]);

  const handlePinSubmit = () => {
    if (pin === PIN) {
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPin("");
    }
  };

  const handleToggle = async () => {
    setToggling(true);
    const newVal = !showDetails;
    const { error } = await supabase
      .from("vehicle_settings")
      .update({ show_details: newVal, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (!error) onToggle(newVal);
    setToggling(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center px-4 pb-4" style={{ backgroundColor: "hsl(220 40% 13% / 0.5)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-sm auto-card p-6 animate-modal-in relative">
        <button onClick={logout} className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted transition-colors">
          <X size={18} className="text-muted-foreground" />
        </button>

        {!authenticated ? (
          <div>
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: "hsl(var(--navy) / 0.1)" }}>
                <Lock size={22} className="text-primary" />
              </div>
            </div>
            <p className="text-center text-sm font-semibold text-foreground mb-1">Enter PIN</p>
            <p className="text-center text-xs text-muted-foreground mb-4">Access vehicle settings</p>
            <input
              type="password"
              inputMode="numeric"
              maxLength={8}
              value={pin}
              onChange={(e) => { setPin(e.target.value); setError(false); }}
              onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
              placeholder="••••••••"
              className={`w-full text-center text-lg tracking-[0.3em] rounded-xl border bg-background px-4 py-3 outline-none transition-all ${
                error ? "border-destructive shake" : "border-border focus:border-primary"
              }`}
            />
            {error && <p className="text-center text-xs mt-2" style={{ color: "hsl(var(--destructive))" }}>Incorrect PIN</p>}
            <button
              onClick={handlePinSubmit}
              disabled={pin.length === 0}
              className="btn-3d btn-3d-call w-full mt-4 rounded-xl py-3 text-sm font-semibold disabled:opacity-40"
            >
              Unlock
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-foreground">Contact Visibility</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Timer size={12} />
                <span>{countdown}s</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-5">Toggle phone & location visibility for visitors</p>
            
            <button
              onClick={handleToggle}
              disabled={toggling}
              className={`w-full flex items-center justify-between rounded-xl p-4 border transition-all ${
                showDetails
                  ? "border-primary/20 bg-primary/5"
                  : "border-destructive/20 bg-destructive/5"
              }`}
            >
              <div className="flex items-center gap-3">
                {showDetails ? (
                  <Eye size={20} className="text-primary" />
                ) : (
                  <EyeOff size={20} className="text-destructive" />
                )}
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">
                    {showDetails ? "Details Visible" : "Details Hidden"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {showDetails ? "Visitors can see your contact info" : "Contact info is hidden from visitors"}
                  </p>
                </div>
              </div>
              <div className={`w-12 h-7 rounded-full relative transition-colors ${showDetails ? "bg-primary" : "bg-muted"}`}>
                <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${showDetails ? "left-[calc(100%-1.625rem)]" : "left-0.5"}`} />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPanel;
