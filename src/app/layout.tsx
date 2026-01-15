import type { Metadata } from 'next'
import { Providers } from '@/components/providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Syllabus Parser - AI-Powered Date Extraction',
  description: 'Extract due dates, midterms, and assignments from university syllabi using AI. Compare models and export to markdown.',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📄</text></svg>",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="grain-overlay">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
