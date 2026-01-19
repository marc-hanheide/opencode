import { Server } from "../../server/server"
import { cmd } from "./cmd"
import { withNetworkOptions, resolveNetworkOptions } from "../network"
import path from "path"

export const ServeCommand = cmd({
  command: "serve",
  builder: (yargs) =>
    withNetworkOptions(yargs).option("dir", {
      type: "string",
      describe: "project directory to serve (defaults to current working directory)",
    }),
  describe: "starts a headless opencode server",
  handler: async (args) => {
    if (args.dir) {
      const baseCwd = process.env.PWD ?? process.cwd()
      const directory = path.resolve(baseCwd, args.dir)
      process.chdir(directory)
    }
    const opts = await resolveNetworkOptions(args)
    const server = Server.listen(opts)
    console.log(`opencode server listening on http://${server.hostname}:${server.port}`)
    await new Promise(() => {})
    await server.stop()
  },
})