import { ResumeBuilder } from "./_components/ResumeBuilder";

export default function ResumePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold">Resume Builder</h1>
        <ResumeBuilder />
      </div>
    </main>
  );
}
