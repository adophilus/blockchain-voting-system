type AppInterface = {
  fetch: (request: Request, env: any) => unknown | Promise<unknown>
}

abstract class App {
  public abstract create(): AppInterface
}

export default App
