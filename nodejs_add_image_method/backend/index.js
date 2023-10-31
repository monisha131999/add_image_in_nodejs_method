const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors')

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/myimg')
  .then(() => {
    console.log('DB connected successfully');
  })
  .catch(() => {
    console.error('Failed to connect MongoDB:');
  });

//Schema
  const fileSchema = new mongoose.Schema({
    filename: String
  });
  const File = mongoose.model('File', fileSchema);


///midle ware
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())

// get the router
app.get('/get',(req,res)=>{
  res.sendFile(path.join(__dirname, 'signup.html'));
  })
  
  
  
  //multer method
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
      const uniqueFilename = file.originalname.replace(/\.[^/.]+$/, '') + '_' + Date.now() + path.extname(file.originalname);
      cb(null, uniqueFilename);

      const newFile = new File({ filename: uniqueFilename });
      newFile.save()
        .then(() => {
          console.log('File saved to MongoDB');
        })
        .catch(err => {
          console.error('Error saving file to MongoDB:', err);
        });
    }
  });

  const maxSize = 1024 * 1000 * 1000;

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: maxSize
    },
    fileFilter: function (req, file, cb) {
      const filetypes = /jpeg|jpg|png|pdf|mp4/; // Entha file format mattum tha support aagum
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

      if (mimetype && extname) {
        return cb(null, true);
      }

      cb('Error: File upload only supports the following filetypes: ' + filetypes);
    }
  }).single('mypic');

  app.post('/upload', (req, res) => {
    upload(req, res, function (err) {
      if (err) {
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).send('File size is maximum 2mb');
        }

        res.status(400).send(err);
      } else {
        res.status(200).send('Success. Image Uploaded!');
      }
    });
  });
  app.listen(8080, () => {
    console.log('Server is running on port 8080');
  });


































































// const express = require('express');
// const app = express();
// const path = require('path');
// const multer = require('multer');
// // const { log } = require('console');

// app.set('views',path.join(__dirname, "views" ));
// // app.set('view engine',"ejs");

// var storage = multer.diskStorage({
//     destination : function(req, file, cb){

//         //some work
//         cb(null, 'uploads')
//     },
//     filename :function(req, file, cb){
//         cb(null, file.originalname.replace(/\.[^/.]+$/,"") + '_' + Date.now() + path.extname(file.originalname) )
//     }
// })
 
// let maxSize = 2 * 1000 * 1000

// let upload =    multer({
//         storage : storage,
//         limits : {
//             fileSize : maxSize 
//         },
//         fileFilter : function (req, file, cb){
//             console.log(file.mimetype);
//             let filetypes = /jpeg|jpg|png/;
//             let mimetype = filetypes.test(file.mimetype);
//             let extname = filetypes.test(path.extname(file.originalname).toLowerCase())
            
//             if(mimetype && extname){
//                 return cb(null, true);
//             }

//             cb("Error: File upload only supports the following filetypes: " +filetypes )

//         }
//     }).single('mypic');


// app.get('/',(req,res)=>{
//     res.render('signup')
// })

// app.post('/upload',(req, res, next)=>{
//     upload(req, res, function(err){
//         if(err) {
//             if(err instanceof multer.MulterError && err.code == "LIMIT_FILE_SIZE"){
//                return res.send("File size is maximum 2mb");
//             }

//             res.send(err);
//         }else{
//             res.send("Success. Image Uploaded!")
//         }
//     })
// })

// app.listen(8080, ()=>{
//     console.log(`Server is Running`)
// })





















