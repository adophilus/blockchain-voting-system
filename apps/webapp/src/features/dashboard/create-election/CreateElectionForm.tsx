import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PlusCircle, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Backend from '@/features/backend'
import { useNavigate } from '@tanstack/react-router'
import { DateTimePicker24h } from '@/components/ui/datetime-picker-24h'
import { defaultValues } from './data'

const mediaDescriptionSchema = z.object({
  source: z.literal('sqlite'),
  id: z.string()
})

const candidateSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Candidate name must be at least 2 characters.' }),
  bio: z.string().optional(),
  imageFile: z.custom<File>().optional(),
  image: mediaDescriptionSchema.optional()
})

const positionSchema = z.object({
  title: z
    .string()
    .min(2, { message: 'Position title must be at least 2 characters.' }),
  description: z.string().optional(),
  maxCandidates: z
    .number()
    .min(1, { message: 'Must have at least 1 candidate.' }),
  candidates: z.array(candidateSchema)
})

const electionFormSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  description: z.string().optional(),
  startDate: z.date({
    required_error: 'A start date is required.'
  }),
  endDate: z.date({
    required_error: 'An end date is required.'
  }),
  positions: z.array(positionSchema),
  numberOfVoters: z
    .number()
    .min(1, { message: 'Number of voters must be at least 1.' })
})

export function CreateElectionForm() {
  const form = useForm<z.infer<typeof electionFormSchema>>({
    resolver: zodResolver(electionFormSchema),
    defaultValues
  })

  const {
    fields: positionFields,
    append: appendPosition,
    remove: removePosition
  } = useFieldArray({
    control: form.control,
    name: 'positions'
  })

  const createElection = async (values: z.infer<typeof electionFormSchema>) => {
    try {
      // 1. Handle image uploads
      const filesToUpload = values.positions.flatMap((position, pIndex) =>
        position.candidates
          .map((candidate, cIndex) => ({
            file: candidate.imageFile,
            pIndex,
            cIndex
          }))
          .filter((item) => item.file)
      )

      if (filesToUpload.length > 0) {
        const formData = new FormData()
        filesToUpload.forEach((item) => {
          formData.append('files', item.file!)
        })

        const uploadRes = await Backend.Client.client.request(
          'post',
          '/storage/upload',
          {
            body: formData as any
          }
        )

        if (uploadRes.error) {
          throw new Error('Image upload failed')
        }

        const mediaDescriptions = uploadRes.data.data

        // Create a mutable copy of the positions to update
        const updatedPositions = [...values.positions]
        mediaDescriptions.forEach((media: any, i: number) => {
          const { pIndex, cIndex } = filesToUpload[i]
          updatedPositions[pIndex].candidates[cIndex].image = media
        })
        // Update the form values with the new image data
        form.setValue('positions', updatedPositions)
      }

      // 2. Create election
      const createElectionRes = await Backend.Client.client.request(
        'post',
        '/elections',
        {
          body: {
            title: values.title,
            description: values.description,
            start_timestamp: values.startDate.toISOString(),
            end_timestamp: values.endDate.toISOString()
          }
        }
      )

      if (createElectionRes.error) throw new Error(createElectionRes.error.code)

      const electionId = createElectionRes.data.data.id

      // 3. Create positions
      const createPositionsRes = await Backend.Client.client.request(
        'post',
        '/elections/{electionId}/positions',
        {
          params: {
            path: {
              electionId
            }
          },
          body: {
            positions: values.positions.map((position) => ({
              title: position.title,
              description: position.description
            }))
          }
        }
      )

      if (createPositionsRes.error)
        throw new Error(createPositionsRes.error.code)
      const createdPositions = createPositionsRes.data.data

      // 4. Create candidates
      const createCandidatesRes = await Backend.Client.client.request(
        'post',
        '/elections/{electionId}/candidates',
        {
          params: {
            path: {
              electionId
            }
          },
          body: {
            candidates: values.positions.flatMap(({ candidates }, index) => {
              const position = createdPositions[index]

              return candidates.map((candidate) => ({
                name: candidate.name,
                bio: candidate.bio,
                position_id: position.id,
                image: candidate.image // Include the image media description
              }))
            })
          }
        }
      )

      if (createCandidatesRes.error)
        throw new Error(createCandidatesRes.error.code)

      // 5. Generate voters
      const generateVotersRes = await Backend.Client.client.request(
        'post',
        '/elections/{electionId}/voters',
        {
          params: {
            path: {
              electionId
            }
          },
          body: {
            count: values.numberOfVoters
          }
        }
      )

      if (generateVotersRes.error) throw new Error(generateVotersRes.error.code)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const navigate = useNavigate()

  const onSubmit = (values: z.infer<typeof electionFormSchema>) => {
    let status: 'SUCCESS' | 'ERROR'

    toast.promise(createElection(values), {
      loading: 'Creating election...',
      error: (err) => {
        status = 'ERROR'
        return err.message || 'Failed to create election. Please try again.'
      },
      success: () => {
        status = 'SUCCESS'
        return 'Election created successfully!'
      },
      finally: () => {
        if (status === 'SUCCESS') {
          navigate({ to: '/admin/dashboard/elections' })
        }
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Election</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Election Details */}
            <h3 className="text-lg font-semibold">Election Details</h3>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Election Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Presidential Election 2025"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description of the election"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date & Time</FormLabel>
                  <DateTimePicker24h
                    date={field.value}
                    setDate={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date & Time</FormLabel>
                  <DateTimePicker24h
                    date={field.value}
                    setDate={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Positions */}
            <h3 className="text-lg font-semibold mt-8">Positions</h3>
            {positionFields.map((positionField, positionIndex) => (
              <Card key={positionField.id} className="p-4 mb-4">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePosition(positionIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <FormField
                  control={form.control}
                  name={`positions.${positionIndex}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position Title</FormLabel>
                      <FormControl>
                        <Input placeholder="President" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`positions.${positionIndex}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Responsibilities of the position"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Candidates for this position */}
                <h4 className="text-md font-semibold mt-4">
                  Candidates for{' '}
                  {form.watch(`positions.${positionIndex}.title`) ||
                    `Position ${positionIndex + 1}`}
                </h4>
                <CandidatesFieldArray
                  positionIndex={positionIndex}
                  control={form.control}
                  form={form}
                />
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendPosition({
                  title: '',
                  description: '',
                  maxCandidates: 1,
                  candidates: [{ name: '', bio: '' }]
                })
              }
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Position
            </Button>

            {/* Number of Voters */}
            <h3 className="text-lg font-semibold mt-8">Voter Generation</h3>
            <FormField
              control={form.control}
              name="numberOfVoters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Voters codes (zk proofs) to Generate</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100"
                      {...field}
                      onChange={(event) => field.onChange(+event.target.value)}
                    />
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
              {form.formState.isSubmitting
                ? 'Creating Election...'
                : 'Create Election'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

// Helper component for nested candidates array
function CandidatesFieldArray({
  positionIndex,
  control,
  form
}: {
  positionIndex: number
  control: any
  form: any
}) {
  const {
    fields: candidateFields,
    append: appendCandidate,
    remove: removeCandidate
  } = useFieldArray({
    control,
    name: `positions.${positionIndex}.candidates`
  })

  return (
    <div className="space-y-4">
      {candidateFields.map((candidateField, candidateIndex) => {
        const imageFile = form.watch(
          `positions.${positionIndex}.candidates.${candidateIndex}.imageFile`
        )
        const previewUrl = imageFile ? URL.createObjectURL(imageFile) : null

        return (
          <div
            key={candidateField.id}
            className="flex items-stretch space-x-4 p-4 border rounded-lg"
          >
            {/* Left column: Image Preview */}
            <div className="w-32 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Candidate preview"
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <span className="text-sm text-gray-500">Image</span>
              )}
            </div>

            {/* Right column: Form Inputs */}
            <div className="flex-grow space-y-2">
              <FormField
                control={control}
                name={`positions.${positionIndex}.candidates.${candidateIndex}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Candidate Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Candidate Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`positions.${positionIndex}.candidates.${candidateIndex}.bio`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Input placeholder="Candidate Bio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`positions.${positionIndex}.candidates.${candidateIndex}.imageFile`}
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Candidate Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          onChange(file)
                        }}
                        {...rest}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Remove Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeCandidate(candidateIndex)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      })}
      <Button
        type="button"
        variant="outline"
        onClick={() => appendCandidate({ name: '', bio: '' })}
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Add Candidate
      </Button>
    </div>
  )
}
