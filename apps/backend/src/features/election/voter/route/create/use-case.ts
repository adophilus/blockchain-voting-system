import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { VoterRepository } from '@/features/election/voter/repository/interface'
import { ulid } from 'ulidx'
import type { Voter } from '@/types'

// Helper function to generate a random alphanumeric string of a given length
function generateAlphanumericCode(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export class GenerateVotersUseCase {
  constructor(private voterRepository: VoterRepository) {}

  async execute(
    payload: Request.Body,
    electionId: string
  ): Promise<Result<Response.Success, Response.Error>> {
    const BATCH_SIZE = 100 // Number of codes to try inserting at once
    const MAX_RETRIES = 5 // Max retries for a batch if collisions occur

    let votersToGenerate = payload.count
    let generatedVoters: Voter.Selectable[] = []

    while (votersToGenerate > 0) {
      const currentBatchSize = Math.min(votersToGenerate, BATCH_SIZE)
      let batchToInsert: Voter.Insertable[] = []
      let attempts = 0

      while (
        batchToInsert.length < currentBatchSize &&
        attempts < MAX_RETRIES
      ) {
        const codesNeeded = currentBatchSize - batchToInsert.length
        const newCodes = new Set<string>()
        while (newCodes.size < codesNeeded) {
          newCodes.add(generateAlphanumericCode(7))
        }

        for (const code of Array.from(newCodes)) {
          batchToInsert.push({
            id: ulid(),
            election_id: electionId,
            status: 'NOT_VOTED',
            voted_at: null,
            code
          } satisfies Voter.Insertable)
        }
        attempts++
      }

      if (batchToInsert.length === 0 && votersToGenerate > 0) {
        // This case should ideally not happen if MAX_RETRIES is sufficient
        // but it's a safeguard against infinite loops if code generation is truly stuck
        return Result.err({
          code: 'ERR_UNEXPECTED'
        })
      }

      const result = await this.voterRepository.createMany(batchToInsert)

      if (result.isErr) {
        if (result.error === 'ERR_DUPLICATE_ENTRY') {
          // If duplicate, filter out the ones that caused the error and retry the batch
          // This is a simplified retry. A more robust solution would parse the exact duplicates.
          // For now, we assume the entire batch might have issues and regenerate.
          batchToInsert = [] // Clear batch to regenerate
          attempts = 0 // Reset attempts for this batch
          continue // Retry the current batch
        } else {
          return Result.err({ code: 'ERR_UNEXPECTED' })
        }
      }

      generatedVoters = generatedVoters.concat(result.value)
      votersToGenerate -= result.value.length
    }

    return Result.ok({
      code: 'VOTERS_GENERATED',
      data: generatedVoters
    })
  }
}
