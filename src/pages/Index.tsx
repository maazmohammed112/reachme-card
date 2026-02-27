import { useState, useCallback, useEffect } from "react";
import { Phone, MessageCircle, MapPin, Mail, Car, Shield, ChevronRight, Settings, EyeOff } from "lucide-react";
import logo from "@/assets/reach-logo.png";
import LoadingScreen from "@/components/LoadingScreen";
import WarningModal from "@/components/WarningModal";
import PinModal from "@/components/PinModal";
import SettingsPanel from "@/components/SettingsPanel";
import EmergencyContacts from "@/components/EmergencyContacts";
import { supabase } from "@/integrations/supabase/client";

type ModalAction = { type: "call" | "whatsapp"; number: string } | null;

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [modalAction, setModalAction] = useState<ModalAction>(null);
  const [showDetails, setShowDetails] = useState(true);
  const [pinOpen, setPinOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Fetch preference from Cloud
  useEffect(() => {
    const fetchSettings = async () => {
      // @ts-ignore
      const { data } = await supabase.from("vehicle_settings").select("show_details").eq("id", 1).single();
      if (data) setShowDetails((data as any).show_details);
    };
    fetchSettings();
  }, []);

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

  const handlePinSuccess = () => {
    setPinOpen(false);
    setSettingsOpen(true);
  };

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
        {/* Vehicle Info - Navy card */}
        <Section delay={0}>
          <div className="auto-card-navy p-5 shimmer">
            <div className="flex items-center gap-3 mb-3">
              <div className="icon-badge-white rounded-xl">
                <Car size={18} />
              </div>
              <div>
                <p className="text-lg font-bold tracking-wide">KA 05 MQ 1326</p>
                <p className="text-xs opacity-70">Ertiga Maruti Suzuki</p>
              </div>
            </div>
            <div className="my-3 h-px bg-primary-foreground/15" />
            <div className="flex items-start gap-2">
              <Shield size={14} className="opacity-60 mt-0.5 shrink-0" />
              <p className="text-xs opacity-70 leading-relaxed">
                Sorry for any inconvenience caused.
                <br />
                Thank you for your understanding.
              </p>
            </div>
          </div>
        </Section>

        {showDetails ? (
          <>
            {/* Primary Contact */}
            <Section delay={1}>
              <SectionTitle>Primary Number</SectionTitle>
              <div className="auto-card p-5">
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
              <div className="auto-card p-5">
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
              <div className="auto-card p-5">
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
                    className="btn-3d btn-3d-call flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium"
                  >
                    <MapPin size={16} />
                    Show on Map
                    <ChevronRight size={14} className="opacity-60" />
                  </button>
                </div>
              </div>
            </Section>
          </>
        ) : (
          <Section delay={1}>
            <div className="auto-card p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "hsl(40 90% 55% / 0.12)" }}>
                  <EyeOff size={22} style={{ color: "hsl(40 70% 45%)" }} />
                </div>
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">Details Hidden by Owner</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The vehicle owner has turned off contact details. They may be driving or the vehicle is currently not in use. Please use the emergency contacts below if needed.
              </p>
            </div>
          </Section>
        )}

        {/* Emergency Contacts - Always visible */}
        <Section delay={showDetails ? 4 : 2}>
          <EmergencyContacts />
        </Section>

        {/* Custom Sticker CTA */}
        <Section delay={showDetails ? 5 : 3}>
          <div className="auto-card-navy p-5 animate-glow-pulse">
            <p className="text-center text-sm font-medium opacity-90">Want to make your custom sticker?</p>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => window.open("mailto:maazmohammed112@gmail.com", "_self")}
                className="btn-3d btn-accent flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold"
              >
                <Mail size={16} />
                Contact Us
                <ChevronRight size={14} className="opacity-60" />
              </button>
            </div>
          </div>
        </Section>
      </main>

      {/* Footer */}
      <footer className="py-4 px-4" style={{ background: "hsl(220 65% 18%)" }}>
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Car size={14} style={{ color: "hsl(0 0% 100% / 0.7)" }} />
              <p className="text-xs font-medium" style={{ color: "hsl(0 0% 100% / 0.7)" }}>KA 05 MQ 1326</p>
            </div>
            <button
              onClick={() => setPinOpen(true)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
              style={{
                background: "hsl(0 0% 100% / 0.1)",
                color: "hsl(0 0% 100% / 0.8)",
                border: "1px solid hsl(0 0% 100% / 0.15)",
              }}
            >
              <Settings size={12} />
              Owner Settings
            </button>
          </div>
          <p className="text-center text-xs" style={{ color: "hsl(0 0% 100% / 0.4)" }}>© 2026 Registered REACH.MME</p>
        </div>
      </footer>

      <WarningModal
        open={!!modalAction}
        onCancel={() => setModalAction(null)}
        onContinue={handleContinue}
      />

      <PinModal
        open={pinOpen}
        onClose={() => setPinOpen(false)}
        onSuccess={handlePinSuccess}
      />

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onToggle={(val) => setShowDetails(val)}
        currentState={showDetails}
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
      className="btn-3d btn-3d-call flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold"
    >
      <Phone size={16} />
      Call
    </button>
    <button
      onClick={onWhatsApp}
      className="btn-3d btn-3d-whatsapp flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold"
    >
      <MessageCircle size={16} />
      WhatsApp
    </button>
  </div>
);

export default Index;
