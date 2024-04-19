# My Northcoders News API Project

## About The Project

Welcome to my first project of a Reddit-inspired web application designed to create and utilise databases. This app allows users to:

- Retrieve all topics, articles by ID and all comments by article ID,
- Create comments by article ID
- Update article votes
- Delete comments by comment ID

### Built With

- Node.js 21.5.0
- Postgres 14.11

### Hosted Version 1.0

```sh
https://my-nc-news-m78t.onrender.com/
```

## Running Project Locally

To have this project run locally, please follow the installation guide below.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/MuhammadSallu/my-news-project
   ```
2. Install NPM packages
   ```sh
   npm i
   ```
3. Create two .env files in the root directory to get this project to work: .env.test and .env.development.
   .env.test should contain:

   ```sh
   PGDATABASE=nc_news_test
   ```

   .env.development

   ```sh
   PGDATABASE=nc_news
   ```

4. Create the databases, in the terminal type:

```sh
npm run setup-dbs
```

5. If tests need to be run, it will automatically seed the databases with test data using the nc_news_test before each test as well as ending the database connection after each test. To run tests, type in the terminal:

```sh
npm run test
```

OR

Seeding the nc_news database and using the development data (if testing is not needed), type in the terminal:

```sh
npm run seed
```
