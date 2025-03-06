import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WelcomeMessage() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-2xl font-bold text-[#2b0e4d]">
        Welcome to Wall Street Academy
      </h2>
      <p className="text-slate-600">
        What if you could stop worrying about chasing money and finally learn
        how to actually trade? Your journey to becoming a professional trader
        starts here.
      </p>
      <button className="mt-4 rounded-md bg-[#FC653C] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e55835]">
        Start Your Journey
      </button>
    </div>
  );
}
