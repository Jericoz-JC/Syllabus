interface CourseCardProps {
  courseName: string
  instructor: string
  semester: string
}

export function CourseCard({ courseName, instructor, semester }: CourseCardProps) {
  return (
    <div className="relative bg-background-card rounded overflow-hidden mb-6">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
      <div className="p-6 pl-8">
        <h3 className="font-serif text-2xl italic text-foreground mb-2">
          {courseName || 'Untitled Course'}
        </h3>
        <p className="text-sm text-muted">
          {instructor || 'Unknown'} · {semester || 'Unknown'}
        </p>
      </div>
    </div>
  )
}
