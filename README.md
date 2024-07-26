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

Este documento explica el proceso de subida de archivos desde el componente `FileUpload` en el frontend, pasando por el endpoint `/api/fileUpload/multipleFile` en el backend, y cómo se integra esto con la base de datos para almacenar información sobre los archivos.

### 1. Componente `FileUpload` (Frontend)

El componente `FileUpload` permite a los usuarios seleccionar y subir archivos. Funciona de la siguiente manera:

- **Selección de Archivos:** Los usuarios pueden elegir uno o más archivos para cargar. La propiedad `accept` controla los tipos de archivos permitidos.
- **Subida de Archivos:** Al enviar el formulario, se recopilan los archivos y se envían al servidor utilizando `fetch` al endpoint `/api/fileUpload/multipleFile`. Los archivos y datos adicionales se adjuntan a un objeto `FormData`.
- **Respuesta y Callback:** Después de la subida, la API retorna una respuesta con la URL y otros datos del archivo. Esta respuesta se pasa a una función `onChange`, permitiendo acciones adicionales como guardar los datos en la base de datos.

### 2. API de Subida de Archivos (Backend)

El endpoint `/api/fileUpload/multipleFile` gestiona la recepción y procesamiento de los archivos subidos:

- **Autorización:** Verifica si el usuario está autorizado para subir archivos.
- **Procesamiento de Archivos:** Extrae los archivos y datos del objeto `FormData`, determina el directorio de destino basado en los datos proporcionados y guarda los archivos.
- **Respuesta:** Devuelve información sobre los archivos subidos, incluyendo URLs

### 3. Integración con la Base de Datos

Tras recibir la respuesta de la API de subida de archivos, se pueden realizar acciones adicionales como guardar los detalles del archivo en la base de datos:

- **Guardado en la Base de Datos:** Utiliza la información de la respuesta (e.g., `url`, `name`) para hacer una solicitud POST a otra API y guardar los detalles en la base de datos.
- **Manejo de Respuestas y Actualización de UI:** Muestra mensajes de éxito o error basados en el resultado de la operación y actualiza la interfaz de usuario según corresponda.

### Consideraciones Finales

- **Seguridad:** Implementa validaciones adecuadas y autorización para garantizar la seguridad del proceso de subida.
- **Manejo de Errores:** Proporciona un manejo robusto de errores tanto en el frontend como en el backend.
- **Flexibilidad y Escalabilidad:** Diseñado para ser flexible y escalable, permitiendo ajustes y expansión según sea necesario.
