# 🚀 John Cedric Acapulco — Portfolio

![GitHub stars](https://img.shields.io/github/stars/Ceddy21/website-portfolio?style=social)
![GitHub forks](https://img.shields.io/github/forks/Ceddy21/website-portfolio?style=social)
![GitHub issues](https://img.shields.io/github/issues/Ceddy21/website-portfolio)
![GitHub license](https://img.shields.io/github/license/Ceddy21/website-portfolio)

A modern, responsive portfolio website showcasing my work as a **Frontend Developer** and **Quality Assurance Engineer**. Built with React and featuring a custom 3D carousel, interactive project modals, and a smooth dark theme.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎨 **Glow Cursor** | Custom mouse follower with a subtle, premium feel |
| ⌨️ **Typing Animation** | Dynamic role display in the hero section |
| 🔄 **3D Project Carousel** | Interactive drag-to-scroll carousel with depth effects |
| 📱 **Project Modals** | Detailed project views with screenshots, tech stack, contributions, GitHub & Live Demo links |
| 📊 **Skills Section** | Organized by categories with iconography |
| 📧 **Contact Form** | Integrated with Formspree for email handling |
| 📜 **Scroll Progress Bar** | Visual indicator of scroll position |
| 🌙 **Dark Theme** | Elegant dark design with purple accents |
| 📱 **Fully Responsive** | Works on all screen sizes |

---

## 🛠️ Tech Stack

<table>
  <tr>
    <td align="center" width="96">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="40" height="40" alt="React"/>
      <br>React 18
    </td>
    <td align="center" width="96">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg" width="40" height="40" alt="CSS3"/>
      <br>CSS3
    </td>
    <td align="center" width="96">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vite/vite-original.svg" width="40" height="40" alt="Vite"/>
      <br>Vite
    </td>
    <td align="center" width="96">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg" width="40" height="40" alt="Git"/>
      <br>Git
    </td>
    <td align="center" width="96">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vercel/vercel-original.svg" width="40" height="40" alt="Vercel" style="filter: invert(1);"/>
      <br>Vercel
    </td>
  </tr>
</table>

### Frontend
- ⚛️ React 18
- 🎨 CSS3 (Custom, no frameworks)
- 🔤 Space Grotesk + JetBrains Mono fonts
- 🖼️ Lucide React Icons

### Backend / Services
- 📧 Formspree (Contact form)
- 🚀 Vercel (Hosting)

### Tools
- ⚡ Vite
- 🐙 Git & GitHub

---

## 📂 Project Structure

```
src/
├── components/
│   ├── GlowCursor.jsx      # Custom mouse follower
│   ├── Header.jsx          # Navigation with mobile menu
│   └── ProjectCarousel.jsx # 3D carousel with modal
├── sections/
│   ├── Hero.jsx            # Main landing section
│   ├── Skills.jsx          # Tech stack display
│   ├── Projects.jsx        # Project section wrapper
│   └── Contact.jsx         # Contact form + social links
├── data/
│   └── projects.js         # Project data
├── App.jsx
└── index.css               # All styles
```

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Ceddy21/website-portfolio.git
cd website-portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
VITE_CONTACT_EMAIL=your.email@example.com
VITE_PHONE_NUMBER=your number
```

### 4. Run the development server

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```

---

## 🎨 Color Palette

| Role | Hex | Preview |
|------|-----|---------|
| Background | `#12121e` | ![#12121e](https://via.placeholder.com/20/12121e/12121e?text=+) |
| Card Background | `#1a1a2e` | ![#1a1a2e](https://via.placeholder.com/20/1a1a2e/1a1a2e?text=+) |
| Text | `#a8a8c0` | ![#a8a8c0](https://via.placeholder.com/20/a8a8c0/a8a8c0?text=+) |
| Text Light | `#d8d8e8` | ![#d8d8e8](https://via.placeholder.com/20/d8d8e8/d8d8e8?text=+) |
| Text White | `#f0f0f5` | ![#f0f0f5](https://via.placeholder.com/20/f0f0f5/f0f0f5?text=+) |
| Accent (Primary) | `#7c6df0` | ![#7c6df0](https://via.placeholder.com/20/7c6df0/7c6df0?text=+) |
| Border | `rgba(255,255,255,0.06)` | — |

---

## 📱 Responsive Breakpoints

| Breakpoint | Target |
|------------|--------|
| `1200px` | Large desktops |
| `1024px` | Desktops, tablets |
| `900px` | Smaller tablets |
| `768px` | Tablets |
| `640px` | Large phones |
| `600px` | Phones |

---

## 🚀 Deployment

This project is deployed on **Vercel**.

### Deploy with Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Add environment variables
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Ceddy21/website-portfolio)
---

## 📝 Adding a New Project

1. Open `src/data/projects.js`
2. Add a new object to the `projects` array:

```js
{
  id: "your-project-id",
  logo: "/logo/your-logo.png",
  title: "Your Project Title",
  role: ["Your Role"],
  description: "Brief project description",
  tech: ["Tech 1", "Tech 2", "Tech 3"],
  contributions: [
    "Contribution 1",
    "Contribution 2",
    "Contribution 3"
  ],
  screenshots: [
    "/images/your-project/screenshot1.png",
    "/images/your-project/screenshot2.png"
  ],
  github: "https://github.com/your/repo",
  live: "https://your-live-demo.com",
  isPlaceholder: false
}
```

3. Add your project assets:
   - Logo: `public/logo/your-logo.png`
   - Screenshots: `public/images/your-project/`

---

## 🙋‍♂️ Author

### John Cedric Acapulco

<p align="left">
  <a href="https://github.com/Ceddy21">
    <img src="https://img.shields.io/github/followers/Ceddy21?label=GitHub&style=social" alt="GitHub">
  </a>
  <a href="https://www.linkedin.com/in/john-cedric-acapulco">
    <img src="https://img.shields.io/badge/LinkedIn-Connect-blue?style=social&logo=linkedin" alt="LinkedIn">
  </a>
  <a href="mailto:johncedric.acapulco21@gmail.com">
    <img src="https://img.shields.io/badge/Email-Contact-red?style=social&logo=gmail" alt="Email">
  </a>
</p>

- 🔗 GitHub: [@Ceddy21](https://github.com/Ceddy21)
- 🔗 LinkedIn: [John Cedric Acapulco](https://www.linkedin.com/in/john-cedric-acapulco)
- 📧 Email: [your.email@example.com](mailto:your.email@example.com)

---

## ⭐ Show Your Support

If you found this portfolio helpful or inspiring, please give it a ⭐ on GitHub!

<p align="center">
  <a href="https://github.com/Ceddy21/website-portfolio">
    <img src="https://img.shields.io/github/stars/Ceddy21/website-portfolio?style=for-the-badge" alt="Stars">
  </a>
  <a href="https://github.com/Ceddy21/website-portfolio/fork">
    <img src="https://img.shields.io/github/forks/Ceddy21/website-portfolio?style=for-the-badge" alt="Forks">
  </a>
</p>

---

## 📸 Screenshots

### Hero Section
<p align="center">
  <img src="/images/portfolio/portfolio1.png" alt="Hero Section" width="800">
</p>

### Projects Carousel
<p align="center">
  <img src="/images/portfolio/portfolio2.png" alt="Projects Carousel" width="800">
</p>

### Project Modal
<p align="center">
  <img src="/images/portfolio/portfolio3.png" alt="Project Modal" width="800">
</p>

---

## 🧩 Credits

| Resource | Link |
|----------|------|
| Fonts | [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) & [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) |
| Icons | [Lucide](https://lucide.dev/) |
| Form Handling | [Formspree](https://formspree.io/) |
| Hosting | [Vercel](https://vercel.com/) |

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Ceddy21">John Cedric Acapulco</a>
</p>

<p align="center">
  <img src="https://api.visitorbadge.io/api/visitors?path=Ceddy21%2Fwebsite-portfolio&label=Visitors&countColor=%237c6df0" alt="Visitors">
</p>
