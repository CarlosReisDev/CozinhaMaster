---
name: obsidian-skills
description: >
  Integração com Obsidian vault via Claude Code. Use esta skill para criar e editar notas
  Markdown no formato Obsidian, criar Bases (banco de dados visual), desenhar JSON Canvas,
  e interagir com o vault via CLI. Triggers: "salva no obsidian", "cria nota", "adiciona ao vault",
  "cria canvas", "wikilink", "base do obsidian", "propriedades da nota", "obsidian-cli",
  "extrai conteúdo da web", "defuddle". Requer o plugin obsidian-skills instalado:
  `/plugin marketplace add kepano/obsidian-skills`.
---

# Obsidian Skills — Agente para seu Vault

Conjunto de skills para interagir com seu vault Obsidian via Claude Code. Criado por
Stephan Ango (@kepano), criador do Obsidian Minimal theme.

## Skills incluídas

### 1. obsidian-markdown
Cria e edita arquivos `.md` com **Obsidian Flavored Markdown** completo.

**Sintaxe suportada:**

```markdown
---
tags: [hamburgueria, projeto, landing-page]
data: 2026-03-29
status: em-andamento
cliente: CozinhaMaster
---

# Título da nota

Wikilinks: [[Outra Nota]] ou [[Nota|Texto customizado]]
Embeds: ![[imagem.png]] ou ![[Outra Nota#Seção]]

> [!NOTE] Callout informativo
> Conteúdo do callout

> [!WARNING] Atenção
> Algo importante aqui
```

**Quando usar:** Documentar decisões do projeto, anotar prompts gerados, registrar
paleta de cores/tipografia, criar briefing da hamburgueria.

### 2. obsidian-bases
Cria arquivos `.base` — bancos de dados visuais dentro do Obsidian.

```yaml
# Exemplo: tabela de hambúrgueres do cardápio
filters:
  - field: tags
    operator: contains
    value: cardapio
views:
  - type: table
    columns: [nome, preco, calorias, status]
  - type: gallery
    cover: foto
formulas:
  preco_com_taxa: preco * 1.1
summaries:
  preco: average
```

**Quando usar:** Gerenciar cardápio, rastrear tarefas do projeto, organizar prompts de imagem.

### 3. json-canvas
Cria arquivos `.canvas` — mapas visuais conectados.

```json
{
  "nodes": [
    {
      "id": "hero",
      "type": "text",
      "text": "# Hero Section\nScroll-stop video aqui",
      "x": 0, "y": 0, "width": 300, "height": 150,
      "color": "1"
    },
    {
      "id": "menu",
      "type": "file",
      "file": "Cardapio/Principal.md",
      "x": 400, "y": 0, "width": 300, "height": 150
    }
  ],
  "edges": [
    {
      "id": "edge1",
      "fromNode": "hero", "fromSide": "right",
      "toNode": "menu", "toSide": "left",
      "label": "scroll para"
    }
  ]
}
```

**Quando usar:** Mapear arquitetura da landing page, fluxo de navegação, relacionamento
entre seções do site.

### 4. obsidian-cli
Interage com o vault via linha de comando.

```bash
# Abrir vault
obsidian open "CozinhaMaster"

# Abrir nota específica
obsidian open "CozinhaMaster" --note "Projetos/Landing Page"

# Buscar no vault
obsidian search "hamburgueria" --vault "CozinhaMaster"

# Criar nova nota
obsidian new --vault "CozinhaMaster" --title "Sprint 1 - Landing Page" --template "Projeto"
```

### 5. defuddle
Extrai markdown limpo de páginas web, removendo clutter e economizando tokens.

```bash
# Extrair conteúdo limpo de URL
defuddle https://exemplo.com/receita-hamburguer

# Salvar direto no vault
defuddle https://referencia-design.com > vault/Referencias/design-ref.md
```

**Quando usar:** Pesquisar referências de design, extrair conteúdo de sites concorrentes
para análise SEO, importar receitas/conteúdo para o site.

## Casos de uso no projeto CozinhaMaster

### Documentar o projeto
```markdown
---
tags: [cozinhamaster, landing-page, decisao]
data: 2026-03-29
tipo: decisão-técnica
---

# Decisão: Stack da Landing Page

## Contexto
Landing page scroll-driven para hamburgueria premium.

## Decisão
- Framework: Vanilla HTML/CSS/JS + GSAP
- Animação: Scroll-driven com canvas frame-by-frame
- Vídeo: [[Prompts/Scroll-Stop-Video]]

## Consequências
Sem bundler = deploy simples via qualquer hosting estático.
```

### Organizar prompts gerados
```markdown
---
tags: [prompt, imagem, scroll-stop]
objeto: hamburguer-artesanal
gerador: midjourney
status: aprovado
---

# Prompt A — Assembled Shot

[prompt completo aqui]

## Prompt B — Deconstructed
![[imagens/hamburguer-explodido.png]]

[prompt aqui]
```

### Canvas de arquitetura do site
Crie um canvas mostrando todas as seções da landing page e como elas se conectam.

## Instalação

```bash
# Via plugin marketplace do Claude Code
/plugin marketplace add kepano/obsidian-skills
/plugin install obsidian@obsidian-skills

# Ou manualmente: copie o conteúdo do repo para
# [seu-vault]/.claude/
```

## Referência rápida de sintaxe Obsidian

| Sintaxe | Resultado |
|---|---|
| `[[Nota]]` | Wikilink interno |
| `[[Nota\|Texto]]` | Wikilink com texto customizado |
| `![[Nota]]` | Embed de nota |
| `![[img.png\|300]]` | Imagem com largura |
| `#tag` | Tag inline |
| `> [!INFO]` | Callout |
| `%%comentário%%` | Comentário oculto |
| `==texto==` | Highlight |
