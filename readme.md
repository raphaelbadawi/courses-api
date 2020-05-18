# Courses API

> Backend API developed in the context of Brad Traversy's Node Udemy course.

## Usage

Rename "config/config.env.env" to "config/config.env" and update the settings

## Install Dependencies

```
npm install
```

## Run App

```
# Run in dev mode
npm run dev

# Run in prod mode
npm start
```

## Database Seeder

To seed the database with users, bootcamps, courses and reviews with the data from the "\_data" folder, run

```
# Destroy all data
node seeder -d

# Import all data
node seeder -i
```
