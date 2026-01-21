export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-24 text-secondary">
      <h1 className="font-serif text-5xl font-bold text-primary mb-4">
        Welcome to the New App
      </h1>
      <p className="text-xl font-sans opacity-90">
        This application uses the project's color schema and fonts.
      </p>
      <div className="mt-8 flex gap-4">
        <button className="rounded-full bg-primary px-6 py-2 text-white hover:opacity-90 transition-opacity font-medium">
          Get Started
        </button>
        <button className="rounded-full border border-secondary px-6 py-2 hover:bg-muted transition-colors">
          Learn More
        </button>
      </div>
    </div>
  );
}
