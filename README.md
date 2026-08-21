# Bisão Ink

Site do estúdio de tatuagem Bisão Ink — Reduto, Belém - PA.

React 19 + Vite + TypeScript, com Tailwind CSS e Framer Motion.

## Rodar local

**Requisito:** Node.js 18+

```bash
npm install
npm run dev
```

O site sobe em http://localhost:3000.

```bash
npm run build     # gera dist/
npm run preview   # serve o dist/ para conferir antes de publicar
```

## Estrutura

| Caminho | O que é |
| --- | --- |
| `constants.tsx` | Link do WhatsApp, Instagram, endereço do estúdio e dados do portfólio |
| `components/` | Seções da página (Hero, Craft, Portfolio, Ritual, Schedule, Footer) |
| `hooks/useIsMobile.ts` | Detecta mobile via media query, com listener de resize |
| `public/assets/` | Fotos e vídeo |

## Pendências

- **Fotos do portfólio:** os itens marcados com `placeholder: true` em `constants.tsx`
  ainda são banco de imagem. Trocar por trabalho real do Bisão em `public/assets/`.
- **Vídeo do herói:** `public/assets/hero_mobile.mp4` tem 5 MB. Recomprimir
  (alvo: menos de 1,5 MB) e gerar uma versão `.webm`.
- **Domínio:** as URLs absolutas em `index.html` (canonical, Open Graph,
  JSON-LD) estão apontando para `https://bisaoink.com.br/`. Ajustar quando o
  domínio final for definido.
