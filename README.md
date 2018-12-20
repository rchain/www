Rchain www assets
----
A repository for Rchain web assets

This is GCP kubernetes project 


### Required environment variables

To build and run the projects locally configure your environment as such:
```
export DOCKER_USER= myUserName
export DOCKER_PASS=myPassowrd
export SHA=`git rev-parse --short HEAD`
export SHORT_SHA=$SHA

export PGUSER='crypto_flash'
export PGPASSWORD='myPGPassword'
export PGDB=$PGUSER
export DB_IP='172.24.0.3' ## my docker ip
export DB_URL="postgresql://$PGUSER:$PGPASSWORD@$DB_IP:5432/$PGDB"

export MYSQL_USER=user123
export MYSQL_PASS='password-123'
export MYSQL_ROOT_PASSWORD='my-root-password'
export K8_NAMESPACE='dev-blog'
```
Although not required, consider using [direnv](https://direnv.net/)
