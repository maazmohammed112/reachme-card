import { AlertTriangle } from "lucide-react";

interface WarningModalProps {
  open: boolean;
  onCancel: () => void;
  onContinue: () => void;
}

const WarningModal = ({ open, onCancel, onContinue }: WarningModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ backgroundColor: "hsl(220 40% 13% / 0.5)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-sm auto-card p-6 animate-modal-in" style={{ boxShadow: "0 20px 60px hsl(220 40% 13% / 0.2)" }}>
        <div className="flex justify-center mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "hsl(40 90% 55% / 0.12)" }}>
            <AlertTriangle size={20} style={{ color: "hsl(40, 90%, 50%)" }} />
          </div>
        </div>
        <p className="text-center text-sm leading-relaxed text-foreground/80">
          Please avoid unnecessary calls or messages.
          <br />
          Misuse, spam, or harassment may lead to legal action.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="btn-3d btn-3d-outline flex-1 rounded-xl py-2.5 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onContinue}
            className="btn-3d btn-3d-call flex-1 rounded-xl py-2.5 text-sm font-medium"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
