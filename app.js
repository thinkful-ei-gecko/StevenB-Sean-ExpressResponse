'use strict';

const express = require('express');
const app = express();
const morgan = require('morgan');
const playstore = require('./playstore');

app.use(morgan('dev'));

app.get('/apps', (req, res) => {
  let sort = req.query.sort;
  let genre = req.query.genres;
  let genreUppercase;
  let newSort;

  let results = playstore;

  let genres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card', 'Adventure'];
  let genreMatch = false;

  if ( genre ) {
    genreUppercase = genre.charAt(0).toUpperCase() + genre.slice(1);
  }
  
  if ( sort ) {
    newSort = sort.charAt(0).toUpperCase() + sort.slice(1);
  }
  
  if ( sort ) {
    if (( newSort !== 'Rating') && (newSort !== 'App')) {
      return res
        .status(400)
        .send(`Sort method must be either rating or app : ${sort} typeOf: ${typeof(sort)}`)
        .end();
    }
    else if ( genre ) {
      for (let i=0; i< genres.length; i++){
        if (genres[i] === genreUppercase){
          genreMatch = true;
        }
      }
      if(!genreMatch) {
        return res
          .status(400)
          .send(`Genre not found ${genre}`)
          .end();
      }
      if (genreMatch) {
    
        let filtered = results.filter(results =>
          results.Genres.includes(genreUppercase)
        );
        
        const sortMethod = () => {
          let newArray = filtered.sort((a, b) => {
            return ((a[newSort])) > ((b[newSort])) ? -1  : ((a[newSort])) < ((b[newSort])) ? 1 : 0;
          });
          return newArray;
        }; 

        let temp = sortMethod();

        return res
          .status(201)
          .send(temp) 
          .end();
      } 

    }
    else {
      const sortMethod = () => {
        let newArray = results.sort((a, b) => {
          return ((a[newSort])) > ((b[newSort])) ? -1  : ((a[newSort])) < ((b[newSort])) ? 1 : 0;
        });
        return newArray;
      }; 
       
      let temp = sortMethod();

      return res
        .status(201)
        .send(temp) 
        .end();
    }
  }


  else if ( genre ) {
    let filtered = [];
    for (let i = 0; i < genres.length ; i++) {
      if (genres[i]=== genreUppercase) {
        genreMatch = true;
      }
    }
    if (genreMatch) {
      //let temp = playstore;
      filtered = results.filter(results => 
        results.Genres.includes(genreUppercase) 
      );
      return res
        .status(201)
        .send(filtered)
        .end();
    }
  }
  else 
    return res
    .status(500)
    .send(`Error Message Here`)
    .end();
});

app.listen(49443, () => console.log('Server on 49443'));