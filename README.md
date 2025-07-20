# FiDB

This is a Node.js implementation of **FiDB**
-- a suite of protocols to use file system as database.

Including a command-line tool to initialize and maintain database.

```
Commands:
  help [name]             Display help for a command
  init:database [path]    Initialize a directory to be a database
  serve:database [path]   Serve a database
  serve:subdomain [path]  Serve many databases using subdomain-based routing
```

And a HTTP server to generate REST API from a database.

```
POST   {data-path}?kind=data
GET    {data-path}?kind=data
PUT    {data-path}?kind=data
PATCH  {data-path}?kind=data
DELETE {data-path}?kind=data

GET    {data-directory}?kind=data-find

POST   {file}?kind=file
GET    {file}?kind=file
PUT    {flie}?kind=file
DELETE {flie}?kind=file

GET    {flie}?kind=file-metadata

POST   {flie}?kind=file-rename

POST   {directory}?kind=directory
GET    {directory}?kind=directory
DELETE {directory}?kind=directory
```

## Ethos

The ethos of the FiDB project is the following "what if ...?"s.

> What if we use file system as database?

> What if we generate HTTP API from the database, <br>
> instead of writing trivial CRUD code over and over again?

> What if we write web apps in a way that a user can switch backend, <br>
> even using their local backend?

## Install

### Requirements

Node.js version must
be >= [20.8.0](https://nodejs.org/en/blog/release/v20.8.0).

- For the `recursive` option to `readdir` and `opendir`.

### Command line tool

Install it by the following command:

```sh
npm install -g fidb
```

The command-line program is called `fidb`.

## Docs

- [Init a database](#init-a-database)
- [Serve one database](#serve-one-database)
- [Serve many databases](#serve-many-databases)
- [Register a user](#register-a-user)
- [Login a user](#login-a-user)
- [Config logger](#config-logger)
- [Get free certificate](#get-free-certificate)
- [Use systemd to start service](#use-systemd-to-start-service)

### Init a database

A database is just a directory of subdirectories and JSON data files,
with a `database.json` config file,
and with some more data files serve as
detailed system configurations.

Use the `fidb init:database` command to create a database:

```sh
fidb init:database hello-world
```

Example console output of `fidb init:database`:

```
17:07:19.297 [init] -- {"directory":"/databases/hello-world"}
17:07:19.301 [initDatabaseConfigFile] -- {"file":"/databases/hello-world/database.json"}
```

Let's see what files are created:

```
database.json
.groups/guest/index.json
.groups/owner/index.json
.groups/user/index.json
.guest-token-issuer/index.json
.tokens/guest/index.json
```

## Serve one database

Use the `fidb serve:database` command to serve a database:

```sh
fidb serve:database hello-world
```

The default port of the server is `5108`, which looks like FiDB isn't it?

## Serve many databases

Use the `fidb serve:subdomain` command
to serve many databases in one directory,
using subdomain-based routing.

For example, I have a VPS machine,
where I put all my databases
in the `/databases` directory.

```
/databases/x-wiki
/databases/x-news
...
```

I bought a domain for my server -- say `example.com`,
and configured my DNS to resolve `example.com`
and `*.example.com` to my server.

I also created certificate files for my domain using `certbot`.

- About how to use `certbot`, please see
  the ["Get free certificate"](#get-free-certificate) section.

I can use `fidb serve:subdomain` command to serve all of
the databases in `/databases` directory.

```sh
fidb serve:subdomain /databases/database.json
```

Where `/databases/database.json` is:

```json
{
  "server": {
    "hostname": "example.com",
    "port": 5108,
    "tls": {
      "cert": "/etc/letsencrypt/live/example.com/fullchain.pem",
      "key": "/etc/letsencrypt/live/example.com/privkey.pem"
    }
  }
}
```

- When using `fidb serve:subdomain`,
  the `server.hostname` option is required.

- And each database in `/databases` might have
  it's own `database.json` config file.

Then I can access all my databases via subdomain of `example.com`.

```
https://x-wiki.example.com:5108
https://x-news.example.com:5108
...
```

If no subdomain is given in a request,
`www/` will be used as the default subdomain directory
(while no redirect will be done).

Thus the following websites have the same contents:

```
https://example.com:5108
https://www.example.com:5108
```

## Register a user

Use `POST {data-file}?kind=password-register` HTTP request to register a new user:

```sh
curl -X POST "http://127.0.0.1:5108/users/alice?kind=password-register" --data-binary @-<< END

{
  "password": "wonderland",
  "data": {
    "name": "Alice"
  }
}

END
```

Example response:

```json
{
  "name": "Alice",
  "@path": "users/alice",
  "@revision": "b0b913da866105ad66299baf6aa4d783",
  "@createdAt": 1696152632809,
  "@updatedAt": 1696152632809
}
```

New data files for the user will be created:

```
users/alice/index.json
users/alice/.password/index.json
users/alice/.token-issuer/index.json
```

## Login a user

Use `POST {data-file}?kind=password-login` HTTP request to login an initialized user:

```sh
curl -X POST "http://127.0.0.1:5108/users/alice?kind=password-login" --data-binary @-<< END

{
  "password": "wonderland"
}

END
```

Example response:

```json

{ "token":"07cb46bde600f9ab97a22ecee8bc2389" }
```

New data file for the token will be created:

```
.tokens/07cb46bde600f9ab97a22ecee8bc2389/index.json
```

Which can be used in the `Authorization` header for future requests.

```
Authorization: token 34dbf6a79e7968ffc3cda1b51c3fada9
```

### Config logger

We can config logger in `/databases/database.json`:

```json
{
  ...,
  "logger": {
    "name": "pretty-line",
    "disableRequestLogging": true
  }
}
```

The type of logger options are:

```ts
export type LoggerOptions = {
  name: "json" | "silent" | "pretty" | "pretty-line"
  disableRequestLogging?: boolean
}
```

The default logger options are:

```json
{
  "name": "pretty-line",
  "disableRequestLogging": false
}
```

### Get free certificate

You can use `certbot` to get free certificate for your domains.

- [Certbot website](https://certbot.eff.org/instructions)
- [Certbot on archlinux wiki](https://wiki.archlinux.org/title/certbot)

After install `certbot`,
I prefer creating certificate via DNS TXT record,
using the following command:

```sh
sudo certbot certonly --manual --preferred-challenges dns
```

Then you can follow the prompt of `certbot`
to create the certificate files,
during which you will need to add TXT record
to the DNS record of your domain
to accomplish the challenge given by `certbot`.

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
sudo systemctl daemon-reload
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

## License

[GPLv3](LICENSE)
