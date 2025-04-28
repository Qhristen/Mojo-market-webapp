'use client'

import React, { useState } from 'react'
import CreateTokenForm from './create-token-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
export default function Create() {
  const [currentStep, setCurrentStep] = useState(0)

  const onboardingSteps = [
    {
      id: 'metatadata',
      title: 'Metata data',
      component: <CreateTokenForm onNext={() => setCurrentStep(1)} />,
    },
    {
      id: 'upload',
      title: 'Upload image',
      component: <CreateTokenForm onNext={() => setCurrentStep(1)} />,
    },
  ]
  return (
    <div>
      <Card className="p-6">
        <div className="h-full">
          <CardHeader className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Create new token</CardTitle>
                <CardDescription>
                  Step {currentStep + 1} of {onboardingSteps.length}
                </CardDescription>
              </div>
              <StepIndicator totalSteps={onboardingSteps.length} currentStep={currentStep} />
            </div>
          </CardHeader>
          <CardContent className="p-0">{onboardingSteps[currentStep].component}</CardContent>
        </div>
      </Card>
    </div>
  )
}

// Step Indicator Component
function StepIndicator({ totalSteps, currentStep }: { totalSteps: number; currentStep: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className={`h-2 w-2 rounded-full ${index <= currentStep ? 'bg-primary' : 'bg-muted'}`} />
      ))}
    </div>
  )
}
