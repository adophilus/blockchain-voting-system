import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import Backend from '@/features/backend'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { types } from '@blockchain-voting-system/api'

interface ElectionVoterVerificationProps {
  electionId: string
  election: types.components['schemas']['Api.Election.Election']
  onVoterVerified: (voterCode: string) => void
}

const voterVerificationSchema = z.object({
  voterCode: z.string().min(1, 'Voter code is required')
})

export function ElectionVoterVerification({
  electionId,
  onVoterVerified,
  election
}: ElectionVoterVerificationProps) {
  const form = useForm<z.infer<typeof voterVerificationSchema>>({
    resolver: zodResolver(voterVerificationSchema),
    defaultValues: {
      voterCode: ''
    }
  })

  const handleVerifyVoter = async (
    values: z.infer<typeof voterVerificationSchema>
  ) => {
    try {
      const response = await Backend.Client.client.request(
        'post',
        '/auth/sign-in/voter-code',
        {
          body: {
            election_id: electionId,
            voter_code: values.voterCode
          }
        }
      )

      if (response.error) {
        throw new Error(response.error.code)
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const onSubmit = (values: z.infer<typeof voterVerificationSchema>) => {
    let status: 'SUCCESS' | 'ERROR'

    toast.promise(handleVerifyVoter(values), {
      loading: 'Verifying voter code...',
      error: (err) => {
        status = 'ERROR'
        return err instanceof Error
          ? err.message
          : 'Failed to verify voter code. Please try again.'
      },
      success: () => {
        status = 'SUCCESS'
        return 'Voter verified successfully!'
      },
      finally: () => {
        if (status === 'SUCCESS') {
          onVoterVerified(values.voterCode)
        }
      }
    })
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>
          {election
            ? `Login to vote in "${election.title}"`
            : 'Enter Voter Code'}
        </CardTitle>
        <CardDescription>
          Please enter your unique voter code to access the ballot
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="voterCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Voter Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your voter code" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Verifying...' : 'Verify Code'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
