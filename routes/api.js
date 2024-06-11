

'use strict';

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      let title = req.body.title;
      const database = client.db('mydatabase');
    
     
     const booksCollection = database.collection('books');
      const newBook={_id: new ObjectId(), title: title}
      booksCollection.insertOne(newBook)
      res.send (newBook)

      //response will contain new book object including atleast _id and title
      const newBook = new Library({ title });

      if (!title) {
        return res.json('missing required field title');
      };

      newBook.save()
        .then(savedBook => {
          res.json(savedBook);
        })
        .catch(err => {
          console.error(err);
          res.json({ error: 'Internal server error' });
        });
    })

    .delete(function(req, res) {
      //if successful response will be 'complete delete successful'
      Library.deleteMany({}).exec()
        .then(() => {
          res.json('complete delete successful');
        })
        .catch(err => {
          console.error(err);
          res.json({ error: 'Internal server error' });
        });
    });



  app.route('/api/books/:id')
    .get(function(req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Library.findById(bookid)
        .then(book => {
          if (!book) {
            return res.json('no book exists');
          };
          res.json({
            _id: book._id,
            title: book.title,
            comments: book.comments || []
          });
        })
        .catch(err => {
          console.error(err);
          res.json({ error: 'Internal server error' });
        });
    })

    .post(function(req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      if (!comment || comment.trim() === '') {
        return res.json('missing required field comment');
      };

      if (!bookid){
        return res.json('missing required field bookid');
      };

      Library.findByIdAndUpdate(
        bookid,
        {
          $push: { comments: comment },
          $inc: { commentcount: 1 }
        },
        { new: true }
      )
        .then(book => {
          if (!book) {
            return res.json('no book exists');
          };
          res.json({
            _id: book._id,
            title: book.title,
            comments: book.comments || []
          });
        })
        .catch(err => {
          console.error(err);
          res.json({ error: 'Internal server error' });
        });
    })

    .delete(function(req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Library.findByIdAndRemove(bookid)
        .then(book => {
          if (!book) {
            return res.json('no book exists');
          };
          res.json('delete successful');
        })
        .catch(err => {
          console.error(err);
          res.json({ error: 'Internal server error' });
        });
    });

};