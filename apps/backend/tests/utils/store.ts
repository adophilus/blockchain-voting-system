import assert from 'node:assert'
import { z } from 'zod'
import { getTestCache, setTestCache } from './test-cache'

const storeStage000 = z.object({
  stage: z.literal('000')
})

const storeStage001 = z.object({
  stage: z.literal('001'),
  auth: z.object({
    access_token: z.string(),
    refresh_token: z.string()
  }),
  user: z.object({
    id: z.string(),
    full_name: z.string(),
    email: z.string().email()
  })
})

const storeStage002 = z.object({
  stage: z.literal('002')
})

const storeStage003 = z.object({
  stage: z.literal('003'),
  chef: z.object({})
})

const storeStage004 = z.object({
  stage: z.literal('004'),
  item: z.object({
    id: z.string()
  })
})

const storeStage005 = z.object({
  stage: z.literal('005'),
  cart: z.object({
    id: z.string()
  })
})

const storeStage006 = z.object({
  stage: z.literal('006'),
  order: z.object({
    id: z.string()
  })
})

const storeStage007 = z.object({
  stage: z.literal('007'),
  recipe: z.object({
    id: z.string()
  })
})

type TStoreStage000 = z.infer<typeof storeStage000>
type TStoreStage001 = z.infer<typeof storeStage001>
type TStoreStage002 = z.infer<typeof storeStage002>
type TStoreStage003 = z.infer<typeof storeStage003>
type TStoreStage004 = z.infer<typeof storeStage004>
type TStoreStage005 = z.infer<typeof storeStage005>
type TStoreStage006 = z.infer<typeof storeStage006>
type TStoreStage007 = z.infer<typeof storeStage007>

type TStoreStage =
  | TStoreStage000
  | TStoreStage001
  | TStoreStage002
  | TStoreStage003
  | TStoreStage004
  | TStoreStage005
  | TStoreStage006
  | TStoreStage007

const storeStage000Progressive = storeStage000
const storeStage001Progressive = storeStage001.extend(
  storeStage000Progressive.omit({ stage: true }).shape
)
const storeStage002Progressive = storeStage002.extend(
  storeStage001Progressive.omit({ stage: true }).shape
)
const storeStage003Progressive = storeStage003.extend(
  storeStage002Progressive.omit({ stage: true }).shape
)
const storeStage004Progressive = storeStage004.extend(
  storeStage003Progressive.omit({ stage: true }).shape
)
const storeStage005Progressive = storeStage005.extend(
  storeStage004Progressive.omit({ stage: true }).shape
)
const storeStage006Progressive = storeStage006.extend(
  storeStage005Progressive.omit({ stage: true }).shape
)
const storeStage007Progressive = storeStage007.extend(
  storeStage006Progressive.omit({ stage: true }).shape
)

export const storeSchema = z.discriminatedUnion('stage', [
  storeStage000Progressive,
  storeStage001Progressive,
  storeStage002Progressive,
  storeStage003Progressive,
  storeStage004Progressive,
  storeStage005Progressive,
  storeStage006Progressive,
  storeStage007Progressive
])

export type TStoreState = z.infer<typeof storeSchema>
export type TStore = Awaited<ReturnType<typeof getStore>>

function precursorStage<Stage extends TStoreStage['stage']>(
  stage: Stage
): Stage extends '000'
  ? '000'
  : Stage extends '001'
    ? '000'
    : Stage extends '002'
      ? '001'
      : Stage extends '003'
        ? '002'
        : Stage extends '004'
          ? '003'
          : Stage extends '005'
            ? '004'
            : Stage extends '006'
              ? '005'
              : Stage extends '007'
                ? '006'
                : never

function precursorStage(stage: unknown): unknown {
  switch (stage) {
    case '000':
      return '000'
    case '001':
      return '000'
    case '002':
      return '001'
    case '003':
      return '002'
    case '004':
      return '003'
    case '005':
      return '004'
    case '006':
      return '005'
    case '007':
      return '006'
    default:
      throw new Error(`Invalid stage: ${stage}`)
  }
}

export const getStore = async () => {
  const cachedState = await getTestCache()

  const store = {
    state: cachedState ?? {
      stage: '000'
    },
    async setStage<
      Stage extends TStoreStage['stage'],
      State extends Omit<Extract<TStoreStage, { stage: Stage }>, 'stage'>
    >(stage: Stage, state: State) {
      assert(
        this.state.stage === precursorStage(stage),
        'Invalid stage transition'
      )

      const newState = {
        ...this.state,
        ...state,
        stage
      }

      storeSchema.parse(newState)
      this.state = newState
      await setTestCache(newState)
    }
  }

  return store
}

export const getStoreAtStage = async <Stage extends TStoreStage['stage']>(
  stage: Stage
): Promise<
  Omit<TStore, 'state'> & { state: Extract<TStoreStage, { stage: Stage }> }
> => {
  const store = await getStore()

  assert(store.state.stage === stage)

  return store as any
}
