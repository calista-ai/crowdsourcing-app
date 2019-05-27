# deep-web-aesthetics-app

Web application for pairwise comparisons between images

## Prerequisites

* Docker
* Docker-compose

## Deployment

### Step 1 - Images

Add the images in the folder *front-end/public/images/* 

### Step 2 - Environment variables

Add *.env* file in the root folder of the project which contains the following variables:

| Environment variable | Description | 
| :-------------: | :-------------: |
| MONGO_URI | MongoDB connection string |
| PORT | Server port |
| MONGO_PORT | MongoDB port |
| ME_CONFIG_MONGODB_ADMINUSERNAME | MongoDB username |
| ME_CONFIG_MONGODB_ADMINPASSWORD | MongoDB password |
| ME_CONFIG_BASICAUTH_USERNAME | Mongo-express username |
| ME_CONFIG_BASICAUTH_PASSWORD | Mongo-express password |
| NODE_ENV | Node environment variable |
| VOTING_ROUNDS | Number of voting rounds of each vote session |
| VOTING_TIME | Voting time in seconds of each comparison |
| NUMBER_OF_IMAGES | Number of images in front-end/public/images/ |
| BASEURL | Base URL that is used for the requests |


### Step 3 - Setup

The file *db/utils/comparisons_data.json* must contain all possible pairwise comparisons that can be made between the images with random order. 

* To setup with a pre-existing *comparisons_data.json* file, execute the command:

      ./setup.sh
    
* To setup by creating a new *comparisons_data.json* file, execute the command:

      ./setup.sh --create
      

### Step 4 - Run

Start:

    docker-compose -f docker-compose.yml up --build

Stop:

    Ctrl-C
    
**For detached mode**:

Start:

    docker-compose -f docker-compose.yml up -d --build

Stop:

    docker-compose down
