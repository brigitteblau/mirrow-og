This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Blog (contenido desde PocketBase)

Las notas del blog (`/blog` y `/blog/[slug]`) se cargan desde PocketBase, igual que el
catálogo. Los dueños las escriben desde el admin de PocketBase, sin tocar código.

### Crear la colección `posts` (una sola vez)

En el admin de PocketBase → **Collections → New collection** → nombre `posts`, con estos campos:

| Campo       | Tipo               | Config |
|-------------|--------------------|--------|
| `titulo`    | Plain text         | requerido |
| `slug`      | Plain text         | único (se autogenera desde `titulo` si se deja vacío) |
| `resumen`   | Plain text         | opcional — bajada corta, se usa en las tarjetas y como descripción SEO |
| `contenido` | Rich editor        | cuerpo de la nota (negritas, títulos, listas, imágenes) |
| `portada`   | File (single, image)| imagen de portada / OpenGraph |
| `autor`     | Plain text         | opcional (default en el sitio: "Equipo Mirrow") |
| `publicado` | Date               | fecha de publicación; la nota se muestra solo si está cargada y es `<= hoy` |
| `orden`     | Number             | opcional |

**API rules:** dejar `List` y `View` públicas (vacías); `Create/Update/Delete` solo para admins.

### Hooks

Los archivos de `pocketbase/pb_hooks/` (`slugify.pb.js`, `revalidate.pb.js`) ya contemplan
la colección `posts`. Subilos a la instancia de PocketBase (carpeta `pb_hooks`) para que:

- el `slug` se genere solo a partir del `titulo`, y
- al crear/editar/borrar una nota se avise al sitio para refrescar el cache al instante
  (`REVALIDATE_URL` + `REVALIDATE_SECRET` en el entorno de PocketBase).

### Publicar una nota

1. **Collections → posts → New record**.
2. Completar `titulo`, `resumen`, `contenido`, subir `portada` y poner `publicado` = fecha de hoy.
3. Guardar. La nota aparece en `/blog` en segundos (o hasta 5 min si el webhook no está configurado).

## Preguntas frecuentes

Las preguntas de `/preguntas-frecuentes` están fijas en el código, en
`src/lib/preguntas.ts`. Para cambiarlas se edita ese archivo y se hace deploy.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
