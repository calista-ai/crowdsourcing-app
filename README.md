# Crowdsourcing App - *Calista*

Web application for pairwise comparisons between images

## Prerequisites

* Docker
* Docker-compose

## Deployment

### Step 1 - Images

* Define the images that you want to collect data for
* Add these images in the folder *front-end/public/images/* 

### Step 2 - Environment variables

Add a *.env* file in the root folder of the project and set the following variables:

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

This step is required only for the first time that you will run the application. This may take a few minutes as it will download the images required. If you have already completed this step once successfully, then you can jump directy to Step 4.

**TL;DR**:

Run the following command:

      ./setup.sh --create --sortimages

**More detailed options**: 
* The images in front-end/public/images/ must be named with numbers starting from 0 (eg. 0.png, 1.png, 2.png, ...). If the images aren't already in this format, then you can use the option --sortimages to get them automatically renamed during the setup:

      ./setup.sh --sortimages

* If you want to set a new database, then it is required to have the file *db/utils/comparisons_data.json*. This file contains all possible pairwise comparisons that can be made between the images with random order. It is used for the database initialization. If you want to use a pre-existing *comparisons_data.json* file, then make sure that it is in *db/utils/* folder. Otherwise, you can use the option --create to get this file automatically created during the setup:

      ./setup.sh --create
      
* You can also combine multiple options or use none.

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
