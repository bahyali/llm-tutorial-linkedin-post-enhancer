import { EnhancerApp } from '@/app/components/enhancer-app';

export default function HomePage() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center p-4 sm:p-12 md:p-24">
      <div className="w-full max-w-4xl">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
          LinkedIn Post Enhancer
        </h1>
        <p className="text-center text-muted-foreground mt-2 mb-8">
          Craft the perfect post in seconds using AI.
        </p>
        <EnhancerApp />
      </div>
    </main>
  );
}
