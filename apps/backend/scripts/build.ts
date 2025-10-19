import { Command, Options } from '@effect/cli'
import { Command as PlatformCommand } from '@effect/platform'
import { NodeContext, NodeRuntime } from '@effect/platform-node'
import { Effect, Option } from 'effect'

type Target = 'production' | 'staging' | 'development'

const buildSource = (target: Target) =>
  Effect.gen(function* () {
    const buildDirectory = './build'

    const entrypoint =
      target === 'production' || target === 'staging'
        ? './scripts/prod.ts'
        : './scripts/dev.ts'

    console.log('⚙ Building server...')
    yield* PlatformCommand.make(
      'bun',
      'build',
      entrypoint,
      '--target=node',
      `--outdir=${buildDirectory}`,
      '--entry-naming=[dir]/server.mjs'
    ).pipe(
      PlatformCommand.stdout('inherit'),
      PlatformCommand.stderr('inherit'),
      PlatformCommand.runInShell(true),
      PlatformCommand.start,
      Effect.flatMap((proc) => proc.exitCode),
      Effect.scoped
    )

    console.log('✅ Built server')
  })

const getTargetFromNodeEnv = (): Target => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return 'production'
    case 'staging':
      return 'staging'
    case 'development':
      return 'development'
    default:
      return 'development'
  }
}

const cli = Command.make(
  'cli',
  {
    target: Options.optional(
      Options.choice('target', ['production', 'staging', 'development'])
    )
  },
  ({ target }) =>
    Effect.gen(function* () {
      const _target = target.pipe(
        Option.match({
          onSome: (target: Target) => target,
          onNone: () => getTargetFromNodeEnv()
        })
      )

      yield* buildSource(_target)

      console.log('✅ Build complete')
    })
)

const app = Command.run(cli, {
  name: 'build',
  version: '0.0.1'
})

Effect.suspend(() => app(process.argv)).pipe(
  Effect.provide(NodeContext.layer),
  NodeRuntime.runMain
)
