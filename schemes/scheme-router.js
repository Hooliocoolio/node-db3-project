const express = require('express');
const model = require('./scheme-model')
const db = require('../data/dbconfig');

const router = express.Router();

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// READ ALL SCHEMES
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
router.get('/',  (req, res) => {
    model.find()
    .then(schemes =>{
      res.json(schemes)
    })
    .catch(error => {
      res.status(500).json({ 
        Error: "Could not get all schemes. Please check Line 8"
      })
    })
})

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// READ SCHEME BY ID
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
router.get('/:id', (req, res) => {
  const { id } = req.params;

  model.findById(id)
  .then(scheme => {
    if (scheme) {
      res.json(scheme);
    } else {
      res.status(404).json({ 
        Error: "Could not find scheme with given id. Please check line 23" })
    }
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get schemes. Please check line 23' });
  });
});

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// READ STEPS BY SCHEME ID
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
router.get('/:id/steps', (req, res) => {
  const  {id}  = req.params;

   model.findSteps(id)
  .then(steps => {
    if (steps.length) {
      res.json(steps);
    } else {
      res.status(404).json({ 
        Error: "Could not find steps for given scheme id. Please check line 43" 
      })
    }
  })
  .catch(err => {
    res.status(500).json({ 
      Error: "Failed to get steps. Please check line 43" 
    });
  });
});

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// CREATE SCHEME
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
router.post('/', (req, res) => {
  const schemeData = req.body;

  model.add(schemeData)
  .then(scheme => {
    res.status(201).json({ 
      Success: "Scheme " + scheme + " was created successfully."
    });
  })
  .catch (err => {
    res.status(500).json({ 
      Error: "Failed to create new scheme. Please check line 66" 
    });
  });
});

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// CREATE STEPS FOR SCHEME
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
router.post('/:id/steps', (req, res) =>{
const { id } = req.params; 
const stepData = req.body;
model.findById(id)
.then(scheme => {
  if (scheme) {
    model.addStep(stepData, id)
    .then(steps => {
      res.status(201).json({ 
        Success: "Step was created successfully." 
      });
    })
  } else {
    res.status(404).json({ 
      Error: "Could not find scheme with given id. Please try another scheme id" 
    })
  }
})
.catch (error => {
  res.status(500).json({ 
    Error: "Failed to create new step. please check your code" 
  });
});
})

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// UPDATE SCHEME
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  model.findById(id)
  .then(scheme => {
    if (scheme) {
      model.update(changes, id)
      .then(updatedScheme => {
        res.json({ 
          Success: updatedScheme + " Scheme has been updated successfully." 
        });
      });
    } else {
      res.status(404).json({ 
        Error: "Could not find scheme with given id. please try another scheme id" 
      });
    }
  })
  .catch (err => {
    res.status(500).json({ 
      Error: "Failed to update scheme. please check your code" 
    });
  });
});

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// DELETE SCHEME
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  model.remove(id)
  .then(deleted => {
    if (deleted) {
      res.json({ 
        Deleted: deleted + " Scheme has been successfully deleted." 
    });
    } else {
      res.status(404).json({ 
        Error: 'Could not find scheme with given id. Please try another scheme id.' 
      });
    }
  })
  .catch(err => {
    res.status(500).json({ Error: 'Failed to delete scheme. Please check your code' });
  });
});

module.exports = router;