export default function Moon({ className, width, height }: { className?: string, width: number, height: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" className={className} color="currentColor" fill="currentColor"> 
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}