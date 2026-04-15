import { Link } from 'react-router-dom'
import { JAIME } from '@/lib/constants'

export default function Resources() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: '#002349' }}
    >
      <p
        className="font-body text-[11px] tracking-[0.2em] uppercase mb-4"
        style={{ color: '#C29B40' }}
      >
        {JAIME.name}
      </p>
      <h1
        className="font-display text-6xl text-white mb-4 text-center"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}
      >
        Resources
      </h1>
      <p
        className="font-body text-sm tracking-widest uppercase"
        style={{ color: 'rgba(255,255,255,0.4)' }}
      >
        Coming Soon
      </p>
      <Link
        to="/"
        className="mt-12 font-body text-[11px] tracking-[0.18em] uppercase border-b pb-0.5 transition-colors duration-200"
        style={{ color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.2)' }}
      >
        ← Back to Home
      </Link>
    </div>
  )
}
