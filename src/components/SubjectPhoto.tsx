import { subject } from '../data/case'

export function SubjectPhoto({ className = '' }: { className?: string }) {
  if (subject.photo) {
    return (
      <img
        className={`subject-photo ${className}`}
        src={`${import.meta.env.BASE_URL}${subject.photo}`}
        alt={`Photo of ${subject.name}`}
        width={240}
        height={300}
      />
    )
  }

  return (
    <div className={`subject-photo subject-photo--empty ${className}`} role="img" aria-label="Photo placeholder">
      <svg viewBox="0 0 120 150" aria-hidden="true">
        <circle cx="60" cy="55" r="26" />
        <path d="M14 150c4-34 22-52 46-52s42 18 46 52z" />
      </svg>
      <span>Photo pending</span>
    </div>
  )
}
