# REST Client App

A lightweight version of **Postman**, built with **Next.js (App Router)** and **React 18+**.  
The application allows you to perform REST requests to any open API, manage variables, and store request history.

---

## 📌 Key Features

- 🔑 **Authentication & Registration** (Supabase).  
- 🌍 **Internationalization (i18n)** — at least 2 languages.  
- 📡 **REST Client**:
  - choose request method (GET, POST, PUT, DELETE, etc.);
  - enter endpoint (URL);
  - headers editor;
  - request body editor (JSON, Text);
  - generated code section (cURL, Fetch API, Node.js, Python, Java, C#, Go);
  - view response (HTTP status + body, read-only).
- ⚡ **Request History & Analytics**:
  - store request history in Supabase;
  - details about method, URL, status, execution time, request/response size;
  - restore and run saved requests.
- 🛠 **Variables**:
  - stored in `localStorage`;
  - substituted in URL, headers, and request body using `{{variableName}}`.

---

## 🗂 Application Pages

- **Home Page** — greeting with links to Sign In/Sign Up (if not authenticated) or REST Client / History / Variables (if authenticated).
- **Sign In / Sign Up** — authentication with password validation.
- **REST Client** (private route, code loaded lazily):
  - method, URL, headers, body, response, generated code.
- **Variables** (private route, lazy-loaded).
- **History** (private route, lazy-loaded, fetched from server).
- **404** and error boundaries.

---

## 🛠 Technical Requirements

- ⚛ **React 18+**  
- ⛓ **Next.js App Router**   
- 💬 **TypeScript**  
- 🧪 Tests (`npm test`), coverage ≥ 80%  
- 🧹 Linter (`npm run lint`)  
- 🎯 Code formatting (`npm run format-fix`)  
- 🪝 Husky hooks:
  - `pre-commit` → run `lint`
  - `pre-push` → run `test`
- 🌐 Support for the latest version of Google Chrome  

---

## 🔄 Workflow

- Repository: **rest-client-app**  
- Main branch: `main`  
- Development branch: `develop`  
- When finished → Pull Request `develop` → `main` (without merge)  

---

## 🚀 Deployment

The application is deployed on:  
- **Vercel**  

