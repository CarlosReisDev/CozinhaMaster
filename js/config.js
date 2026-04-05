/* ============================================================
   CozinhaMaster — Configuração Supabase
   ============================================================
   1. Crie um projeto em https://supabase.com
   2. Vá em: Settings > API
   3. Copie "Project URL" e "anon public" key abaixo
   ============================================================ */

const SUPABASE_URL      = 'https://bahiebqjxfohykmofgoq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhaGllYnFqeGZvaHlrbW9mZ29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MTQwNjMsImV4cCI6MjA5MDk5MDA2M30.r3mVV13I_Uuup5704fAJzCCrWUc66vkJApEMVJdshM0';

/* ── CONTATO — alterar aqui para atualizar em todo o site ── */
const WHATSAPP_URL = '#';  // Valor real gerenciado pelo Supabase (site_config.whatsapp_url)

/* ── SEGURANÇA ──────────────────────────────────────────────
   ✅ SUPABASE_ANON_KEY é PÚBLICA por design — pode ficar aqui
   ❌ NUNCA coloque a service_role key neste arquivo
   ──────────────────────────────────────────────────────── */
