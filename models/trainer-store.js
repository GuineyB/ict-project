"use strict";

const _ = require("lodash");
const JsonStore = require("./json-store");

const trainerStore = {
  store: new JsonStore("./models/trainer-store.json", { trainers: [] }),
  collection: "trainers",

  getAllTrainers() {
    return this.store.findAll(this.collection);
  },

  getTrainerById(trainerid) {
    return this.store.findOneBy(this.collection, { trainerid: trainerid });
  },

  getTrainerByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },

  addTrainer(trainer) {
    this.store.add(this.collection, trainer);
    this.store.save();
  },

  addGoal(trainerid, goal) {
    const trainer = this.getTrainerById(trainerid);
    trainer.goals.push(goal);
    this.store.save();
  },

  getGoalById(trainerid, goalid) {
    const trainer = this.getTrainerById(trainerid);
    for (let i = 0; i < trainer.goals.length; i++) {
      if (trainer.goals[i].goalid === goalid) {
        return trainer.goals[i];
      }
    }
  },

  getAllTrainerGoals(trainerid) {
    const trainer = this.getTrainerById(trainerid);
    return trainer.goals;
  },

  removeGoal(trainerid, goalid) {
    const trainer = this.getTrainerById(trainerid);
    _.remove(trainer.goals, { goalid: goalid });
    this.store.save();
  }
};

module.exports = trainerStore;
