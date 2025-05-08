import { useState } from 'react'
import clsx from 'clsx'
import { Button } from '../ui/button'
import { Info, LucideAlignVerticalJustifyEnd } from 'lucide-react'
import { AppModal } from '../app-modal'
import { Input } from '../ui/input'

const slippageTiers = [1, 5, 10]

export const Slippage = ({ slippage, setSlippage }: { slippage: number; setSlippage: (arg: number) => void }) => {
  const [input, setInput] = useState<number | null>(null)
  const [visible, setVisible] = useState(false)

  const custom = !slippageTiers.includes(input || -1)

  const canSubmit = !custom || (custom && input && input > 0 && input < 500)

  const handleSave = () => {
    input && setSlippage(input)
    console.log(slippage, 'slipegae')
    setVisible(!visible)
  }

  const setTieredSlippage = (tierIndex: number) => {
    setSlippage(Number(slippageTiers[tierIndex]))
  }

  console.log(slippage, "slippage")
  return (
    <AppModal title="Slippage settings" submit={handleSave} submitDisabled={!canSubmit} submitLabel="Save settings">
      <div>
        <div className="flex flex-row justify-between gap-2">
          {slippageTiers.map((e, i) => {
            return (
              <Button
                variant={'outline'}
                key={`slippage-option-${e}`}
                onClick={() => setTieredSlippage(i)}
                className="p-2 uppercase font-bold w-full"
              >
                {e / 10}%
              </Button>
            )
          })}
        </div>
        <div className="mt-5">
          <div>
            <Input
              onChange={(e) => setInput(10 * parseFloat(e.target.value.trim()))}
              placeholder="0.00 %"
              value={(input || 0) / 10}
              type="number"
              max={100}
              min={0}
              //   className="w-full h-full pr-10 text-lg font-bold text-right rounded-[5px] bg-neutral focus:outline-none"
            />
            {/* <span className="absolute text-lg font-bold top-3 right-5">%</span> */}
          </div>
        </div>
        {!canSubmit && (
          <div className="flex flex-col items-center mt-5">
            <div className="flex flex-row items-center">
              <Info className="h-[15px] text-orange-300 mr-2" />
              <span className="text-sm text-white">Slippage must be between 0 and 50</span>
            </div>
          </div>
        )}
      </div>
    </AppModal>
  )
}
