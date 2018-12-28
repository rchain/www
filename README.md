www
----
www repository   contains Rchain websites.  These websites are:
- [rchain.coop](https://rchain.coop)
- [blog.rchain.coop](https://blog.rchain.coop)
- [developer.rchain.coop](https://developer.rchain.coop)
- [rsong.rchain.coop](https://rsong.rchain.coop)

The open-source RChain project is building a decentralized, economic, censorship-resistant, public compute infrastructure and blockchain. It will host and execute programs popularly referred to as “smart contracts”. It will be trustworthy, scalable, concurrent, with proof-of-stake consensus and content delivery.

```
  +------------------------------------------------------------------------+
  |                            Rchain K8 Cluster                           |
  |------------------------------------------------------------------------|
  |                                 +------------+                         |
  |                             +---|rchain-coop |                         |
  |  +-------+                  |   +------------+                         |
  |  | certs |                  |   +------------+                         |
  |  +-------+      +---+       |   |developer-  |          +------------+ |
  |  +-------+      | I |       +---|rchain-coop |<-------- | postgreSQL | |
  |  |issuer |<---->| n |       |   +------------+          +------------+ |
  |  +-------+      | g |<----->|   +------------+          +------------+ |
  |                 | e |       +---| wordpress  |<-------- |mysql       | |
  |  +-------+      | s |       |   +------------+          +------------+ |
  |  | cert- |      | s |       |   +-------+                              |
  |  | mgr   |      +---+       +---|rsong  |                              |
  |  +-------+                  |   +-------+                              |
  +------------------------------------------------------------------------+
```

 
## Installation
Install
- [git](https://git-scm.com/)
- [node & npm](https://www.npmjs.com/get-npm), required for testing

Content developers may use any additional content tool of their choice.

Developers will require additional tooling, see [Development setup](#Development-setup)

## Contributing
All work must have a corresponding work order, [JIRA ](https://rchain.atlassian.net) ticket.  To contribute:
- Fork the repo 
- Create your feature branch (git checkout -b feature/fooBar)
- Commit your changes as outlined in [Committing your work](#Commtting-your-work)
- Push to the branch (git push origin feature/fooBar)
- Create a new Pull Request
- Select a Reviewer

*Note: All pull request must be reviewed before merging to master branch*

## Releasing your changes to Production
www is a [CI/CD](https://cloud.google.com/kubernetes-engine/continuous-deployment/) project.  
Once pull requests are reviewed and merged to master branch, [Cloud Build](https://cloud.google.com/cloud-build/) is triggered to:
- build
- create docker containers
- publish containers to [Container Registry](https://cloud.google.com/container-registry/)
- deploy to [kubernetes (k8) cluster](https://kubernetes.io/)
To check the status of your build visit: https://console.cloud.google.com/cloud-build

#### Committing your work
Prefix git commit messages with one or more of prefixes as outlined here:


| Annotation | Description             | Example                                       |
| -----------|-------------------------|-----------------------------------------------|
| [INTERNAL] | used for internal stuff | git commit -m "[INTERNAL] my internal change" |
| [FIX]      | contains bug fix        | git commit -m "[FIX] my fix change"           |
| [FEATURE]  | contains a new feature  | git commit -m "[FEATURE] my new feature"      |
| [DOC]      | contains documentation  | git commit -m "[DOC] my documentation change" |



### Generating change logs and release
Change logs and release notes are generated on demand.  To generate to notes from the root of the project folder:

```
./changelog.sh
```

## Development setup
The websites are dockerized and deployed to [kubernetes-cluster](https://kubernetes.io/). 
You may build your own image by executing *make* from each sub-project folder:

```aidl
cd rchain-coop && make
cd developer-rchain-coop && make
cd rsong && make

```

You may also run the official docker image from from [GCP RChain Container Registry](https://console.cloud.google.com) provided that you have sufficient access

*Note: this is a private registry*



### Installation requirements
- [docker](https://www.docker.com/)
- [node & npm](https://www.npmjs.com/get-npm)

### Installing rchain.coop

```
git clone git@github.com:kayvank/www.git  ## replace kayvan with your git-user-id
cd www
cd rchain-coop
npm install
npm prune
gulp  ## transpiles the rchain.coop
npm start ## to execute the site
```
To test the rchain.coop locally point your browser to [localhost:3000](http://localhost:3000)
```
curl -v localhsot:3000
```

To create, publish and execute a docker image:
```
cd www
cd rchain-coop
make
docker images | grep rchain-coop
docker run -p3000:3000 <MY-DOCKER-ID>/rchain-coop:v1.0<SHORT-SHA>
```

### Installing developer.rchain.coop
To install and run developer.rchain.coop locally, pre-populated [postgreSQL](https://www.postgresql.org/) is required.  The project contains a [PostgreSQL docker-compose] that you may use. To use the docker-compose file, make sure you have setup your environment variables as outlined in [Project environment variables section](#Environment-variables)

```
git clone git@github.com:kayvank/www.git  ## replace kayvan with your git-user-id
cd www
cd developer-rchain-coop
npm install
npm prune
cd test
docker-compose up -d
docker inspect `docker ps | grep postgres | awk '{print $1}'` | grep IPAddress
## modify the DB_IP environment variable to match the postgres ip
gulp 
npm start ## to execute the site
```
To test the rchain.coop locally point your browser to [localhost:3000](http://localhost:3000)
```
curl -v localhsot:3000
```
### Installing rsong

```
git clone git@github.com:kayvank/www.git  ## replace kayvan with your git-user-id
cd www
cd rsong
make
docker images | grep rsong
docker run -p80:80 <MY-DOCKER-ID>/rsong:v1.0<SHORT-SHA>
```

To test the rchain.coop locally point your browser to  $DOCKER_IP, see environment variables.
```
curl -v $DOCKER_IP
```

### Environment variables

To build and run the projects locally configure your environment as such:
```
export DOCKER_USER= my_docker_username
export DOCKER_PASS=my_docker_secret_password
export SHA=`git rev-parse --short HEAD`
export SHORT_SHA=$SHA

export PGUSER='rock_user'
export PGPASSWORD='pg_secret_password'
export PGDB=$PGUSER
export DOCKER_IP='172.24.0.3' ## may have to be modified depending on docker inspect output
export DB_IP=$DOCKER_IP
export DB_URL="postgresql://$PGUSER:$PGPASSWORD@$DB_IP:5432/$PGDB"

export MYSQL_USER=user123
export MYSQL_PASS='password-123'
export MYSQL_ROOT_PASSWORD='my-root-password'
export K8_NAMESPACE='dev-blog'
```
Although not required, consider using [direnv](https://direnv.net/)

