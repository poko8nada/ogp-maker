---
title: Docker Basics for Development
createdAt: 2024-09-11
updatedAt: 2024-09-11
version: 1
isPublished: true
tags:
  - program
  - bugfix
  - diary
---

## Images

![Test Image](/api/images/sample01.png)
![Test Image](/api/images/sample02.png)

## What is Docker?

Docker is a containerization platform that packages your application and its dependencies into a container.

## Key Concepts

### Images

Blueprints for containers:

```dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Containers

Running instances of images:

```bash
docker run -p 3000:3000 myapp
```

## Common Commands

```bash
# Build an image
docker build -t myapp:1.0 .

# Run a container
docker run --name mycontainer myapp:1.0

# View running containers
docker ps

# View all containers
docker ps -a

# Stop a container
docker stop mycontainer

# Remove a container
docker rm mycontainer

# View logs
docker logs mycontainer
```

## Docker Compose

Define multi-container applications:

```yaml
version: "3.8"

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development

  db:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=password
```

## Benefits

- Consistent environments
- Easy deployment
- Scalability
- Isolation between services
