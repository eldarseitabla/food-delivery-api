const fs = require('fs');
const path = require('path');

exports.up = function (db) {
  const filePath = path.join(__dirname, 'sqls', '20200625183740-init-up.sql');
  return new Promise( function ( resolve, reject ) {
    fs.readFile(filePath, { encoding: 'utf-8' }, function (err,data) {
      if (err) return reject(err);
      console.log('received data: ' + data);

      resolve(data);
    });
  })
    .then(function (data) {
      return db.runSql(data);
    });
};

exports.down = function (db) {
  const filePath = path.join(__dirname, 'sqls', '20200625183740-init-down.sql');
  return new Promise( function ( resolve, reject ) {
    fs.readFile(filePath, { encoding: 'utf-8' }, function (err,data) {
      if (err) return reject(err);
      console.log('received data: ' + data);

      resolve(data);
    });
  })
    .then(function (data) {
      return db.runSql(data);
    });
};
