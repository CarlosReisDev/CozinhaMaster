/* ============================================================
   CozinhaMaster — Site Config via Supabase
   Busca configurações dinâmicas (WA, endereço, horários)
   e aplica no DOM. O config.js serve de fallback imediato.
   ============================================================ */

/* ── STATUS DE FUNCIONAMENTO ─────────────────────────────────
   Horários (fuso America/Sao_Paulo):
     Noite:  Qua–Dom  16h–23h  (days 0,3,4,5,6)
   --------------------------------------------------------- */
function updateOpenStatus() {
  const now  = new Date();
  const fmt  = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(now).map(p => [p.type, p.value]));
  const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const day  = dayMap[parts.weekday];
  const mins = parseInt(parts.hour) * 60 + parseInt(parts.minute);

  const isOpen = [0, 3, 4, 5, 6].includes(day) && mins >= 960 && mins < 1380; // 16h–23h Qua–Dom

  document.querySelectorAll('.status-dot').forEach(el => {
    el.classList.toggle('status-dot--closed', !isOpen);
  });
  document.querySelectorAll('.status-text').forEach(el => {
    el.textContent = isOpen ? 'Aberto agora' : 'Fechado';
    el.classList.toggle('status-text--closed', !isOpen);
  });
}

updateOpenStatus();

function safeUrl(url, allowedProtocols) {
  try {
    return allowedProtocols.includes(new URL(url).protocol);
  } catch (_) {
    return false;
  }
}

(async function applySiteConfig() {
  if (!SUPABASE_URL || SUPABASE_URL.startsWith('COLE_')) return;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/site_config?select=key,value`,
      {
        headers: {
          'apikey':        SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    if (!res.ok) return;

    const rows = await res.json();
    const cfg  = Object.fromEntries(rows.map(r => [r.key, r.value]));

    // WhatsApp — atualiza todos os links da página
    if (cfg.whatsapp_url && safeUrl(cfg.whatsapp_url, ['https:'])) {
      document.querySelectorAll('.wa-link').forEach(el => {
        el.href = cfg.whatsapp_url;
      });
    }

    // Instagram
    if (cfg.instagram_url && safeUrl(cfg.instagram_url, ['https:'])) {
      document.querySelectorAll('.ig-link').forEach(el => {
        el.href = cfg.instagram_url;
      });
    }

    // Endereço
    if (cfg.address_line1) {
      document.querySelectorAll('[data-cfg="address_line1"]')
        .forEach(el => { el.textContent = cfg.address_line1; });
    }
    if (cfg.address_line2) {
      document.querySelectorAll('[data-cfg="address_line2"]')
        .forEach(el => { el.textContent = cfg.address_line2; });
    }

    // Horários
    if (cfg.hours_evening) {
      document.querySelectorAll('[data-cfg="hours_evening"]')
        .forEach(el => { el.textContent = cfg.hours_evening; });
    }

} catch (_) {
    // Silencioso — config.js já setou os valores padrão
  }
})();
