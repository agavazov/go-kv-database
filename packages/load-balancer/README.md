# load balancer

Simple TCP load bakancer wriiten on NodeJS and focused on Docker
WOrks like K8S native loadbalancer in fron of the scallable group of nodes
In this case it will listne for new instances.....

- health check
- round ribbon

  -v /var/run/docker.sock:/var/run/docker.sock \

curl -s --unix-socket /var/run/docker.sock http://dummy/containers/json