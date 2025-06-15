
# 🧠 Symzle 🧩

### A daily logic puzzle game where you deduce a hidden sequence of symbols.

**[➡️ Click Here to Play the Live Game! ⬅️](https://symzle.netlify.app)**

</div>

<p align="center">
  <a href="https://app.netlify.com/projects/symzle/deploys">
    <img src="https://api.netlify.com/api/v1/badges/c7f23bdf-097f-4330-9be3-19dc6469382d/deploy-status" alt="Netlify Status">
  </a>
  <a href="https://choosealicense.com/licenses/mit/">
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License: MIT">
  </a>
</p>

<div align="center">

![Symzle Gameplay Screenshot](https://github.com/user-attachments/assets/5145acf7-d877-4a6d-9aa8-60bdeb272266)

</div>

---

## 🧩 About the Game

Welcome to Symzle! 👋 This is a code-breaking puzzle game where your goal is to figure out a secret sequence of symbols in six tries or less. Each day brings a new, unique challenge.

After each guess, the game gives you clues about correct symbols and positions, but it's up to you to use pure logic to find the solution. Because it's language-free, it's a universal puzzle for everyone to enjoy!

---

## ✨ Features

* **🗓️ Daily Puzzles:** A new, unique puzzle is available every single day.
* **🧠 Pure Logic:** No language knowledge is required. It's all about deduction!
* **📱 Responsive Design:** Looks and works great on any device, from phones to desktops.
* **🌙 Dark Mode:** Automatically adapts to your system's light or dark theme.
* **🔗 Shareable Results:** Easily share your daily score with friends in a spoiler-free format.

---

## 🛠️ Tech Stack

This project leverages a modern, full-stack toolkit to deliver a seamless experience.

| Category | Technology |
| :--- | :--- |
| **Frontend** | ⚛️ React, 🟦 TypeScript |
| **Styling** | 💨 Tailwind CSS |
| **Build Tool** | ⚡ Vite |
| **Backend** | ☁️ Supabase (Database & Auth) |
| **Deployment** | 🚀 Netlify |

---

<details>
<summary><h3>🚀 Click here for instructions to run this project locally</h3></summary>

### Prerequisites

You must have [Node.js](https://nodejs.org/) (version 16 or later) and [npm](https://www.npmjs.com/) installed on your machine.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/YOUR_USERNAME/symzle.git](https://github.com/YOUR_USERNAME/symzle.git)
    ```
    *(Replace `YOUR_USERNAME` with your actual GitHub username!)*

2.  **Navigate to the Project Directory:**
    The project files are located in the `/project` subfolder. You must navigate into it.
    ```sh
    cd symzle/project
    ```

3.  **Install NPM packages:**
    This will install all the necessary dependencies for the project.
    ```sh
    npm install
    ```

4.  **Set Up Environment Variables:**
    This application requires a connection to a Supabase backend. You will need to create your own free Supabase project to get the necessary API keys.

    * First, create a new file in the `project/` directory named `.env.local`.
    * Sign up for a free account at [Supabase.com](https://supabase.com) and create a new project.
    * In your Supabase project dashboard, go to **Project Settings** > **API**.
    * Copy your **Project URL** and your **`anon` (public) key**.
    * Paste them into your `.env.local` file using the following format:
        ```env
        VITE_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
        VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
        ```
    * **Note:** The `.env.local` file is listed in `.gitignore` and should not be committed to the repository.

5.  **Run the Development Server:**
    Now you are ready to start the application!
    ```sh
    npm run dev
    ```
    Your project should now be running at `http://localhost:5173`!

</details>

---

## 📜 License

This project is distributed under the MIT License. See the `LICENSE` file for more information.


