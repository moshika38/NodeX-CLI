# NodeX CLI 🚀

A modern, fast, and interactive command-line interface (CLI) tool designed to bootstrap production-ready Node.js & Express backend projects within seconds.

```text
███╗   ██╗██████╗ ██████╗ ███████╗██╗  ██╗     ██████╗██╗     ██╗
████╗  ██║██╔═══██╗██╔══██╗██╔════╝╚██╗██╔╝    ██╔════╝██║     ██║
██╔██╗ ██║██║   ██║██║  ██║█████╗   ╚███╔╝     ██║     ██║     ██║
██║╚██╗██║██║   ██║██║  ██║██╔══╝   ██╔██╗     ██║     ██║     ██║
██║ ╚████║╚██████╔╝██████╔╝███████╗██╔╝ ██╗    ╚██████╗███████╗██║
╚═╝  ╚═══╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝     ╚═════╝╚══════╝╚═╝
```

---

## ✨ Features

- ⚡ **Instant Setup:** Generate a backend template in seconds.
- 🟦 **Language Options:** Full support for both **TypeScript** and **JavaScript**.
- 🗄️ **Database Support:** Choose between **SQLite**, **PostgreSQL**, and **MongoDB**.
- 🛠️ **Interactive Prompts:** Simple, intuitive CLI interface built using `@inquirer`.
- 📁 **Clean Architecture:** Pre-configured project structure ready for production.

---

## 🚀 Quick Start

You can run NodeX CLI directly using `npx` without installing it globally:

```bash
npx create-nodex-cli my-app
```

Or run it using `npm create`:

```bash
npm create nodex-cli my-app
```

---

## 📦 Global Installation (Optional)

If you prefer using the command globally, install it via npm or yarn:

```bash
# Using npm
npm install -g nodex-cli

# Using yarn
yarn global add nodex-cli
```

After installation, run:

```bash
nodex my-app
# OR
nodex-cli my-app
```

---

## 💻 Local Development Setup

If you want to contribute or run this project locally:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/nodex-cli.git](https://github.com/your-username/nodex-cli.git)
   cd nodex-cli
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Link locally:**
   ```bash
   npm link
   ```

4. **Test the CLI:**
   ```bash
   nodex test-app
   ```

---

## 🛠️ Options & Flow

When you run `nodex-cli <project-name>`, you will be prompted to select:

1. **Programming Language:**
   - `TypeScript`
   - `JavaScript`

2. **Database:**
   - `SQLite`
   - `PostgreSQL` *(Prompts for Connection String/URL)*
   - `MongoDB` *(Prompts for Connection String/URL)*

---

## 🔥 Preview

<img width="1026" height="597" alt="Screenshot from 2026-07-25 00-19-53" src="https://github.com/user-attachments/assets/fa1004d2-a39d-4cd0-84f1-b86b7947afe1" />

---

## 📜 License

This project is licensed under the **ISC License**.
