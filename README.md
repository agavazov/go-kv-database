# KV database written in GO with 

### Build the project
`docker compose build`

### Start everything
`docker compose up`

### Run all integration tests
`docker compose run tests npm run test`

### Attach new database node
`docker compose run -d database`

### Stress tests
`docker compose run tests npm run stress`

![svg](/docs/assets/mesh-state-1.svg)
![svg](/docs/assets/mesh-state-2.svg)

# Requirements

✅ In-memory

✅ Only HTTP GET queries

✅ Stress tests

✅ Performance for millions of keys

✅ Scalable

✅ Mesh (add & remove node)

🔲 Conflicts in a distributed transaction

🔲 Limitations: key - 64 chars; value - 256 chars

❌ MongoDB adapter

## Criteria


✅ Clean code

🔲 Proper comments in code (quality, not quantity)

✅ Architecture

🔲 Documentation

✅ Tests

🔲 Linters

🔲 CI configuration

✅ .gitignore

✅ Test coverage reporting

✅ Single command (for start, test, stress, linters, etc.)

## Potential problems

- Memory - Check the maximum dedicated memory, `NO_SWAP` param, no enough memory, etc.  

## Additional criteria
- TDD - Test Driven Development
- Containerisation - Everything is run under `Docker`

## Commands

| Route            | Summary                                           |
|------------------|---------------------------------------------------|
| /set?k={k}&v={v} | Set key k with value v                            |
| /get?k={k}       | Gets value with key k (`404` for missing keys)    |
| /rm?k={k}        | Removes key k (`404` for missing keys)            |
| /clear           | Removes all keys and values                       |
| /is?k={k}        | Check if key exists (`200` for yes, `404` for no) |
| /getKeys         | Should return all the keys in the store           |
| /getValues       | Should return all the values in the store         |
| /getAll          | Should return all pairs of key and value          |
| /healthcheck     | Return the health status                          |
| /settings        | Settings of the node                              |
| /join            | Join/invite the instance to the mesh              |

## What can be improved for next releases

### Communication between the mesh

I'm using workers which are doing HTTP requests to synchronise the databases,
but this can be improved with at least a simple TCP Socket

### Tests to be written on Go

Current tests are written on NodeJS (TypeScript, Mocha, Chai)

### TTL

Will be good if there is an observer for automatic record deletion after a specific time

### HaProxy configuration

Right now the load balancer env is at bare minimum level
