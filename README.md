# Simplified Trello Clone

A highly functional and polished Trello clone built with **Next.js (App Router)**, **TypeScript**, and **SCSS**. This project demonstrates advanced React patterns, custom state management, and a robust drag-and-drop experience.

## 🚀 Features

### Board & List Management
- **Editable Board Title**: Change the board name instantly.
- **List CRUD**: Create, rename, and delete lists.
- **Delete All**: Clear the entire board with a single confirmed action.
- **Horizontal Reordering**: Smooth drag-and-drop for reordering lists.

### Card Management
- **Card CRUD**: Add and delete cards within any list.
- **Drag & Drop**: Vertical sorting within lists and cross-list movement with real-time visual feedback.
- **Smooth Animations**: Lists expand and contract smoothly when cards are dragged over them.

### Card Details & Activity
- **Dedicated Modal**: Deep dive into card details.
- **Editable Descriptions**: Add and update detailed card information.
- **Comment System**: Add and delete comments with a dedicated scrollable activity section.
- **Polished UI**: Custom scrollbars and fixed headers for a professional feel.

### Safety & UX
- **Custom Confirm Dialogs**: A consistent, modern replacement for native `confirm()` prompts for all destructive actions.
- **Mobile Optimized**: 
  - Full-screen editing on mobile.
  - **Disabled Drag & Drop on Mobile**: Intentionally disabled to ensure a smooth scrolling experience without accidental item movement.
- **Data Persistence**: Automatic saving to `localStorage` via Zustand middleware.

## 🛠️ Technologies Used

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [SCSS](https://sass-lang.com/) (Modular architecture with Variables, Mixins, and Partials)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with Persistence
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/) (Custom Collision Detection)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏗️ Architecture

The project adheres to **SOLID principles** and clean code practices:
- **Separation of Concerns**: UI components are strictly for rendering. Business logic is extracted into a dedicated `boardService.ts`.
- **Custom Hooks**: Complex logic like Drag & Drop (`useBoardDnd`) and Device Detection (`useIsMobile`) is encapsulated in reusable hooks.
- **Service Layer**: All board manipulations are handled by pure functions in the service layer, making the app highly testable and independent of the state library.
- **Modular SCSS**: Styles are organized by component and utility, following a scalable folder structure.

## 📂 Folder Structure

```
├── app/               # Next.js App Router (Pages & Layout)
├── components/        # Reusable UI Components (Board, List, Card, Modal, etc.)
├── hooks/             # Custom React Hooks (D&D, Mobile detection)
├── store/             # Zustand State & Board Service (Logic layer)
├── styles/            # SCSS (Abstracts, Base, Component styles)
└── types/             # Shared TypeScript Interfaces
```

## 🏁 Getting Started

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```
4. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## 📝 License

This project was built for evaluation purposes.
