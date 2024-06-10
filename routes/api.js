/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const { MongoClient, ObjectId } = require('mongodb');



// Create a new MongoClient
const client = new MongoClient(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to the MongoDB server
async function main() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log('Connected to the MongoDB server');

    // You can now interact with the database using the client object
    const database = client.db('mydatabase');
    
    // For example, you can access collections like this:
    const usersCollection = database.collection('users');

    // Perform database operations...

  } catch (error) {
    console.error('Error connecting to the MongoDB server', error);
  } finally {
    // Close the connection when you're done
    await client.close();
    console.log('Connection closed');
  }
}



module.exports = async function (app) {

  try{
    await client.connect();
    console.log('Connected to the MongoDB server');
  } catch (error) {
    console.error('Error connecting to the MongoDB server', error);
  } finally {
    // Close the connection when you're done
    await client.close();
    console.log('Connection closed');
  }
  
  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments
      
     // You can now interact with the database using the client object
     const database = client.db('mydatabase');
    
     // For example, you can access collections like this:
     const booksCollection = database.collection('books');

   

      res.send (await booksCollection.find().toArray())
    })
    
    .post(function (req, res){
      let title = req.body.title;
      const database = client.db('mydatabase');
    
     
     const booksCollection = database.collection('books');
      const newBook={_id: new ObjectId(), title: title}
      booksCollection.insertOne(newBook)
      res.send (newBook)

      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
