package web

type HelloWorldable interface {
	Hello(string) (string, error)
}
