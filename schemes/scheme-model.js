const db = require("../data/dbconfig");

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
  update,
  remove
};

function find() {
  return db("schemes");
}

function findAllSteps() {
    return db("steps");
  }

function findById(id) {
  return (
    db("schemes")
      // .first()
      .where("id", id) /*? same as {id}*/
      .then(scheme => (!scheme.length ? null : scheme))
  );
}

function findSteps(id) {
  return db("steps as st")
    .select("scheme_name", "step_number", "instructions")
    .join("schemes as s", "scheme_id", "s.id")
    .where("s.id", id)
    .orderBy("step_number");
}
//* select `scheme_name`, `step_number`, `instructions,` from `steps` as `st` inner join `schemes` as `s` on `scheme_id` = `s`.`id` where `s`.`id` = 4 order by `step_number` asc

function add(scheme) {
  return db("schemes").insert(scheme);
}
//? README  Resolves to the newly inserted scheme, including `id`.

function update(changes, id) {
  return db("schemes")
    .update(changes)
    .where({ id });
}

function remove(id) {
  return db("schemes")
    .where("id", id)
    .del()
    .then(response => (!response ? null : response));
}

function addStep(stepData, id) {
  return db("steps")
  .insert(stepData)
  .where({ id })
 
  }