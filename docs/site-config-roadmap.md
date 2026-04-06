# Roadmap — Textos editáveis via Supabase (site_config)

## O que já está no banco

| Chave | Exemplo |
|---|---|
| `whatsapp_url` | https://wa.me/5531998891369 |
| `instagram_url` | https://instagram.com/cozinhamaster |
| `address_line1` | Av. Palmeiras, 463 |
| `address_line2` | Masterville — Sarzedo/MG |
| `hours_morning` | Ter–Dom: 07h às 14h |
| `hours_evening` | Qua–Seg: 16h às 23h |
| `hours_closed` | Terça (noturno): Fechado |

---

## O que vale adicionar

### ✅ Alta prioridade — muda com frequência

| Chave proposta | Valor atual | Onde aparece |
|---|---|---|
| `stat_patty_g` | 160 | Stats — "Xg / Patty artesanal" |
| `stat_anos` | 7 | Stats — "X anos / Aperfeiçoando receitas" |
| `stat_burgers` | 15 | Stats — "X+ / Hambúrgueres no menu" |
| `stat_rating` | 4.9 | Stats — "X★ / Avaliação média" |

> Os stats mudam com o tempo (anos de operação aumenta todo ano, menu cresce, etc.).
> São os mais chatos de editar no HTML porque têm atributo `data-value` além do texto.

---

### ✅ Média prioridade — muda às vezes

| Chave proposta | Valor atual | Onde aparece |
|---|---|---|
| `cta_heading` | Sua mesa espera por você | Seção CTA (final do scroll) |
| `cta_body` | Reserve agora e garanta... | Subtexto do CTA |
| `manifesto_common` | A maioria entrega velocidade. | Seção Manifesto |
| `manifesto_diff` | Nós entregamos memória. | Seção Manifesto (destaque) |
| `footer_tagline` | Artesanal. Sem Concessões. | Footer, abaixo da logo |

---

### ⚠️ Baixa prioridade — raramente muda

| Chave proposta | Valor atual | Motivo para não priorizar |
|---|---|---|
| `section_001_heading` | Onde a brasa encontra a arte | Copy criativo — edição pontual |
| `section_001_body` | Cada hambúrguer nasce... | Texto longo, formatação sensível |
| `section_002_heading` | Carne. Fogo. Perfeição. | Idem |
| `section_003_heading` | Do pão ao molho secreto | Idem |
| `hero_tagline_mono` | Blend Exclusivo · Autorais · Sarzedo/MG | Idem |

> Esses textos são possíveis de colocar no banco, mas o ganho prático é baixo —
> a chance de querer editar um headline criativo pelo painel é pequena,
> e qualquer erro de digitação quebra o visual da seção.

---

### ❌ Não faz sentido colocar no banco

| Item | Motivo |
|---|---|
| Labels de navegação ("Cardápio", "Nossa História") | Parte da estrutura do site |
| Textos com HTML interno (ex: `<br />`, `<em>`) | Risco de XSS, formatação quebraria |
| Ano do copyright no footer | Melhor atualizar com `new Date().getFullYear()` em JS |
| Nomes das seções (001, 002...) | Estrutura visual, não conteúdo |

---

## Implementação sugerida

Quando for implementar, o processo é:

1. Adicionar as linhas no `seed.sql` (INSERT INTO site_config)
2. Adicionar `data-cfg="chave"` nos elementos HTML correspondentes
3. O `site-config.js` já aplica automaticamente via `data-cfg` — sem alteração no JS

**Custo de implementação:** baixo para stats e manifesto (4-5 atributos simples).
O CTA heading tem `<br />` e `<em>` no HTML atual — precisaria ser dividido em
`cta_heading_line1` e `cta_heading_line2`, ou simplificado para uma linha.

---

## Recomendação

Implementar **em duas fases:**

**Fase 1 (vale fazer agora):**
- `stat_patty_g`, `stat_anos`, `stat_burgers`, `stat_rating`
- `manifesto_common`, `manifesto_diff`
- `footer_tagline`

**Fase 2 (opcional, se surgir necessidade):**
- Textos do CTA
- Headings das seções de scroll
