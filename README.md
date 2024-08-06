# Remax Up Capacitaciones

## Database

`npx prisma generate` para generar el cliente de la base de datos.
`npx prisma db push` para aplicar los cambios en el esquema de la base de datos.

Al usar prisma, si pones `npx prisma studio` , se ejecutará un servidor local que te permitirá ver y modificar la base de datos.
(Para esto, primero debes haber ejecutado `npx prisma generate`)
[ `localhost:5555` ]

## Info

Files will be uploaded to the `./public/FilesUploaded` directory.
Will be organized by `/<courseName>/` and then by `/<courseAttachment>/`, `/<courseImage>/` and `/<chapterVideo>/`
Also the filePath will be saved in the database. Example: `/FilesUploaded/<courseName>/<courseAttachment>/<fileName>`

## Estilo de Código y Pre-commits

Para asegurar la consistencia en el estilo de nuestro código y facilitar la colaboración, hemos integrado Prettier y Husky en el proyecto.

## Prettier

Prettier es una herramienta para formatear automáticamente nuestro código siguiendo un conjunto de reglas predefinidas. Esto nos ayuda a mantener un estilo coherente y a evitar discusiones sobre formatos en las revisiones de código.

Para formatear el código manualmente, ejecutá:

```bash
npm run format
```

## Flujo de Subida de Archivos

Usamos la action 'upload-files.ts' para subir los archivos al bucket. esto devuelve la url, y ahi esa url la usamos para guardar en la db el url en la entidad que corresponda.
