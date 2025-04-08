# Professional Resume Builder

A modern, feature-rich resume building application that helps users create, edit, and export professional resumes with multiple templates and advanced customization options.

## 🌟 Features

- **Multiple Professional Templates**: Choose from modern, professional, and creative templates
- **Intuitive Form Interface**: Easily input your personal information, work experience, education, skills, and more
- **Real-time Preview**: See changes to your resume instantly as you edit
- **PDF Export**: Download your completed resume as a professional PDF document
- **PDF Parsing**: Upload existing resume PDFs to automatically extract information
- **Responsive Design**: Build your resume on any device with a fully responsive UI
- **Data Persistence**: Your resume data is automatically saved as you work

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (as this is part of a Turborepo monorepo)

### Running Locally

Since this app is part of a Turborepo monorepo, run the following commands from the root of the repository:

```bash
# Install dependencies
pnpm install

# Start the development server for this app
pnpm dev
```

Or with environment variables:

```bash
dotenv -e ../../.env -- "next" "dev"
```

Visit `http://localhost:3000` to start building your resume.

## 🛠️ Technologies

This application is built with:

- [Next.js](https://nextjs.org) - React framework for server-rendered applications
- [React](https://reactjs.org) - UI library
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com) - Reusable UI components
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [pdf-parse](https://www.npmjs.com/package/pdf-parse) - PDF parsing library

## 📁 Project Structure

```
resumebuilder/
├── public/          # Static assets
├── src/
│   ├── app/         # Next.js app directory
│   │   ├── _components/  # Shared components
│   │   ├── api/     # API routes
│   │   └── ...      # Page routes
│   ├── components/  # Reusable components
│   │   └── pdf/     # PDF handling components
│   ├── lib/         # Utility functions
│   ├── store/       # Zustand store
│   └── ...
└── ...
```

## 🧩 Main Components

- **ResumeBuilder**: Main component orchestrating the resume building experience
- **ResumePreview**: Live preview of the resume with template rendering
- **TemplateSelector**: UI for selecting different resume templates
- **PdfUploader**: Component for uploading and parsing existing resumes
- **Form Components**: Specialized forms for each section of the resume

## 📝 License

[MIT](LICENSE)

---

This app is part of a larger monorepo project built with Turborepo.
