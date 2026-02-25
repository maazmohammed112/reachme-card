import { useState, useCallback } from "react";
import { Phone, MessageCircle, MapPin, Mail, Car, Shield } from "lucide-react";
import logo from "@/assets/reach-logo.png";
import LoadingScreen from "@/components/LoadingScreen";
import WarningModal from "@/components/WarningModal";

type ModalAction = { type: "call" | "whatsapp"; number: string } | null;

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [modalAction, setModalAction] = useState<ModalAction>(null);

  const handleContinue = useCallback(() => {
    if (!modalAction) return;
    const num = modalAction.number;
    if (modalAction.type === "call") {
      window.open(`tel:${num}`, "_self");
    } else {
      window.open(`https://wa.me/${num.replace("+", "")}`, "_blank");
    }
    setModalAction(null);
  }, [modalAction]);

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-center header-blur py-3.5">
        <img src={logo} alt="REACH.MME" className="h-8 animate-float" />
      </header>

      <main className="px-4 py-6 pb-10 space-y-5 max-w-md mx-auto">
        {/* Vehicle Info */}
        <Section delay={0}>
          <div className="glass-card rounded-lg p-5 card-glow shimmer">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
                <Car size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold tracking-wide text-foreground">KA 05 MQ 1326</p>
                <p className="text-xs text-muted-foreground">Ertiga Maruti Suzuki</p>
              </div>
            </div>
            <div className="my-3 h-px bg-border/50" />
            <div className="flex items-start gap-2">
              <Shield size={14} className="text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Sorry for any inconvenience caused.
                <br />
                Thank you for your understanding.
              </p>
            </div>
          </div>
        </Section>

        {/* Primary Contact */}
        <Section delay={1}>
          <SectionTitle>Primary Number</SectionTitle>
          <div className="glass-card rounded-lg p-5 card-glow">
            <p className="text-center text-base font-semibold tracking-[0.2em] text-foreground">+91 ******5584</p>
            <ContactButtons
              onCall={() => setModalAction({ type: "call", number: "+918951225584" })}
              onWhatsApp={() => setModalAction({ type: "whatsapp", number: "+918951225584" })}
            />
          </div>
        </Section>

        {/* Alternate Contact */}
        <Section delay={2}>
          <SectionTitle>Alternate Number</SectionTitle>
          <div className="glass-card rounded-lg p-5 card-glow">
            <p className="text-center text-base font-semibold tracking-[0.2em] text-foreground">+91 ******7067</p>
            <ContactButtons
              onCall={() => setModalAction({ type: "call", number: "+919108167067" })}
              onWhatsApp={() => setModalAction({ type: "whatsapp", number: "+919108167067" })}
            />
          </div>
        </Section>

        {/* Location */}
        <Section delay={3}>
          <SectionTitle>Location</SectionTitle>
          <div className="glass-card rounded-lg p-5 card-glow">
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              Amar Layout, Bangalore, Karnataka, 560045, India
            </p>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() =>
                  window.open(
                    "https://www.google.com/maps/search/Amar+Layout+Bangalore+Karnataka+560045+India",
                    "_blank"
                  )
                }
                className="btn-3d btn-3d-outline flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-foreground"
              >
                <MapPin size={16} />
                Show on Map
              </button>
            </div>
          </div>
        </Section>

        {/* Custom Sticker CTA */}
        <Section delay={4}>
          <div className="glass-card rounded-lg p-5 card-glow animate-glow-pulse">
            <p className="text-center text-sm font-medium text-foreground/90">Want to make your custom sticker?</p>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => window.open("mailto:maazmohammed112@gmail.com", "_self")}
                className="btn-3d btn-3d-call flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                <Mail size={16} />
                Contact Us
              </button>
            </div>
          </div>
        </Section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-5" style={{ background: "hsl(220 45% 10% / 0.6)" }}>
        <p className="text-center text-xs text-muted-foreground">© 2026 Registered REACH.MME</p>
      </footer>

      <WarningModal
        open={!!modalAction}
        onCancel={() => setModalAction(null)}
        onContinue={handleContinue}
      />
    </div>
  );
};

/* --- Sub-components --- */

const Section = ({ children, delay }: { children: React.ReactNode; delay: number }) => (
  <div
    className="animate-fade-up opacity-0"
    style={{ animationDelay: `${delay * 0.12}s`, animationFillMode: "forwards" }}
  >
    {children}
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">{children}</h2>
);

const ContactButtons = ({ onCall, onWhatsApp }: { onCall: () => void; onWhatsApp: () => void }) => (
  <div className="mt-4 flex gap-3">
    <button
      onClick={onCall}
      className="btn-3d btn-3d-call flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-primary-foreground"
    >
      <Phone size={16} />
      Call
    </button>
    <button
      onClick={onWhatsApp}
      className="btn-3d btn-3d-whatsapp flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-primary-foreground"
    >
      <MessageCircle size={16} />
      WhatsApp
    </button>
  </div>
);

export default Index;
