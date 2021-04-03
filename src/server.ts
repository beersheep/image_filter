import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredImage", async(req, res) => {
    const image_url = req.query.image_url;
    if (!image_url) {
      res.status(422).send('image_url is required');
    }

    await filterImageFromURL(image_url).then(filteredImagePath => {
      res.sendFile(filteredImagePath, () => {
        deleteLocalFiles([filteredImagePath])
      });
    }).catch (err => {
      return res.status(400).send(JSON.stringify(err));
    })
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
