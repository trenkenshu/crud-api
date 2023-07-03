# crud-api

## Install and run
1. Run `git clone https://github.com/trenkenshu/crud-api.git`
1. Create .env file in the root of repo with 'PORT=3000 (or another value of your choise)'
2. Run `npm install`
3. Run script `npm run start:dev`

## API
1. GET http://localhost:3000/api/users - Get All users
2. GET http://localhost:3000/api/users/:id - Get specific user with id = :id
2. POST http://localhost:3000/api/users - Create user with JSON request. Example:
```
{
    "username": "Oleg",
    "age": 37,
    "hobbies": [
        "eat"
    ]
}
```
3. PUT http://localhost:3000/api/users/:id - Edit user with id = :id using JSON request
4. DELETE http://localhost:3000/api/users/:id - Delete user with id = :id
## Other 
- You can compile production but not in separate folder
- You can run test (6 cases): `npm run test`


