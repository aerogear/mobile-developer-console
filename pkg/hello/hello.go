package hello

import (
	"fmt"
)

type HelloWorldService struct{}

func NewHelloWorldService() *HelloWorldService {
	return &HelloWorldService{}
}

func (hs *HelloWorldService) Hello(name string) (string, error) {
	if name != "" {
		return fmt.Sprintf("Hello %v!", name), nil
	}
	return "Hello world!", nil
}
