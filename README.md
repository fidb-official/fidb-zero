# FiDB

This is a Node.js implementation of [**FiDB**](https://fidb.app)
-- a suite of protocols to use file system as database.

Including a HTTP server to generate REST API from a database:

```bash
POST   {data-path}?kind=data
GET    {data-path}?kind=data
PUT    {data-path}?kind=data
PATCH  {data-path}?kind=data
DELETE {data-path}?kind=data

GET    {data-directory}?kind=data-find

POST   {file}?kind=file
GET    {file}?kind=file
PUT    {flie}?kind=file
PATCH  {flie}?kind=file
DELET  {flie}?kind=file

GET    {flie}?kind=file-metadata.

POST   {directory}?kind=directory
GET    {directory}?kind=directory
DELETE {directory}?kind=directory
```

A command-line tool to initialize and maintain database.

```sh
fidb help [name]   Display help for a command
fidb init [path]   Initialize a directory to be a database
fidb serve [path]  Serve a database
```

And some API functions to handle data files:

```js
import { Db } from "fidb"

Db.dataCreate(db: Database, path: string, input: JsonObject): Promise<Data>
Db.dataGetOrFail(db: Database, path: string): Promise<Data>
Db.dataGet(db: Database, path: string): Promise<Data | undefined>
Db.dataPut(db: Database, path: string, input: JsonObject): Promise<Data>
Db.dataPatch(db: Database, path: string, input: JsonObject): Promise<Data>
Db.dataDelete(db: Database, path: string, input: JsonObject): Promise<void>
...
```

## Install

### Requirements

Node.js version must
be >= [20.1](https://nodejs.org/en/blog/release/v20.1.0)
or >= [18.17.0](https://nodejs.org/en/blog/release/v18.17.0).

- For the `recursive` option to `readdir` and `opendir`.

### Command line tool

Install it by the following command:

```sh
npm install -g fidb
```

The command line program is called `fidb`.

## Docs

- [Init a database](#init-a-database)
- [Use systemd to start service](#use-systemd-to-start-service)

### Init a database

```sh
fidb init hello-world
```

Output:

```
13:58:26.119 [init] -- {"directory":"/home/xyh/play/hello-world"}
13:58:26.125 [initDatabaseConfigFile] -- {"file":"/home/xyh/play/hello-world/database.json"}
13:58:26.133 [initSystemResource] -- {"path":".config/default-token-issuer"}
13:58:26.134 [initSystemResource] -- {"path":".tokens/default"}
13:58:26.135 [initSystemResource] -- {"path":".config/password-register-strategy"}
13:58:26.201 [initExampleUser] -- {"path":"users/alice","password":"alice123"}
13:58:26.251 [initExampleUser] -- {"path":"users/bob","password":"bob456"}
```

Let's run `tree` to see what files are created:

```
~/play/hello-world
❯ tree -a
.
├── .config
│   ├── default-token-issuer
│   │   └── index.json
│   └── password-register-strategy
│       └── index.json
├── database.json
├── .tokens
│   └── default
│       └── index.json
└── users
    ├── alice
    │   ├── index.json
    │   ├── .login
    │   │   └── index.json
    │   └── .password
    │       └── index.json
    └── bob
        ├── index.json
        ├── .login
        │   └── index.json
        └── .password
            └── index.json

13 directories, 10 files
```

Serve the newly created database:

```sh
fidb serve hello-world
```

Example `password-login`:

```sh
curl -X POST "http://127.0.0.1:5108/users/alice?kind=password-login" --data-binary @-<< END

{
  "password": "alice123"
}

END
```

Output of `password-login`:

```json
"34dbf6a79e7968ffc3cda1b51c3fada9"
```

Example `password-register`:

```sh
curl -X POST "http://127.0.0.1:5108/users/carol?kind=password-register" --data-binary @-<< END

{
  "data": {
    "name": "Carol"
  },
  "options": {
    "memo": "Example `password-register`",
    "password": "carol789"
  }
}

END
```

Output of `password-register`:

```json
{
  "name": "Carol",
  "@path": "users/carol",
  "@revision": "6bbf9a32c4d0f7964d1fee2aa9491523",
  "@createdAt": 1694757904583,
  "@updatedAt": 1694757904583
}
```

### Use systemd to start service

Install service:

```
sudo cp <name>.service /etc/systemd/system/
```

Using service:

```
sudo systemctl start <name>.service
sudo systemctl enable <name>.service
sudo systemctl status <name>.service
```

To view log:

```
journalctl -f -u <name>.service
```

Reload systemd config files:

```
systemctl daemon-reload
```

## Development

```sh
npm install           # Install dependencies
npm run build         # Compile `src/` to `lib/`
npm run build:watch   # Watch the compilation
npm run format        # Format the code
npm run test          # Run test
npm run test:watch    # Watch the testing
```

## Contributions

To make a contribution, fork this project and create a pull request.

Please read the [STYLE-GUIDE.md](STYLE-GUIDE.md) before you change the code.

Remember to add yourself to [AUTHORS](AUTHORS).
Your line belongs to you, you can write a little
introduction to yourself but not too long.

## License

[GPLv3](LICENSE)
