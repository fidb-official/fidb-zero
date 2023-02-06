import type Http from "http"

export function requestText(request: Http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Array<Buffer> = []

    request.on("data", (chunk: Buffer) => {
      console.log(chunk)
      chunks.push(chunk)
    })

    request.on("end", () => {
      const text = Buffer.concat(chunks).toString()
      resolve(text)
    })

    request.on("error", (error) => {
      reject(error)
    })
  })
}
