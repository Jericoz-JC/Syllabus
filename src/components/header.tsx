export function Header() {
  return (
    <header className="py-16 pb-12 border-b border-border mb-10 animate-fade-in">
      <div className="flex items-baseline gap-2 mb-4">
        <h1 className="font-serif text-5xl md:text-7xl font-normal italic tracking-tight text-foreground">
          Syllabus Parser
          <span className="inline-block w-3 h-3 bg-accent rounded-full ml-1 animate-pulse-dot" />
        </h1>
      </div>
      <p className="text-xs tracking-[0.15em] uppercase text-muted">
        Extract deadlines from any syllabus PDF
      </p>
    </header>
  )
}
