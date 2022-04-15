const express = require('express')
var app = express();
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var db;
/*****************************************
 *    CONNECTING MONGODB USING MONGOOSE  *
 *****************************************/
var connect = function (address, options) {
  mongoose.Promise = global.Promise;
  db = mongoose.connect('mongodb://localhost:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  return new Promise(function (resolve, reject) {
    mongoose.connection.once('open', function () {
      console.log("Database Connected : ", mongoose.connection.port);
      resolve();
    });
    mongoose.connection.on('error', function (err) {
      if (err) {
        throw new Error('Database Connection Error ', err);
        reject({err:'DB_CONN_ERR'});
      }
    }).catch(reject);
  });
};

app.get('/',function(req,res){
    res.send('WELCOME!')
})

app.listen(3001,function(){
    console.log('Listening Port::::',3001)
});
