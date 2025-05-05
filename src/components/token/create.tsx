'use client'

import { useWalletUi } from '@wallet-ui/react'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import CreateTokenForm from './create-token-form'
import { KeypairSigner } from '@metaplex-foundation/umi'
import { TokenData } from '@/types'
import CreatPool from './create-pool'



export default function Create() {
  const [currentStep, setCurrentStep] = useState(0)
  const [playerTokenData, setPlayerTokenData] = useState<TokenData>()
  const { account } = useWalletUi()

  const onboardingSteps = [
    {
      id: 'metatadata',
      title: 'Metata data',
      component: account ? <CreateTokenForm onNext={() => setCurrentStep(1)} setPlayerTokenData={setPlayerTokenData} account={account} /> : null,
    },
    {
      id: 'Create pool',
      title: 'Create liquidity pool',
      component: account ? <CreatPool onNext={() => setCurrentStep(2)} tokenData={playerTokenData as TokenData} account={account} />: null,
    },
  ]

  return (
    <div>
      <Card className="p-6">
        <div className="h-full">
          <CardHeader className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className='font-jersey25 text-3xl'>Create new token</CardTitle>
                <CardDescription>
                  {account ? `Step ${currentStep + 1} of ${onboardingSteps.length}` : 'Wallet not connected'}
                </CardDescription>
              </div>
              <StepIndicator totalSteps={onboardingSteps.length} currentStep={currentStep} />
            </div>
          </CardHeader>
          {account ? <CardContent className="p-0">{onboardingSteps[currentStep].component}</CardContent> : null}
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
