# Roadmap — Textos editáveis via Supabase (site_config)

## O que já está no banco

| Chave | Valor atual | Onde é usado |
|---|---|---|
| `whatsapp_url` | https://wa.me/5531998891369 | `.wa-link` href + `.wa-link` na landing |
| `instagram_url` | https://instagram.com/cozinhamaster | `.ig-link` href |
| `address_line1` | Av. Palmeiras, 463 | `data-cfg="address_line1"` |
| `address_line2` | Masterville — Sarzedo/MG | `data-cfg="address_line2"` |
| `hours_evening` | Qua–Dom: 16h–23h | `data-cfg="hours_evening"` |

> `hours_morning` e `hours_closed` foram **deletados** — hamburgueria não abre de manhã.

---

## O que vale adicionar

### Fase 1 — Alta prioridade (muda com frequência)

| Chave proposta | Valor atual | Onde aparece no HTML |
|---|---|---|
| `stat_patty_g` | 160 | `<span data-value="160" data-suffix="g">` na seção stats |
| `stat_anos` | 7 | `<span data-value="7">` na seção stats |
| `stat_burgers` | 15 | `<span data-value="15" data-suffix="+">` na seção stats |
| `stat_rating` | 4.9 | `<span data-value="4.9" data-decimals="1">` na seção stats |
| `manifesto_common` | A maioria entrega velocidade. | `.manifesto-common` |
| `manifesto_diff` | Nós entregamos memória. | `.manifesto-diff` |
| `footer_tagline` | Artesanal. Sem Concessões. | `.footer-tagline` |

> Stats mudam com o tempo (anos de operação sobe todo ano, menu cresce). São os mais chatos de editar no HTML porque têm `data-value` além do `textContent`.

### Fase 2 — Média prioridade (muda às vezes)

| Chave proposta | Valor atual | Onde aparece |
|---|---|---|
| `cta_heading` | Sua mesa espera por você | `.cta-heading` (seção CTA final) |
| `cta_body` | Reserve agora e garanta... | `.cta-body` |

### Não faz sentido colocar no banco

| Item | Motivo |
|---|---|
| Headings de seção com `<em>` ou `<br />` | Risco de XSS; `esc()` quebraria a formatação |
| Labels de navegação ("Cardápio", "Nossa História") | Estrutura do site, não conteúdo |
| Ano do copyright | Melhor usar `new Date().getFullYear()` em JS |
| Textos de hero de scroll-stop | Copy criativo, edição pontual pelo dev |

---

## Como implementar a Fase 1

O `site-config.js` já aplica `data-cfg` automaticamente via:
```js
document.querySelectorAll('[data-cfg]').forEach(el => {
  const val = config[el.dataset.cfg];
  if (val) el.textContent = val;
});
```

**Passos:**

### 1. Inserir no banco (Supabase SQL Editor)
```sql
INSERT INTO site_config (key, value) VALUES
  ('stat_patty_g',    '160'),
  ('stat_anos',       '7'),
  ('stat_burgers',    '15'),
  ('stat_rating',     '4.9'),
  ('manifesto_common','A maioria entrega velocidade.'),
  ('manifesto_diff',  'Nós entregamos memória.'),
  ('footer_tagline',  'Artesanal. Sem Concessões.');
```

### 2. Adicionar `data-cfg` nos elementos do `index.html`

```html
<!-- Stats (atenção: data-cfg vai no elemento que contém o número,
     mas data-value precisa ser atualizado junto pelo JS) -->
<span class="stat-value" data-value="160" data-suffix="g" data-cfg="stat_patty_g">160</span>
<span class="stat-value" data-value="7" data-cfg="stat_anos">7</span>
<span class="stat-value" data-value="15" data-suffix="+" data-cfg="stat_burgers">15</span>
<span class="stat-value" data-value="4.9" data-decimals="1" data-cfg="stat_rating">4.9</span>

<!-- Manifesto -->
<span class="manifesto-common" data-cfg="manifesto_common">A maioria entrega velocidade.</span>
<span class="manifesto-diff" data-cfg="manifesto_diff">Nós entregamos memória.</span>

<!-- Footer -->
<span class="footer-tagline" data-cfg="footer_tagline">Artesanal. Sem Concessões.</span>
```

### 3. Atualizar `site-config.js` para sincronizar `data-value` nos stats

Os stats usam `data-value` para a animação GSAP. Quando o banco retornar um valor diferente, precisa atualizar tanto o `textContent` quanto o atributo:

```js
// No site-config.js, após aplicar data-cfg normalmente:
const statKeys = ['stat_patty_g', 'stat_anos', 'stat_burgers', 'stat_rating'];
statKeys.forEach(key => {
  if (!config[key]) return;
  document.querySelectorAll(`[data-cfg="${key}"]`).forEach(el => {
    el.dataset.value = config[key]; // atualiza data-value para GSAP
    el.textContent   = config[key];
  });
});
```

**Custo:** ~15 linhas de JS + 7 INSERTs no banco. Baixo.

---

## Ordem recomendada

1. **Agora (pré-deploy):** Fase 1 stats + manifesto + footer_tagline
2. **Pós-deploy se surgir necessidade:** Fase 2 textos de CTA
3. **Nunca:** headings com markup HTML

---

## Como o cliente edita

1. Acessa `app.supabase.com`
2. Table Editor → `site_config`
3. Edita o `value` da linha desejada
4. Site atualiza na próxima visita (sem cache para site_config)
