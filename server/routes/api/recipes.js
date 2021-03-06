const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

// Get Recipes
router.get('/', async (req, res) => {
    const recipes = await loadRecipesCollection();
    res.send(await recipes.find({}).toArray());
});

// Get Single Recipe
router.get('/:id', async (req, res) => {
  const recipes = await loadRecipesCollection();
  await recipes.findOne({_id: new mongodb.ObjectId( req.params.id )})
  res.send(await recipes.find({}).limit(1).toArray())
});

// Add Recipe
router.post('/', async (req, res) => {
    const recipes = await loadRecipesCollection();
    await recipes.insertOne({
      title: req.body.title,
      ingredients: req.body.ingredients,
      directions: req.body.directions,
      servings: req.body.servings,
      prepTime: req.body.prepTime,
      cookTime: req.body.cookTime,
      totalTime: req.body.totalTime,
      createdAt: new Date(),
      updatedAt: null
    });
    res.status(201).send();
});

// Update Recipe
router.put('/:id', async (req, res) => {
  const recipes = await loadRecipesCollection();
  await recipes.updateOne(
    {
      _id: new mongodb.ObjectId(req.params.id)
    }, 
    {
      $set: 
        {
          title: req.body.title, 
          ingredients: req.body.ingredients, 
          directions: req.body.directions, 
          servings: req.body.servings, 
          prepTime: req.body.prepTime, 
          cookTime: req.body.prepTime, 
          cookTime: req.body.cookTime, 
          totalTime: req.body.totalTime, 
          updatedAt: new Date()
        }
      }, 
      {
        upsert: true
      });
  res.status(200).send();
});


// Delete Recipe
router.delete('/:id', async (req, res) => {
    const recipes = await loadRecipesCollection();
    await recipes.deleteOne({_id: new mongodb.ObjectId(req.params.id)});
    res.status(200).send();
});

// This loads database
async function loadRecipesCollection() {
    const client = await mongodb.MongoClient.connect('mongodb+srv://carlton123:pa$$w0rd123@reciperkeepercluster-m5vd0.mongodb.net/test?retryWrites=true&w=majority', {
        useNewUrlParser: true
    });

    return client.db('reciperkeepercluster').collection('recipes');
}

module.exports = router;