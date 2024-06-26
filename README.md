<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

 
## Descripcion

API para consumo y aplicacion de logica funcional para E-commerce Global Market Shop

## Instalacion

1. Instalar las dependencias
```
pnpm install
```
2. Clonar el archivo __.env.template__ y renombrarlo por __.env__ 
3. Cambiar las variables de entorno.

4. Levantar la base de datos
```
docker-compose up -d
```

5. Ejecutar SEED
```
http://localhost:3000/api/seed/
```

## Correr la aplicacion

```bash
# Desarrollo
$ pnpm run start

# Desarrollo con actualizacion automatica
$ pnpm run start:dev

# Produccion
$ pnpm run start:prod
```


## Ruta para leer documentacion de endpoints.

```bash
#Esto puede variar segun tu Host.
$ http://localhost:3000/api
```

## Licencia

Nest is [MIT licensed](LICENSE).
