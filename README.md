# Project setup
- Clone the repository
```shell
git clone https://github.com/Sweety102003/JEE-Test-Platform.git 
```
- Go to JEE-Test-Platform directory
```shell
cd ./JEE-Test-Platform/
```

- Go to client directory
```shell
cd client
```
- Inside the client folder, create a .env file as follows
```.env
VITE_API_URL=http://localhost:5000
```

- Run the following in client directory
```shell
npm install
npm run dev
```

- Open a new terminal and go to server directory
  ```shell
  cd server
  ```
- Run the following command
```shell
npm install
```
- Create a .env file with the following variables inside server directory
```.env
PORT=5000
Mongo_url= "Your MONGO_DB url here"
JWT_SECRET= "JWT Secret here"
```
- Run the following command
```shell
node app.js
  ```