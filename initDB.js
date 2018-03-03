var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/tstorydb";

//Init DB and collection - SKU_Master
mongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  var dbo = db.db("tstorydb");
  console.log("dbo created");
  dbo.createCollection("SKU_Master", function(err, res) {
    if (err) throw err
    console.log("Collection created!");
    db.close();
  });
});

//Insert dummy SKU(s) in SKU_Master
mongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("tstorydb");
  var objSample = {SKU : "TS10001", Description : "Dummy Product", Category: "Terrarium", AssetPath: "NA", IsActive: "Y", Price : "200", Currency : "INR"};
  dbo.collection("SKU_Master").insertOne(objSample, function(err, res) {
    if (err) throw err
    console.log("Object inserted!");
    db.close();
  });
});
