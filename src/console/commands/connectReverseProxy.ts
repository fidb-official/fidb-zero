import { Buffer } from "node:buffer"
import Net from "node:net"
import { log } from "../../utils/log"

type Options = {
  server: { url: URL }
  target: { hostname: string; port: number }
  username: string
  password: string
}

export async function connectReverseProxy(options: Options): Promise<void> {
  const who = "connectReverseProxy"

  const { server, username, password, target } = options

  const response = await fetch(
    `${server.url.protocol}//${server.url.host}?kind=reverse-proxy-target`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    },
  )

  if (!response.ok) {
    log({
      knid: "Error",
      who,
      status: {
        code: response.status,
        message: response.statusText,
      },
    })

    return
  }

  const proxy = await response.json()

  log({ who, proxy })

  const proxySocket = Net.createConnection(proxy.port, server.url.hostname)

  proxySocket.on("close", () => {
    log({ who, message: "proxySocket closed" })
  })

  proxySocket.on("data", (data) => {
    const keyBuffer = data.subarray(0, proxy.keySize)
    const messageBuffer = data.subarray(proxy.keySize)

    const targetSocket = Net.createConnection(
      target.port,
      target.hostname,
      () => {
        targetSocket.write(messageBuffer)
      },
    )

    targetSocket.on("close", () => {
      log({ who, message: "targetSocket closed" })
    })

    targetSocket.on("data", (data) => {
      proxySocket.write(Buffer.concat([keyBuffer, data]))
    })
  })
}