# Panda Bobba

Panda Bobba permite consultar el catálogo de bebidas y administrar sus fichas. Angular ofrece el panel de gestión, Spring Boot aplica permisos y validaciones en la API REST, y JPA guarda los cambios en la base de datos.

## Demostración local

Para construir el JAR necesitas un JDK 17 o superior, Maven 3.9 y Node.js 24 con npm disponibles en la terminal. En PowerShell, desde `Proyect_Spring`, ejecuta `.\run.ps1` para compilar e iniciar el proyecto. También puedes ejecutar los pasos por separado.

Si tienes una instancia abierta, detenla con `Ctrl+C` en su terminal antes de volver a compilar.

```sh
node scripts/package-demo.mjs
java -jar target/spring_bobba-0.0.1-SNAPSHOT.jar --spring.profiles.active=demo
```

Abre la [pantalla de inicio de sesión](http://127.0.0.1:8080/login) y elige una cuenta de demostración. Al ingresar se abre directamente el panel Angular.

| Cuenta | Contraseña local | Permisos |
|---|---|---|
| `admin` | `admin123` | Consultar, crear, editar y eliminar productos |
| `user` | `user123` | Consultar el catálogo y el detalle |

El perfil `demo` escucha en `127.0.0.1` y guarda la base H2 en `.data/panda-bobba.mv.db`. Reinicia el mismo JAR desde la misma carpeta para volver a abrir la base. Puedes aislar otra ejecución con `PANDA_DEMO_DB_PATH` (ruta sin extensión). Si el puerto 8080 está ocupado, añade `--server.port=8089` al comando de Java.

El botón **Iniciar sesión** del [sitio público](http://127.0.0.1:8080/) lleva a `/login`. Los enlaces anteriores `/panel` y `/gestion` abren el catálogo Angular y solicitan iniciar sesión cuando es necesario.

## Desarrollo

Ejecuta el backend con `mvn spring-boot:run "-Dspring-boot.run.profiles=demo"`. En otra terminal, entra a `frontend/` y ejecuta `npm ci` y `npm start`. Abre [Angular en desarrollo](http://localhost:4200/gestion-catalogo/). El proxy envía el acceso, sus recursos y la API a Spring Boot en el puerto 8080.

- `mvn -B test` ejecuta las pruebas de integración con H2 en memoria.
- `npm run build` dentro de `frontend/` genera una compilación de producción de Angular.
- `node scripts/package-demo.mjs` incluye esa compilación en el JAR y ejecuta las pruebas Maven.

## Perfil SQL Server

Crea la base `PandaBobbaBD` y configura `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME` y `SPRING_DATASOURCE_PASSWORD`. En instalaciones nuevas puedes aprovisionar las cuentas iniciales mediante `PANDA_BOOTSTRAP_ADMIN_PASSWORD` y `PANDA_BOOTSTRAP_USER_PASSWORD`. Inicia el JAR sin activar `demo` para usar el perfil SQL Server.

## Documentación del sistema

- [Funcionalidades, API REST, seguridad y persistencia](docs/SISTEMA.md)
