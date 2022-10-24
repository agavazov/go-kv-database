package storage

// @todo
// - Thing for some sharding & clustering
// - Reserve memory for each record
// - Check for reference return
// - Keys & Values methods can be optimised (keep the length somewhere or use array)
// - Read about map overwrite - clear method may not cleat the memory

var database = map[string]string{}

func Set(key string, value string) {
	database[key] = value
}

func Get(key string) (value string, found bool) {
	val, ok := database[key]
	return val, ok
}

func GetAll() map[string]string {
	return database
}

func Remove(key string) {
	delete(database, key)
}

func Clear() {
	database = map[string]string{}
}
