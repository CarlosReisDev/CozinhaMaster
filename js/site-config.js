/* ============================================================
   CozinhaMaster — Site Config via Supabase
   Busca configurações dinâmicas (WA, endereço, horários)
   e aplica no DOM. O config.js serve de fallback imediato.
   ============================================================ */

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
    if (cfg.hours_morning) {
      document.querySelectorAll('[data-cfg="hours_morning"]')
        .forEach(el => { el.textContent = cfg.hours_morning; });
    }
    if (cfg.hours_evening) {
      document.querySelectorAll('[data-cfg="hours_evening"]')
        .forEach(el => { el.textContent = cfg.hours_evening; });
    }
    if (cfg.hours_closed) {
      document.querySelectorAll('[data-cfg="hours_closed"]')
        .forEach(el => { el.textContent = cfg.hours_closed; });
    }

  } catch (_) {
    // Silencioso — config.js já setou os valores padrão
  }
})();
