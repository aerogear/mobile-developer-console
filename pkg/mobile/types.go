package mobile

//Service represents a k8s service that can be consumed by a mobile client
//TODO: add more fields
type Service struct {
	ID     string
	Name   string
	Labels map[string]string
}
