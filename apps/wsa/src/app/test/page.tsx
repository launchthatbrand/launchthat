import { Button } from "@acme/ui/components/button";

export default function Page() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <Button size="sm" className="min-h-100px bg-red-500">
          Button
        </Button>
      </div>
    </div>
  );
}
