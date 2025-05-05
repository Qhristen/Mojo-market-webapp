'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { UiWalletAccount, useWalletUi } from '@wallet-ui/react'
import { generateKeyPairSigner } from 'gill'
import { fetchMetadata } from 'gill/programs'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { useInitializePlatform, usFetchPlatformState } from '../account/account-data-access'
import { AppAlert } from '../app-alert'
import { Button } from '../ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { useCreateTokenWithMetatData, useMintToken, useUploadMetadata } from './create-token-data-access'
import { TokenData } from '@/types'

const formSchema = z.object({
  tokenName: z.string().min(2, 'Token name must be at least 2 characters'),
  tokenSymbol: z.string().min(1, 'Token symbol is required'),
  tokenDescription: z.string().min(10, 'Description must be at least 10 characters'),
  tokenSupply: z.string().min(1, 'Token supply is required'),
})

type FileType = {
  name: string
  type: string
  size: number
  url?: string
}
type FormData = z.infer<typeof formSchema>

export default function CreateTokenForm({ onNext, account, setPlayerTokenData }: { onNext: () => void; account: UiWalletAccount, setPlayerTokenData: (data: TokenData)=> void }) {
  const [uploadedFiles, setUploadedFiles] = useState<FileType[]>([])
  const { client } = useWalletUi()

  const creatToken = useCreateTokenWithMetatData(account)
  const mintToken = useMintToken(account)
  const platformQuery = usFetchPlatformState()
  const platformMutation = useInitializePlatform(account)
  const metadataMutation = useUploadMetadata(account)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tokenName: '',
      tokenDescription: '',
      tokenSupply: '',
      tokenSymbol: '',
    },
  })

  const onSubmit = async (data: FormData) => {
    if (!account) {
      toast.error(`No wallet account connected`)
      return
    }
    // const uri = await metadataMutation.mutateAsync({
    //   name: data.tokenName,
    //   symbol: data.tokenSymbol,
    //   description: data.tokenDescription,
    //   imageUrl: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p223094.png',
    // })

    const mint = await generateKeyPairSigner()
    await creatToken.mutateAsync({
      mint,
      metadata: {
        isMutable: true,
        name: data.tokenName,
        symbol: data.tokenSymbol,
        uri: "",
      },
    })

    await mintToken.mutateAsync({
      mint,
      amount: Number(data.tokenSupply),
    })

    setPlayerTokenData({ 
      mint: mint,
      name: data.tokenName,
      symbol: data.tokenSymbol,
      description: data.tokenDescription,
      uri: "https://resources.premierleague.com/premierleague/photos/players/250x250/p223094.png"
    })
    
    // const asset = await fetchMetadata(client.rpc, mint.address, { commitment: 'confirmed' })
    // console.log(asset, 'asset')

    onNext()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
      }))

      setUploadedFiles([...uploadedFiles, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles]
    if (newFiles[index].url) URL.revokeObjectURL(newFiles[index].url)
    newFiles.splice(index, 1)
    setUploadedFiles(newFiles)
  }

  if (platformQuery.isLoading) {
    return <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  }

  if (platformQuery.isError || !platformQuery.data) {
    return (
      <AppAlert
        action={
          <Button
            variant="outline"
            disabled={platformMutation.isPending}
            onClick={async () => await platformMutation.mutateAsync().catch((err) => console.log(err))}
          >
            {platformMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : (
              'Initialize platform'
            )}
          </Button>
        }
      >
        Platform is not initialized. Please initialize the platform to continue.
      </AppAlert>
    )
  }

  return (
    <div className="mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="tokenName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Name</FormLabel>
                <FormControl>
                  <Input placeholder="My Token" {...field} />
                </FormControl>
                <FormDescription>Enter the name of your token.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tokenDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe your token" className="resize-y min-h-[100px]" {...field} />
                </FormControl>
                <FormDescription>Provide a brief description of your token.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tokenSymbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Symbol</FormLabel>
                <FormControl>
                  <Input placeholder="SOL" {...field} />
                </FormControl>
                <FormDescription>Enter your token symbol (e.g., SOL).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tokenSupply"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Supply</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1000000" {...field} />
                </FormControl>
                <FormDescription>Enter the total supply of your token.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <Card className="border border-dashed border-primary/50 p-8 rounded-md">
            <CardHeader>
              <CardTitle>Image Upload</CardTitle>
              <CardDescription>Upload token image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="file-upload"
                    className="cursor-pointer border-2 border-dashed rounded-md px-3 py-2 flex items-center gap-2 hover:bg-accent"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Choose files</span>
                  </Label>
                  <Input id="file-upload" type="file" onChange={handleFileChange} className="hidden" multiple />
                </div>
                <p className="text-sm text-muted-foreground">Upload relevant file (JPG, PNG)</p>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="border rounded-md p-3">
                  <p className="text-sm font-medium mb-2">Uploaded image:</p>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex justify-between items-center bg-accent/30 rounded-md p-2">
                        <div className="flex flex-col">
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-8 w-8 p-0">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card> */}

          <Button className="w-full" disabled={creatToken.isPending || mintToken.isPending}>
            {creatToken.isPending || mintToken.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              '  Create & mint athelet token'
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
