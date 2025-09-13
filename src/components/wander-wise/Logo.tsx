import { Plane } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-primary/20 rounded-full">
        <Plane className="h-7 w-7 text-primary" />
      </div>
      <h1 className="text-3xl font-extrabold font-headline tracking-tighter text-foreground">
        WanderWise
      </h1>
    </div>
  );
}
