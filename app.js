const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');

const app=express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true});
const articleSchema = {
  title:String,
  content:String
};

const Article = mongoose.model('Article',articleSchema);

app.route("/articles")
.get(function(req, res){
  Article.find({}, function(err, article){
    //console.log(article);
    if(err){
      res.send(err);
    }else{
      res.send(article);
    }
  });
})
.post(function(req,res){
   // console.log(req.body.title);
   // console.log(req.body.content);
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if(err){
      res.send(err);
    }else{
      res.send("successfully saved");
    }
  });
})
.delete(function(req,res){
  Article.deleteMany({},function(err){
    if(err){
      res.send(err);
    }else{
      res.send("successfully delted!");
    }
  });
});

app.route("/articles/:articleTitle")
.get(function(req, res){
  Article.findOne({title: req.params.articleTitle},function(err,article){
    if(article){
      res.send(article);
    }else{
      res.send("No articles matching that title was found!");
    }
  });
})
.put(function(req, res){
    Article.update({title: req.params.articleTitle},{title: req.body.title, content: req.body.content},{overwrite: true}, function(err){
      if(err){
        res.send(err);
      }else{
        res.send("successfully updated!");
      }
    });
})
.patch(function(req, res){
  Article.update({title: req.params.articleTitle},{$set: req.body}, function(err){
    if(err){
      res.send(err);
    }else{
      res.send("Successfully updated!");
    }
  });
})
.delete(function(req,res){
  Article.deleteOne({title:req.params.articleTitle},function(err){
    if(err){
      res.send("Couldn't deleted!");
    }else{
      res.send("Successfully deleted!");
    }
  });
});
app.listen(3000, function(){
  console.log("server started on port 3000");
});
