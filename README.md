# KV database written in Go
Hello World

# Requirements
- In-memory
- Only HTTP GET queries
- Scalable
- Mesh (add & remove node)
- Limitations: key - 64 chars; value - 256 chars
- Performance for millions of keys
- Conflicts in distributed transaction
- Stress tests

## Criteria
- Clean code
- Proper comments in code (quality, not quantity)
- Architecture
- Documentation
- Tests
- Linters
- CI configuration
- .gitignore
- Test coverage reporting
- Single command (for start, test, stress, linters, etc.)

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
