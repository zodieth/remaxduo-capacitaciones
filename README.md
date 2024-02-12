## Info

Files will be uploaded to the `./public/FilesUploaded` directory.
Will be organized by `/<courseName>/` and then by `/<courseAttachment>/`, `/<courseImage>/` and `/<chapterVideo>/`
Also the filePath will be saved in the database. Example: `/FilesUploaded/<courseName>/<courseAttachment>/<fileName>`

## Estilo de Código y Pre-commits

Para asegurar la consistencia en el estilo de nuestro código y facilitar la colaboración, hemos integrado Prettier y Husky en el proyecto.

### Prettier

Prettier es una herramienta para formatear automáticamente nuestro código siguiendo un conjunto de reglas predefinidas. Esto nos ayuda a mantener un estilo coherente y a evitar discusiones sobre formatos en las revisiones de código.

Para formatear el código manualmente, ejecutá:

```bash
npm run format
```
