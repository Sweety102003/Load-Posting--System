# Project setup
- Clone the repository
```shell
 git clone https://github.com/Sweety102003/Load-Posting--System.git
```
- Go to Load posting syystem directory
```shell
cd ./Load-Posting--System/
```


- Run the following command
```shell
npm install
```
- Create a .env.local file with the following variables inside load posting system directory
```.env.local
PORT=5000
Mongo_url= "Your MONGO_DB url here"
Jwt_secret= "JWT Secret here"
Email_user="your email here"
Email_pass="your email passkey here
```
- Run the following command
```shell
npm run dev
  ```