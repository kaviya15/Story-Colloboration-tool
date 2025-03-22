## Story Colloboration tool

### file structure

/app
├── config/
│   ├── db.conf.js
├── database/
│   ├── Redis.database.js
│   ├── Mongo.database.js
├── routes/
│   ├── App.routes.js
│   ├── Auth.routes.js
│   ├── Dashboard.routes.js
├── utils/
│   ├── Logger.util.js
├── middleware/
│   ├── App.middleware.js
│   ├── ErrorHandler.middleware.js
│   ├── init.js
├── models/
│   ├── User.model.js
├── controllers/
│   ├── App.controller.js
│   ├── User.controller.js
├── helpers/
│   ├── App.helper.js
/public
├── dist/
├── images/
│   ├── dashboard/
│   ├── auth/
│   ├── documentation/      
├── sitemap.xml
/src
├── javascript/
├── css/
/node_modules
/server.js
/package.json
/.env