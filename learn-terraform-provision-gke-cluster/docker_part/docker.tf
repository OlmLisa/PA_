terraform {
 	required_providers {
    	docker = {
        	source  = "kreuzwerker/docker"
        	version = "2.14.0"
    	}
  	}
}

provider "docker" {
	host = "tcp://localhost:2375"
}


resource "docker_network" "bridge" {
  	name = "mybridgenetwork"
}

resource "docker_network" "host" {
  	name = "bcnetwork"
}

resource "docker_image" "nginx" {
	name = "nginx:latest"
}

resource "docker_image" "eth" {
	name = "hidexx/ethereum-node"
}

resource "docker_container" "nginx1" {
 	image = docker_image.nginx.latest
 	name  = "nginx1"
 	networks = ["mybridgenetwork"]
 	must_run = true
  publish_all_ports = true
  command = [
    "tail",
    "-f",
    "/dev/null"
  ]
}





resource "docker_container" "eth1" {
 	image = docker_image.eth.latest
 	name  = "eth1"
 	networks = ["bcnetwork"]
 	must_run = true
  publish_all_ports = true
  command = [
    "tail",
    "-f",
    "/dev/null"
  ]
}

