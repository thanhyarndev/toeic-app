# 🎯 TOEIC Vocabulary Learning App

A comprehensive web application designed to help users master TOEIC vocabulary through multiple interactive learning modes. Built with Next.js 15, TypeScript, and Tailwind CSS.

![TOEIC App Preview](https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)

## ✨ Features

### 🎓 Multiple Learning Modes

- **📝 Multiple Choice Quiz**: Test your knowledge with interactive quizzes
  - Word-to-meaning and meaning-to-word questions
  - Real-time scoring and progress tracking
  - Randomized question generation

- **✏️ Fill in the Blank**: Practice vocabulary by typing words based on Vietnamese hints
  - Immediate feedback on answers
  - Phonetic pronunciation guides
  - Example sentences for context

- **🔄 Sentence Reordering**: Improve grammar and sentence structure
  - Drag-and-drop interface using @dnd-kit
  - Visual feedback for correct/incorrect arrangements
  - Progressive difficulty levels

- **🎧 Listening Practice**: Enhance listening comprehension
  - Audio pronunciation of vocabulary words
  - Multiple choice listening exercises
  - Focus on TOEIC listening patterns

- **🃏 Flashcard System**: Spaced repetition learning
  - Interactive card flipping
  - Progress tracking with spaced repetition algorithm
  - Local storage for persistent learning progress
  - Statistics and learning analytics

- **🔗 Word Association**: Expand vocabulary through connections
  - Synonym and antonym exercises
  - Word relationship mapping
  - Contextual learning approach

### 🎨 User Experience

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Mode Support**: Toggle between light and dark themes
- **Smooth Animations**: Engaging transitions and micro-interactions
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Vietnamese Language Support**: Full localization with Lora font

### 📊 Learning Analytics

- Real-time progress tracking
- Performance statistics
- Learning streak monitoring
- Spaced repetition scheduling
- Exportable learning data

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.3.4** - React framework with App Router
- **React 19.0** - UI library
- **TypeScript 5.0** - Type-safe development
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons

### Interactive Features
- **@dnd-kit** - Drag and drop functionality
- **Local Storage API** - Persistent data storage
- **Web Audio API** - Audio playback for listening exercises

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Turbopack** - Fast development bundler

## 📦 Installation

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/toeic-app.git
   cd toeic-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📁 Project Structure

```
toeic-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── multiple-choice/    # Multiple choice quiz mode
│   │   ├── fill-blank/         # Fill in the blank exercises
│   │   ├── sentence-reorder/   # Sentence reordering mode
│   │   ├── listening/          # Listening practice mode
│   │   ├── flashcard/          # Flashcard learning system
│   │   ├── word-association/   # Word association exercises
│   │   └── api/               # API routes
│   ├── data/
│   │   └── vocabulary.json    # Vocabulary database (2000+ words)
│   ├── hooks/
│   │   └── useVocabularyDeck.ts # Custom hook for vocabulary management
│   ├── types/
│   │   └── vocabulary.ts      # TypeScript type definitions
│   └── lib/                   # Utility functions
├── public/                    # Static assets
├── tailwind.config.ts        # Tailwind CSS configuration
├── next.config.ts            # Next.js configuration
└── package.json              # Dependencies and scripts
```

## 📚 Vocabulary Database

The application includes a comprehensive vocabulary database with over 2000 TOEIC words featuring:

- **English words** with phonetic pronunciation
- **Vietnamese translations** (full and short meanings)
- **Part of speech** classification
- **Example sentences** in both languages
- **Synonyms and antonyms**
- **Topic categorization** (business, technology, general, etc.)
- **Difficulty levels** (A2, B1, B2, C1)

### Vocabulary Structure
```typescript
interface VocabularyItem {
  word: string;              // English word
  phonetic: string;          // IPA pronunciation
  meaning: string;           // Full English definition
  meaningVi: string;         // Full Vietnamese translation
  shortMeaningVi: string;    // Short Vietnamese meaning
  type: string;              // Part of speech
  example: string;           // Example sentence
  exampleMeaning: string;    // Vietnamese translation of example
  topic: string;             // Topic category
  level: string;             // Difficulty level
  synonyms: string[];        // Related words
  antonyms: string[];        // Opposite words
}
```

## 🎯 Learning Algorithm

### Spaced Repetition System
The flashcard mode implements a spaced repetition algorithm that:
- Tracks learning progress for each word
- Schedules reviews based on difficulty
- Adapts intervals based on user performance
- Optimizes retention through scientific learning principles

### Question Generation
- **Randomized selection** from vocabulary database
- **Balanced difficulty** distribution
- **Multiple question types** for comprehensive learning
- **Adaptive difficulty** based on user performance

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-friendly interactions
- Optimized performance for mobile devices
- PWA-ready architecture

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for environment-specific settings:

```env
NEXT_PUBLIC_APP_NAME=TOEIC Vocabulary App
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Tailwind Configuration
Customize the design system in `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-lora)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. Deploy automatically on push to main branch

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint for code quality
- Write meaningful commit messages
- Test all features before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TOEIC Vocabulary Database**: Curated collection of essential TOEIC words
- **Next.js Team**: For the amazing React framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Heroicons**: For the beautiful icon set
- **@dnd-kit**: For the drag and drop functionality

## 📞 Support

If you have any questions or need support:

- 📧 Email: support@toeic-app.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/toeic-app/issues)
- 📖 Documentation: [Wiki](https://github.com/yourusername/toeic-app/wiki)

---

<div align="center">
  <p>Made with ❤️ for TOEIC learners worldwide</p>
  <p>⭐ Star this repository if you find it helpful!</p>
</div>
