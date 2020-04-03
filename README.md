# cyhi

## What is CYHI?
CYHI or Can You Hear It? is a demo Website using Vexflow and MIDI format to generate ear-training exercises. Random Exercises are computated based on a database of music scores and the user has to find the correct pitch for one specific note.

## Setup
git clone

cd api/cyhi-api //Go to api folder

edit seeder.module and App.module with your database connection infos

npm run seed //Setup the database with path of music scores

npm run start

cd ../../client

npm start

You're good to go
