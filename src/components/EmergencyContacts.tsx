import { Phone, Flame, Siren, Cross } from "lucide-react";

const emergencyNumbers = [
  { label: "Police", number: "100", icon: Siren },
  { label: "Ambulance", number: "108", icon: Cross },
  { label: "Fire", number: "101", icon: Flame },
  { label: "Emergency", number: "112", icon: Phone },
];

const EmergencyContacts = () => (
  <div className="mt-4">
    <p className="text-xs font-bold uppercase tracking-[0.15em] mb-3" style={{ color: "hsl(0 78% 55%)" }}>
      🚨 Emergency Helpline (India)
    </p>
    <div className="grid grid-cols-2 gap-2">
      {emergencyNumbers.map((item) => (
        <button
          key={item.number}
          onClick={() => window.open(`tel:${item.number}`, "_self")}
          className="flex items-center gap-2 rounded-xl py-2.5 px-3 text-xs font-semibold transition-all"
          style={{
            background: "hsl(0 78% 55% / 0.08)",
            border: "1px solid hsl(0 78% 55% / 0.2)",
            color: "hsl(0 78% 50%)",
          }}
        >
          <item.icon size={14} />
          <span>{item.label}</span>
          <span className="ml-auto font-bold">{item.number}</span>
        </button>
      ))}
    </div>
  </div>
);

export default EmergencyContacts;
