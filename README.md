# PickUp

[![N|Solid](https://cldup.com/dTxpPi9lDf.thumb.png)](https://nodesource.com/products/nsolid)

PickUp is a minimalistic application that allows users to join pick up sports games in the local area.

  - Use web interface or text message interface to join local sports games
  - Specify a time, sport, and a location that you will be coming from
  - Confirmation text messages are sent when player is added to the game queue and when game is full
  - If game does not fill within 30 minutes of game time, players are notified that the game is not full and is cancelled
  - Weather reports are sent to players for confirmed games.

![PickUp Input Form](./resources/pickup_input_form.jpg?raw=true "PickUp Input Form")
![PickUp How To](./resources/pickup_how_to.jpg?raw=true "PickUp How To")

### Tech Stack

PickUp uses a number of open source projects to find you games!:

![PickUp Tech Stack](./resources/pickup_tech_stack.jpg?raw=true "Tech Stack")

* [AngularJS] - HTML enhanced for web apps!
* [MongoDB] - managing game and user information for the app
* [Mongoose] - ORM to help interface between the server and the database
* [NodeJS] - evented I/O for the backend
* [ExpressJS] - fast node.js network app framework
* [Docker] - rapid deployment using containers for environment consistency
* [Grunt] - Build process for production environment files
* [Digital Ocean] - deployment environment for the live application
* [Twilio API] - enable SMS to and from users
* [Geocoder] - Get coordinates from an address
* [Google Places API] - assist in finding a nearby park to a location

### Models
The MongoDB database uses a single schema, keeping track of each Game. The schema stores the necessary user information
to send out text messages.

### Installation / Config to work locally on project

The application can be found at https://github.com/jalso-2/pickUp

To use/contribute to the application:
  - install MongoDB
  - Node version 7.6.0 - 7.10.0 should be used
  - Create a .env file
  - .env file should have:
    - PORT     (dev default was 7000)
    - MONGOURI   (dev default was mongodb://localhost/pickup)
    - TWILIO_SID
    - TWILIO_AUTH_TOKEN
    - GOOGLE_MAP
    - WEATHER_ID (from openweathermap.org)

Once configured run the following sequence of commands to get started and contribute!:

- Fork repository to your local GitHub account

```sh
git clone <your-pickup-repo>
cd pickUp
git remote add upstream <jalso-repo-clone-link>
npm i
bower i
grunt prod         (also available: grunt dev    grunt bypass)
```
(Note: You need to have Nodemon installed to run in development mode. If you do not have Nodemon, install it or use 'grunt prod or grunt bypass' instead)

### Redeploying the application - Creating docker-compose file
The application has been Dockerized to assist with consistency across all platforms. As a result, a docker-compose.yml
file should be created in the deploy environment and run to redeploy. The docker-compose.yml file should look similar
to the following but should have the INSERTs should be filled in. Keep in mind that during development the database 
url and other credentials may be acceptable but should be changed for more secure values when moving to production.

```sh
version: "2"

networks:
  app-tier:
    driver: bridge

services:
  mongodb:
    image: "bitnami/mongodb:latest"
    ports:
      - "27017:27017"
    networks:
      - app-tier
    environment:
      - MONGODB_USERNAME=INSERT-A-MONGODB-USERNAME
      - MONGODB_PASSWORD=INSERT-A-MONGODB-PASSWORD
      - MONGODB_DATABASE=pickup
  pickup:
    image: "INSERT-DOCKERHUB username/pickup HERE"
    command: bash -c "while ! </dev/tcp/mongodb/27017; do sleep 1; done; grunt prod;"
    depends_on: 
      - mongodb
    environment:
      - PORT=7000
      - MONGO_URI=mongodb
      - TWILIO_SID=INSERT-TWILIO-SID
      - TWILIO_AUTH_TOKEN=INSERT-TWILIO-AUTH-TOKEN
      - GOOGLE_MAP=INSERT-GOOGLE-MAP
      - WEATHER_ID=INSERT-WEATHER-ID
    networks:
      - app-tier
    ports: 
      - "7000:7000"
```

The above should be added into the ~ directory in the deployment environment. Use vim or nano to create a docker-compose.yml file and paste in the above code with replaced values as detailed previously.

Once this file has been created in the deployed environment, docker and docker-compose should be installed
there as well. Instructions to do this in an Ubuntu 16.04 box are below:

https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04

https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-16-04

### docker and docker-compose commands for re-deployment

Once this is done, deployment is done by running the following commands:

```sh
sudo docker-compose pull
sudo docker-compose up -d
```

With these commands, the application should be up and running. If any issues are encountered, individual containers can be stopped using the following commands:

```sh
sudo docker ps     (find the container id)
sudo docker container stop container CONTAINER_ID_HERE
sudo docker-compose up -d   (makes sure that all containers are running, otherwise it starts them all)
```

Finally, to shut down the containers before re-pulling new iterations, do the following:
```sh
sudo docker-compose down
sudo docker images     (note the image ids and remove them all with the following command)
sudo docker rmi IMAGE_ID_HERE     (perform rmi cmd listed to remove image on each image id)
```

After completing this, update the docker.yml file if needed and then re-pulling, etc can be performed with the previous commands.

