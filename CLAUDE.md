# CozinhaMaster — Contexto do Projeto

## O que é este projeto

Landing page cinematográfica scroll-driven para hamburgueria premium.
A experiência central é um **vídeo que avança conforme o usuário rola a página**,
no estilo Apple product pages — o scroll controla o tempo do vídeo frame a frame via canvas.

---

## Como iniciar o projeto

```bash
# 1. Abrir Claude Code com vault + projeto
claude --add-dir /media/carlosreis/Shared/Claude/claude-brain/ClaudeBrain \
       --add-dir /media/carlosreis/Shared/Projetos/CozinhaMaster

# 2. Buscar contexto de sessões anteriores
mem-search("CozinhaMaster")

# 3. Conferir tarefas pendentes
# Ler: ClaudeBrain/Projetos/CozinhaMaster/backlog.md
```

---

## Stack do projeto

| Categoria | Tecnologia |
|---|---|
| Estrutura | Vanilla HTML + CSS + JS (sem bundler) |
| Animação | GSAP + ScrollTrigger |
| Scroll suave | Lenis |
| Vídeo | Canvas frame-by-frame (webp extraído com FFmpeg) |
| Imagens | Unsplash com `&auto=format&fit=crop&q=80` |
| Package manager | pnpm (se necessário) |

> Sem React neste projeto — vanilla garante deploy estático simples e máxima performance
> no scroll-driven com canvas.

---

## Estrutura de pastas

```
CozinhaMaster/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── frames/                  ← frames extraídos do vídeo (frame_%04d.webp)
├── assets/
│   ├── videos/              ← vídeo original (.mp4 ou .mov)
│   └── images/              ← imagens geradas (scroll-stop, deconstructed)
└── .claude/
    ├── CLAUDE.md            ← este arquivo
    └── skills/
        ├── landing-page-cinematografica/
        ├── scroll-stop-prompter/
        ├── video-to-website/
        ├── seo-strategy/
        ├── nano-banana-2/
        ├── obsidian-skills/
        └── claude-mem/
```

---

## Skills ativas neste projeto

| Skill | Quando usar |
|---|---|
| `video-to-website` | Extrair frames do vídeo e montar o scroll-driven |
| `scroll-stop-prompter` | Gerar prompts para imagens do hambúrguer (assembled + deconstructed) |
| `nano-banana-2` | Gerar imagens hiper-realistas com schema JSON |
| `seo-strategy` | Otimizar o site antes de publicar |
| `claude-mem` | Recuperar decisões de sessões anteriores |
| `obsidian-skills` | Salvar decisões e prompts no vault |

---

## Decisões técnicas já tomadas

- **Sem framework** — vanilla HTML/CSS/JS para máxima performance no canvas
- **Frames em webp** — quality 80, largura máxima 1920px
- **FRAME_SPEED: 2.0** — vídeo completa em ~55% do scroll total
- **Scroll total: 800vh+** — mínimo para 6 seções respirarem bem
- **Texto sempre lateralizado** — nunca centralizado (40% das zonas laterais)
- **`data-persist="true"`** no CTA final — nunca desaparece
- **Preset estético: "Deep Space Tech"** — fundo escuro, tipografia bold, adequado para hamburgueria premium noturna

---

## Design

- **Fundo:** `#0a0a0a`
- **Acento:** vermelho profundo (definir hex com cliente — sugestão `#C0392B`)
- **Tipografia hero:** `clamp(4rem, 10vw, 10rem)` — massiva, nunca quebra no mobile
- **Noise overlay:** SVG global, opacidade `0.04`
- **Easing padrão:** `cubic-bezier(0.23, 1, 0.32, 1)` em todas as transições
- **Navbar:** pílula flutuante, muta para `backdrop-blur-xl` ao rolar

---

## Seções planejadas

| Seção | Scroll range | Animação |
|---|---|---|
| Hero standalone | 0–20% | `fade-up` staggered, circle-wipe revela canvas |
| Canvas (vídeo scroll) | 20–55% | Frame avança com scroll |
| Feature 1 | 22–38% | `slide-left` |
| Feature 2 | 38–54% | `slide-right` |
| Stats / Manifesto | 54–72% | `stagger-up` + counters |
| CTA final | 72–100% | `scale-up`, `data-persist="true"` |

---

## Próximos passos (backlog inicial)

- [ ] Cliente fornece vídeo do hambúrguer (`.mp4` ou `.mov`)
- [ ] Extrair frames com FFmpeg → `frames/frame_%04d.webp`
- [ ] Gerar imagens scroll-stop com `scroll-stop-prompter`
- [ ] Definir hex exato da cor de acento com cliente
- [ ] Definir textos de cada seção (headline, tagline, CTAs)
- [ ] Build do `index.html` + `app.js` + `style.css`
- [ ] Testar scroll em mobile (iPhone e Android)
- [ ] Auditoria SEO com `seo-strategy` antes de publicar

---

## Protocolo de fim de sessão

1. Registrar decisões em `ClaudeBrain/Projetos/CozinhaMaster/decisoes.md`
2. Atualizar backlog acima com o que ficou pendente
3. Commitar com `/commit`