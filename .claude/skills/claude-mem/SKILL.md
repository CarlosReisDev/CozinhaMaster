---
name: claude-mem
description: >
  Sistema de memória persistente para sessões Claude Code. Use esta skill sempre que precisar
  lembrar de decisões anteriores do projeto, buscar contexto de sessões passadas, ou salvar
  informações importantes para sessões futuras. Triggers: "lembra que...", "o que decidimos sobre...",
  "salva isso para depois", "busca no histórico", "contexto do projeto", "mem-search",
  "o que foi feito antes", "histórico de sessão". Esta skill integra com o plugin claude-mem
  (github.com/thedotmack/claude-mem) instalado via Claude Code plugin marketplace.
---

# Claude-Mem — Memória Persistente entre Sessões

## O que é

Claude-Mem é um plugin do Claude Code que captura automaticamente tudo que acontece nas sessões
de desenvolvimento, comprime com IA e injeta contexto relevante em sessões futuras.

## Pré-requisitos

O plugin já deve estar instalado via:
```
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
```

## Como usar esta skill

### Buscar contexto de sessões anteriores

Use a ferramenta `mem-search` para recuperar memórias relevantes:

```
// Busca por tema
mem-search("decisões de design do projeto")
mem-search("bugs corrigidos na semana passada")
mem-search("configuração do banco de dados")
```

**Workflow eficiente de 3 camadas (economiza ~10x tokens):**

1. `search` — índice compacto (~50-100 tokens/resultado)
2. `timeline` — contexto cronológico ao redor de resultados relevantes
3. `get_observations` — detalhes completos apenas dos IDs filtrados (~500-1000 tokens/resultado)

Exemplo:
```javascript
// Passo 1: busca índice
search(query="hamburgueria landing page", type="decision", limit=10)

// Passo 2: identifica IDs relevantes (ex: #42, #87)

// Passo 3: busca detalhes só do que interessa
get_observations(ids=[42, 87])
```

### Salvar contexto importante

Para garantir que decisões críticas sejam lembradas, sinalize com linguagem clara:

```
// Exemplos de frases que o claude-mem captura automaticamente:
"Decisão: vamos usar Tailwind ao invés de CSS puro neste projeto"
"Importante: a paleta de cores é vermelho #D62828 e amarelo #F7B731"
"Padrão definido: todos os componentes em /src/components/[nome]/index.jsx"
```

### Excluir conteúdo sensível

Use tags `<private>` para impedir que informações sensíveis sejam armazenadas:

```
<private>
  Credenciais do banco: postgres://user:senha@host/db
  API Key do Stripe: sk_live_...
</private>
```

### Ver memórias em tempo real

Acesse a interface web do claude-mem em:
```
http://localhost:37777
```

Mostra: stream de memórias em tempo real, histórico de sessões, configurações.

## Configuração do projeto CozinhaMaster

Adicione ao `~/.claude-mem/settings.json` para personalizar o contexto injetado:

```json
{
  "project": "CozinhaMaster",
  "context_injection": {
    "max_tokens": 2000,
    "include_types": ["decision", "bugfix", "architecture"],
    "exclude_paths": ["node_modules", ".git", "dist"]
  }
}
```

## Casos de uso neste projeto (hamburgueria)

- Lembrar decisões de design da landing page entre sessões
- Recuperar prompts de imagem gerados anteriormente (scroll-stop, deconstructed shots)
- Buscar código de animações GSAP já escritas
- Manter histórico das iterações do vídeo scroll-driven
- Persistir preferências de paleta, tipografia e tom de voz da marca

## Ferramentas MCP disponíveis

| Ferramenta | Uso |
|---|---|
| `search` | Busca full-text com filtros por tipo/data/projeto |
| `timeline` | Contexto cronológico ao redor de uma observação |
| `get_observations` | Detalhes completos por IDs (sempre em batch) |

## Troubleshooting

| Problema | Solução |
|---|---|
| Worker não inicia | `bun run ~/.claude/plugins/marketplaces/thedotmack/claude-mem/src/worker.ts` |
| Memórias não aparecem | Verifique http://localhost:37777, reinicie Claude Code |
| Contexto muito grande | Reduza `max_tokens` no settings.json |
| Busca não encontra | Use termos em inglês (o modelo processa em inglês internamente) |
