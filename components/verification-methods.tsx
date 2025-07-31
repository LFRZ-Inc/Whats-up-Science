'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

interface VerificationMethodsProps {
  onVerificationSubmit: (method: string, data: any) => void
  className?: string
}

export function VerificationMethods({ onVerificationSubmit, className }: VerificationMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [formData, setFormData] = useState<any>({})

  const verificationMethods = [
    {
      id: 'orcid',
      title: 'ORCID Verification',
      description: 'Connect your ORCID account for instant verification',
      tier: 'Gold Standard',
      icon: '🔬',
      fields: []
    },
    {
      id: 'university_email',
      title: 'Academic Email',
      description: 'Verify using your university or research institution email',
      tier: 'Gold Standard',
      icon: '🎓',
      fields: [
        { name: 'email', label: 'Academic Email', type: 'email', required: true }
      ]
    },
    {
      id: 'manual',
      title: 'Manual Verification',
      description: 'Submit documentation for manual review',
      tier: 'Manual Review',
      icon: '📋',
      fields: [
        { name: 'linkedin', label: 'LinkedIn Profile URL', type: 'url', required: false },
        { name: 'google_scholar', label: 'Google Scholar Profile', type: 'url', required: false },
        { name: 'publications', label: 'Publication DOIs (comma-separated)', type: 'text', required: false },
        { name: 'additional_info', label: 'Additional Information', type: 'textarea', required: false }
      ]
    }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onVerificationSubmit(selectedMethod, formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const getMethodFields = () => {
    return verificationMethods.find(m => m.id === selectedMethod)?.fields || []
  }

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-deepBlue mb-2">Choose Verification Method</h2>
        <p className="text-gray-600">
          Select the verification method that best suits your situation. Gold Standard methods provide instant verification.
        </p>
      </div>

      <div className="grid gap-4 mb-6">
        {verificationMethods.map((method) => (
          <Card 
            key={method.id}
            className={`cursor-pointer transition-all ${
              selectedMethod === method.id 
                ? 'ring-2 ring-deepBlue bg-blue-50' 
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedMethod(method.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{method.icon}</span>
                  <div>
                    <CardTitle className="text-lg">{method.title}</CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  method.tier === 'Gold Standard' 
                    ? 'bg-mintGreen text-deepBlue' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {method.tier}
                </span>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {selectedMethod && (
        <Card>
          <CardHeader>
            <CardTitle>
              {verificationMethods.find(m => m.id === selectedMethod)?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {getMethodFields().map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <Textarea
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                      required={field.required}
                    />
                  ) : (
                    <Input
                      type={field.type}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                      required={field.required}
                    />
                  )}
                </div>
              ))}
              
              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  className="btn-primary"
                >
                  Submit Verification
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setSelectedMethod('')
                    setFormData({})
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 