export default function Logo({ className, width, height}: { className?: string, width: number, height: number}) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className} stroke="currentColor" fill="transparent">  
      <g id="ic-statistics-4">
        <circle cx="7" cy="16" r="2" />
        <circle cx="16" cy="6" r="3" />
        <circle cx="18" cy="18" r="4" />
        <circle cx="4" cy="4" r="2" />
        <line x1="14" y1="18" x2="8.76" y2="16.95" />
        <line x1="16.96" y1="8.84" x2="18.28" y2="14.02" />
        <line x1="6" y1="4" x2="13.16" y2="5.02" />
        <path d="M6.74,14C7,14,4.36,6,4.36,6" />
      </g>
    </svg>
  )
}