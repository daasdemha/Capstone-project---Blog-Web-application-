import express from 'express';
import expressFileUpload from 'express-fileupload';
import path from 'path';

const app = express();
const port = 3000;

let posts = [];  // In-memory posts array

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(expressFileUpload());

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Home route: display all posts
app.get('/', (req, res) => {
  res.render('index', { posts });
});

// Route for adding a new post (image + description)
app.post('/add', (req, res) => {
  const { description } = req.body;
  const image = req.files?.image;

  if (image) {
    // Convert image to base64
    const imageBase64 = image.data.toString('base64');

    // Add new post
    const newPost = {
      id: posts.length + 1,
      image: imageBase64,
      description
    };

    posts.push(newPost);
  }

  res.redirect('/');
});

// Route to edit a post's description or image
app.get('/edit/:id', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = posts.find(p => p.id === postId);
  res.render('edit', { post });
});

// Handle editing a post
app.post('/edit/:id', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = posts.find(p => p.id === postId);

  // Update description
  post.description = req.body.description;

  // If a new image is uploaded, update it
  if (req.files?.image) {
    post.image = req.files.image.data.toString('base64');
  }

  res.redirect('/');
});

// Route to delete a post
app.post('/delete/:id', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  posts = posts.filter(p => p.id !== postId);
  res.redirect('/');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
