export abstract class CronJob {
  public abstract getName(): string
  public abstract run(): Promise<void>
}
