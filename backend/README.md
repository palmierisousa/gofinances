# TypeORM and Upload
A simple node.js application to control personal transactions. It's possible to create, list, delete and import transactions. It's one of the challenges that makes part of the Rocketseat bootcamp.

The app was build with Node.js and Express using typescript, typeorm, multer and migrations.
All the transactions is stored in a Postgres database.

## Running
- Install all the dependencies: `yarn`
- Run migrations: `yarn ts-node-dev .\node_modules \typeorm\cli.js migration:run`
- Run in dev mode: `yarn dev:server`
- Run tests: `yarn test`

## Routes

### Create transaction
The transaction is the type of income or outcome. If an outcome exceeds the total cash stored, an error message is returned.

HTTP Method: `post`

Route: `/transactions`

Request body:
```json
{
  "title": "Salary",
  "value": 3000,
  "type": "income",
  "category": "Financial"
}

or

{
  "title": "Computer",
  "value": 2000,
  "type": "outcome",
  "category": "Electronic"
}
```


### List all transactions
HTTP Method: `get`

Route: `/transactions`

Return:
```json
{
  "transactions": [
    {
      "id": "9ad39f00-0ca0-4f50-9e18-089014b2e024",
      "title": "Salary",
      "value": 3000,
      "type": "income",
      "category_id": "45a3cdbe-8330-4e91-8d17-058374a8a1eb",
      "created_at": "2020-07-03T06:06:41.166Z",
      "updated_at": "2020-07-03T06:06:41.166Z"
    },
    {
      "id": "0a896213-7a1e-4884-8509-b7cbda96d36f",
      "title": "Computer",
      "value": 2000,
      "type": "outcome",
      "category_id": "9a568879-d4d5-4bc0-8c5b-b69320897e87",
      "created_at": "2020-07-03T06:06:41.166Z",
      "updated_at": "2020-07-03T06:06:41.166Z"
    }
  ],
  "balance": {
    "income": 3000,
    "outcome": 2000,
    "total": 1000
  }
}
```

### Delete a transaction
HTTP Method: `delete`

Route: `/transactions/:id`

Return: No return

### Import transactions
HTTP Method: `post`

Route: `/transactions/import`

Request body: A file in a multipart form. That file must be a comma csv with header (title, value, type, category).

Return:
```json
{
  "transactions": [
    {
      "id": "9ad39f00-0ca0-4f50-9e18-089014b2e024",
      "title": "Salary",
      "value": 3000,
      "type": "income",
      "category_id": "45a3cdbe-8330-4e91-8d17-058374a8a1eb",
      "created_at": "2020-07-03T06:06:41.166Z",
      "updated_at": "2020-07-03T06:06:41.166Z"
    },
    {
      "id": "0a896213-7a1e-4884-8509-b7cbda96d36f",
      "title": "Computer",
      "value": 2000,
      "type": "outcome",
      "category_id": "9a568879-d4d5-4bc0-8c5b-b69320897e87",
      "created_at": "2020-07-03T06:06:41.166Z",
      "updated_at": "2020-07-03T06:06:41.166Z"
    }
  ]
}
```
