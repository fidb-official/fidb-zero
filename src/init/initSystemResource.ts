import { Database } from "../database"
import { dataCreate } from "../resources"
import { defaultTokenIssuerInit } from "../system-resources/default-token-issuer/defaultTokenIssuerInit"
import { log } from "../utils/log"

export async function initSystemResource(db: Database): Promise<void> {
  const who = "initSystemResource"

  await defaultTokenIssuerInit(db)

  {
    const path = ".tokens/default"
    const data = {
      issuer: ".default-token-issuer",
    }

    await dataCreate(db, path, data)
    log({ who, path })
  }

  {
    const path = ".password-register-strategy"
    const data = {
      loginTargets: {
        "users/{user}": {
          permissions: {
            "users/{user}/**": [
              "data:post",
              "data:get",
              "data:put",
              "data:patch",
              "data:delete",
              "data-find:get",
              "file:post",
              "file:get",
              "file:put",
              "file:delete",
              "file-metadata:get",
              "directory:post",
              "directory:get",
              "directory:delete",
            ],
            "users/*": ["data:get"],
            "users/*/public/**": [
              "data:get",
              "data-find:get",
              "file:get",
              "file-metadata:get",
              "directory:get",
            ],
          },
        },
      },
    }

    await dataCreate(db, path, data)
    log({ who, path })
  }
}
