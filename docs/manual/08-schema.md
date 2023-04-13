---
title: Schema
---

FiDB can work without schema, all schemas are optional.
We can create and delete schemas at any time, without stopping the FiDB server.

We need to use json to describe schema of json data.

We can not use [json-schema](https://json-schema.org/understanding-json-schema/index.html),
because instead of writing:

```
{
  "type": "object",
  "properties": {
    "age": { "type": "number" },
    "name": { "type": "string" }
  }
}
```

We want to write something like:

```
{
  "name": "string",
  "age": "number"
}
```

How can we achieve this?

TODO