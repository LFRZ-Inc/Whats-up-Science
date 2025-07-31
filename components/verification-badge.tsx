interface VerificationBadgeProps {
  isVerified: boolean
  verificationMethod?: string
  className?: string
}

export function VerificationBadge({ isVerified, verificationMethod, className }: VerificationBadgeProps) {
  if (!isVerified) {
    return null
  }

  const getBadgeText = () => {
    switch (verificationMethod) {
      case 'university_email':
        return 'University Verified'
      case 'orcid':
        return 'ORCID Verified'
      case 'manual':
        return 'Manually Verified'
      default:
        return 'Verified Scientist'
    }
  }

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 bg-mintGreen text-deepBlue text-xs font-medium rounded-full ${className}`}>
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      {getBadgeText()}
    </div>
  )
} 