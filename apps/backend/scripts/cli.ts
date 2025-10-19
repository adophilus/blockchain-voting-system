import { Command, Options } from '@effect/cli'
import { Command as PlatformCommand } from '@effect/platform'
import { NodeContext, NodeRuntime } from '@effect/platform-node'
import { Effect, Option } from 'effect'

const databaseCreateUserCommand = Command.make('user')
const databaseCreateCommand = Command.make('create')
const databaseCommand = Command.make('db')

const cli = Command.make(
  'cli',
  {
    db: Options.optional(
      Options.choice('target', ['production', 'staging', 'development'])
    )
  },
  ({ target }) =>
    Effect.gen(function*() {
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
