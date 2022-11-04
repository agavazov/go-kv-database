# KV database written in GO with 

### Build the project
`docker compose build`

### Start everything
`docker compose up`

### Run all integration tests
`docker compose run tests npm run test`

### Attach new database node
`docker compose run database`

### Stress tests
`docker compose run tests npm run stress`


# @todo
- circle ci
- liniters
- prittier
- FULL MESH
- PARTIAL MESH
- STARSHAPE MESH
- Docs 1h
- Run CI (for both branches) 1h 
- Write GO
- Add test cases for the mesh (join, warmup)

# @tests 100k (cluster 50; per cluster: 20)
- Avg request response: 1.05 ms (no docker + no load balancer; single node)
- Avg request response: 1.32 ms (nodeJS; docker + load balancer; single node)
- Avg request response: 1.24 ms (nodeJS; docker + load balancer; 5 nodes; no mesh)
- Avg request response: 1.52 ms (go; docker + load balancer; single node)

## Docs
- Кажи че всичко е type module
- Кажи че TS е на strict ниво
- Кажи че с джоиннването само към един нод, автоматично се джоинват всички нодове
- Кажи че има и warmup queue за да не се изпускат неща
- !!! to add node ` docker compose run database` while the others are running
- !!! tests docs add ` docker compose run tests npm run test`
- !!! tests docs add ` docker compose run tests npm run stress`
- !!! describe ` docker compose run tests npm run test:dev`
- Add docs in load-balancer
- Add docs for docker .env file
- Use always JSON
- Add column for possible reposes
  - `data` is the data response
  - `error` the format
  - `success` the format
  - `status` for the healthcheck
- Describe each method
- Add table of content
- Explain about the health check from haproxy and docker
- Explain the  integration-`tests` and add a link here
- Simple docs for `database-poc` and add a link here
- Explain `healthcheck`
- Add better tests explanations
- Add attach method (for the mesh, will be attached only after the status is `helath` and deatached if the status is `sick`)


![svg](/docs/mesh-state-1.svg)
![svg](/docs/mesh-state-2.svg)

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

Right now the load balancer config is at bare minimum level
