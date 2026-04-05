# Deploy — CozinhaMaster

## 1. Antes do deploy

### Preencher `js/config.js`
```js
const SUPABASE_URL      = 'https://xxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJ...';  // anon public — seguro para commitar
```

### Rodar o schema e seed no Supabase
```
Supabase Dashboard > SQL Editor > New Query
1. Cole e rode sql/schema.sql
2. Cole e rode sql/seed.sql
```

---

## 2. Configurar CORS no Supabase [FIX #3]

Sem essa configuração, o browser pode bloquear os requests em produção.

```
Supabase Dashboard
→ Settings
→ API
→ "Allowed Origins"
→ Adicionar: https://seudominio.com.br
→ Salvar
```

> Durante desenvolvimento (`localhost`) não precisa — o Supabase permite por padrão.

---

## 3. Deploy na plataforma

### Netlify
- O arquivo `netlify.toml` já configura os security headers automaticamente.
- Atualizar o redirect de domínio em `netlify.toml` com o domínio real:
  ```
  from = "http://seudominio.com.br/*"
  to   = "https://seudominio.com.br/:splat"
  ```

### Vercel
- O arquivo `vercel.json` já configura os security headers automaticamente.
- Nenhuma configuração extra necessária.

### Firebase Hosting / outro
- Configurar headers equivalentes no painel da plataforma.

---

## 4. Atualizar CSP com domínio real

Quando o domínio for definido, atualizar o `connect-src` em `netlify.toml` e `vercel.json`
para ser mais restrito (opcional — `*.supabase.co` já é seguro):

```
connect-src 'self' https://xxxx.supabase.co
```

---

## 5. Checklist pré-live

- [ ] `js/config.js` preenchido com chaves reais
- [ ] `sql/schema.sql` rodado no Supabase
- [ ] `sql/seed.sql` rodado com dados reais do cliente
- [ ] CORS configurado no Supabase com domínio real
- [ ] Domínio atualizado no `netlify.toml` ou `vercel.json`
- [ ] Testar cardápio em produção (cards carregam)
- [ ] Testar mobile
- [ ] Auditoria SEO com `/seo-strategy`
