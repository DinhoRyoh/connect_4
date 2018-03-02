# connect_4

## PREREQUIS

- chalk
- compression
- express
- mongodb
- morgan
- nodemon
- readline
- docker

# Install docker
```
sudo apt-get update

sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu trusty stable"

sudo apt-get update

sudo apt-get install -y docker-ce zsh terminator
```


# Install docker compose
```
curl -L https://github.com/docker/compose/releases/download/1.19.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose

chmod +x /usr/local/bin/docker-compose

usermod -a -G docker apprenant

systemctl enable docker

service docker restart

docker -v

docker-compose -v

docker run -it --rm --volume $PWD:/app node bash

docker-compose run --rm node
```

## Commandes
```
git clone https://github.com/DinhoRyoh/connect_4.git myDir
cd myDir
docker-compose up -d mongo
docker-compose run dev bash
// Dans le ssh du container dev :
npm install
exit

docker-compose up server
```
Ensuite aller sur http://localhost:8000

# ENJOY
