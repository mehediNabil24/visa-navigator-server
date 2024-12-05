const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()

const port = process.env.PORT || 5000;

//middleware

app.use(express.json())
app.use(cors())

// visa-navigator
// Kza7ellakonXxYzH



const uri = "mongodb+srv://visa-navigator:Kza7ellakonXxYzH@cluster0.yitxt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const visaCollection = client.db('visaDB').collection('visa')
    const userCollection =client.db('visaDB').collection('users')
   
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
    app.get('/',(req,res)=>{
        res.send('server is running')
    })

    app.get('/visa', async(req,res)=>{

        const cursor = visaCollection.find();
        const result = await cursor.toArray();
        res.send(result)

    })

    app.get('/visa/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await visaCollection.findOne(query)
        res.send(result);
    })

    app.post('/visa', async(req,res)=>{
        const newVisa = req.body;
        console.log(newVisa)
        const result = await visaCollection.insertOne(newVisa)
        res.send(result)
    })


     // user related api
     app.get('/users', async(req,res)=>{
        const cursor = userCollection.find();
        const result = await cursor.toArray();
        res.send(result)
      })

      app.get('/user-visa-details', async (req, res) => {
        try {
          const pipeline = [
            {
              $lookup: {
                from: 'visa',
                localField: 'fee',  // Assuming the 'fee' is a way to match users with visa records
                foreignField: 'fee', // Adjust according to your actual matching field
                as: 'visaDetails',
              }
            },
            {
              $unwind: '$visaDetails'
            },
            {
              $project: {
                _id: 1,
                email: 1,
                firstName: 1,
                lastName: 1,
                appliedDate: 1,
                fee: 1,
                visaDetails: {
                  countryName: 1,
                  visaType: 1,
                  processingTime: 1,
                  requiredDocuments: 1,
                  description: 1,
                  ageRestriction: 1,
                  validity: 1,
                  applicationMethod: 1,
                  image: 1
                }
              }
            }
          ];
      
          const result = await userCollection.aggregate(pipeline).toArray();
          res.send(result);
        } catch (error) {
          console.log(error);
          res.status(500).send({ error: 'Failed to retrieve data' });
        }
      });
      
  
      app.post('/users', async(req,res)=>{
        const newUser = req.body;
        console.log('creating new user', newUser)
  
        const result = await userCollection.insertOne(newUser)
  
        res.send(result)

        
  
      })

    app.listen(port,()=>{
        console.log(`server is running on port:${port}`)
    })



  } 
  catch(error){
    console.log(error)
  }
}
run();
