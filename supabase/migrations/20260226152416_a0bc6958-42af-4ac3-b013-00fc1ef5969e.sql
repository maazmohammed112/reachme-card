
-- Simple settings table for vehicle QR page (single row, no auth needed)
CREATE TABLE public.vehicle_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  show_details BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default row
INSERT INTO public.vehicle_settings (id, show_details) VALUES (1, true);

-- Enable RLS but allow public access (this is a public QR page)
ALTER TABLE public.vehicle_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read settings" ON public.vehicle_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can update settings" ON public.vehicle_settings FOR UPDATE USING (true);
