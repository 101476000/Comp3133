# 🚀 Quick Start Guide

## Para desarrollo rápido (5 minutos)

### 1. Clone y Setup
```bash
# Clonar el repositorio
git clone [your-repo-url]
cd 101476000_comp3133_assignment2

# Frontend
cd frontend
npm install
npm start
# Abrirá en http://localhost:4200

# En otra terminal - Backend (opcional para desarrollo)
cd backend
npm install
npm run dev
# Estará en http://localhost:4000
```

### 2. Test Credentials
Ya puedes:
- Ir a `/signup` y crear una nueva cuenta
- O ir a `/login` con credenciales de prueba

### 3. Usa la App
- ✅ Registrate como nuevo usuario
- ✅ Login con tus credenciales
- ✅ Añade empleados
- ✅ Busca por departamento/posición
- ✅ Edita/elimina empleados

---

## Para producción (Deploy a Vercel)

### Paso 1: Prepara tu código en GitHub

```bash
# Asegúrate de que el código está en GitHub
git status
git add .
git commit -m "Ready for production"
git push origin main
```

### Paso 2: Deploy Frontend a Vercel

```bash
# Opción A: CLI (fácil)
npm install -g vercel
cd frontend
vercel

# Opción B: Dashboard (recomendado)
# 1. Ir a vercel.com
# 2. Sign in con GitHub
# 3. New Project → Selecciona tu repo
# 4. Deploy
```

### Paso 3: Deploy Backend

Puedes usar:
- **Railway** (recomendado): railway.app
- **Heroku**: heroku.com
- **Render**: render.com

Pasos básicos:
1. Crea cuenta en tu plataforma elegida
2. Conecta tu GitHub
3. Crea nuevo proyecto apuntando a `/backend`
4. Configura variables de entorno (.env)
5. Deploy

### Paso 4: Actualiza endpoint GraphQL

En frontend, actualiza la URL de GraphQL:

```typescript
// frontend/src/main.ts
httpLink.create({
  uri: 'https://your-backend-url.com/graphql',
  credentials: 'include',
}),
```

---

## Estructura de carpetas

```
📦 101476000_comp3133_assignment2
 ├── 📁 frontend           # Aplicación Angular
 ├── 📁 backend            # API GraphQL
 ├── 📄 docker-compose.yml # Para desarrollo con Docker
 ├── 📄 README.md          # Documentación completa
 └── 📄 .gitignore         # Archivos a ignorar
```

---

## Problemas Comunes

### Puerto 4200/4000 en uso
```bash
# Frontend en otro puerto
ng serve --port 4201

# Backend en otro puerto
PORT=4001 npm run dev
```

### MongoDB no funciona
```bash
# Si usas MongoDB local, asegúrate que está corriendo
# En macOS con Brew:
brew services start mongodb-community

# En Windows, busca MongoDB en Services
```

### Error de CORS
- Backend debe tener CORS habilitado
- Frontend debe usar URL correcta de GraphQL

---

## Checklist antes de submit

- [ ] Código en GitHub con commits descriptivos
- [ ] Frontend buildea sin errores: `npm run build`
- [ ] Login/Signup funciona
- [ ] CRUD de empleados funciona
- [ ] Búsqueda/filtros funcionan
- [ ] Diseño es responsive
- [ ] Logout funciona
- [ ] Vercel deployment funciona
- [ ] README.md actualizado con URLs vivas

---

## Recursos Útiles

- 📖 [Angular Docs](https://angular.io/docs)
- 🔗 [GraphQL Docs](https://graphql.org)
- 🚀 [Vercel Docs](https://vercel.com/docs)
- 🍃 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- 🐳 [Docker Guide](https://docs.docker.com)

---

## Contacto & Ayuda

Si tienes preguntas:
1. Revisa el README.md completo
2. Verifica los archivos de ejemplo en `/backend`
3. Consulta la documentación de las librerías

**¡Buena suerte! 🎓**
