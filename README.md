# @fluorinehq/nodejs-sdk

## Usage

```ts
import { getFluorine } from '@fluorinehq/nodejs-sdk'
import express from 'express'

const fluorine = getFluorine({
  clientId: '...',
  clientSecret: '...',
})

const app = express()

app.get('/', fluorine.record(), (req, res) => {
  // protected and billed!
  res.sendStatus(200)
})
```
