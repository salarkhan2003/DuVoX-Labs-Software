# DuVoX - Futuristic Startup Website

A modern, high-performance website built with Next.js 14+, TypeScript, and Tailwind CSS, featuring advanced animations and a futuristic design inspired by SpaceX's aesthetic.

## 🚀 Features

- **Next.js 14+** with App Router for optimal performance and SEO
- **TypeScript** for type safety and better developer experience
- **Tailwind CSS v4** with custom design system and dark/light mode
- **Framer Motion** for smooth animations and transitions
- **React Hook Form + Zod** for form handling and validation
- **Custom Design System** with AtkinsRealis-inspired typography (Montserrat)
- **Responsive Design** optimized for all devices
- **Performance Optimized** with font loading, image optimization, and more

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom theme
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **Fonts**: Montserrat (AtkinsRealis alternative)

### Development Tools
- **Linting**: ESLint with Next.js and TypeScript rules
- **Formatting**: Prettier with Tailwind CSS plugin
- **Type Checking**: TypeScript with strict configuration
- **Package Manager**: npm

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles and Tailwind config
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components (Header, Footer)
│   ├── sections/         # Page sections (Hero, About, etc.)
│   └── animations/       # Animation components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and constants
├── styles/               # Additional CSS modules
└── types/                # TypeScript type definitions
```

## 🎨 Design System

### Colors
- **Light Mode**: Clean whites and blacks with blue accents
- **Dark Mode**: Deep blacks with bright whites and blue accents
- **Automatic**: Respects system preference with manual override

### Typography
- **Primary Font**: Montserrat (300-900 weights)
- **Fallback**: System fonts for optimal loading
- **Optimization**: Font display swap for performance

### Components
- **Glass Effect**: Backdrop blur with transparency
- **Gradient Text**: Animated gradient text effects
- **Glow Effects**: Subtle glowing animations
- **Smooth Animations**: 60fps optimized transitions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd futuristic-startup-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking
- `npm run clean` - Clean build artifacts

## 🎯 Performance Features

- **Font Optimization**: Preloaded fonts with display: swap
- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic code splitting with Next.js
- **Static Generation**: Pre-rendered pages for optimal performance
- **Bundle Analysis**: Optimized bundle sizes

## 🔧 Configuration

### Tailwind CSS
Custom design system configured in `globals.css` with:
- CSS custom properties for theming
- Inline theme configuration for Tailwind v4
- Custom utility classes for effects

### TypeScript
Strict configuration with:
- Unused variable detection
- Exact optional properties
- No implicit returns
- Path mapping for clean imports

### ESLint
Comprehensive rules including:
- Next.js best practices
- TypeScript recommendations
- React optimization rules
- Import organization

## 🌟 Next Steps

This foundation is ready for implementing:
- 3D animations with Three.js/React Three Fiber
- Advanced form handling and validation
- API routes and database integration
- SEO optimization and analytics
- Performance monitoring

## 📄 License

This project is private and proprietary to DuVoX.