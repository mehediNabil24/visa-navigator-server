const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

const port = process.env.PORT || 5000;

//middleware

app.use(express.json());
app.use(cors());

// visa-navigator
// Kza7ellakonXxYzH

const uri =
  "mongodb+srv://visa-navigator:Kza7ellakonXxYzH@cluster0.yitxt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const visaCollection = client.db("visaDB").collection("visa");
    const userCollection = client.db("visaDB").collection("users");

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    app.get("/", (req, res) => {
      res.send("server is running");
    });

    app.get("/visa", async (req, res) => {
      const cursor = visaCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/visa/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await visaCollection.findOne(query);
      res.send(result);
    });
    app.get("/visa/:countryName", async (req, res) => {
      // const createdBy =req.params.createdBy;
      const countryName = req.params.countryName;
      const cursor = { countryName: countryName };
      const result = await visaCollection.findOne(cursor);
      res.send(result);
    });
    app.get("/visa/email/:createdBy", async (req, res) => {
      const createdBy = req.params.createdBy;
      const query = { createdBy: createdBy };
      const result = await visaCollection.find(query).toArray();
      res.send(result);
    });

    app.put("/visa/email/:createdBy", async (req, res) => {
      const createdBy = req.params.createdBy;
      const filter = { createdBy: createdBy };
      const updatedVisa = req.body;
      const options = { upsert: true };
      const updateVisa = {
        $set: {
          image :updatedVisa.name,
          countryName: updatedVisa.countryName,
          visaType: updatedVisa.visaType,
          processingTime: updatedVisa.processingTime,
          requiredDocuments: updatedVisa.requiredDocuments,
          description: updatedVisa.description,
          ageRestriction: updatedVisa.ageRestriction,
          fee: updatedVisa.fee,
          validity: updatedVisa.validity,
          applicationMethod: updatedVisa.applicationMethod
        },
      };
      const result =await visaCollection.updateOne(filter,updateVisa,options)
      res.send(result);
    });

    // app.put("/visa/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: new ObjectId(id) };
    //   const updatedVisa = req.body;
    //   const options = { upsert: true };
    //   const updateVisa = {
    //     $set: {
    //       image :updatedVisa.name,
    //       countryName: updatedVisa.countryName,
    //       visaType: updatedVisa.visaType,
    //       processingTime: updatedVisa.processingTime,
    //       requiredDocuments: updatedVisa.requiredDocuments,
    //       description: updatedVisa.description,
    //       ageRestriction: updatedVisa.ageRestriction,
    //       fee: updatedVisa.fee,
    //       validity: updatedVisa.validity,
    //       applicationMethod: updatedVisa.applicationMethod
    //     },
    //   };
    //   const result =await visaCollection.updateOne(filter,updateVisa,options)
    //   res.send(result);
    // });

    app.post("/visa", async (req, res) => {
      const newVisa = req.body;
      console.log(newVisa);
      const result = await visaCollection.insertOne(newVisa);
      res.send(result);
    });

  
    app.delete("/visa/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await visaCollection.deleteOne(query);
      res.send(result);
    });

    // user related api
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      console.log("creating new user", newUser);

      const result = await userCollection.insertOne(newUser);

      res.send(result);
    });

    app.listen(port, () => {
      console.log(`server is running on port:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
run();
