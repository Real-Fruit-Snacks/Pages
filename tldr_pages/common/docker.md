# docker

> Manage Docker containers and images.
> More information: <https://docs.docker.com/engine/reference/commandline/cli/>.

- List running containers:

`docker ps`

- List all containers (running and stopped):

`docker ps -a`

- Run a container from an image:

`docker run {{image_name}}`

- Run a container in interactive mode with a shell:

`docker run -it {{image_name}} /bin/bash`

- Run a container in the background:

`docker run -d {{image_name}}`

- Stop a running container:

`docker stop {{container_id}}`

- Remove a container:

`docker rm {{container_id}}`

- Pull an image from a registry:

`docker pull {{image_name}}`

- List available images:

`docker images`

- Execute a command in a running container:

`docker exec {{container_id}} {{command}}`

- Build an image from a Dockerfile:

`docker build -t {{image_name}} {{path/to/dockerfile_directory}}`

- View container logs:

`docker logs {{container_id}}`