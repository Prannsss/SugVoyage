export default function OfflinePage() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-bold">You’re offline</h1>
        <p className="mt-2 text-muted-foreground">Please check your internet connection and try again.</p>
      </div>
    </main>
  );
}
