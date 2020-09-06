"use strict";

const logger = require("../utils/logger");
const uuid = require("uuid");
const memberStore = require("../models/member-store.js");
const trainerStore = require("../models/trainer-store.js");
const analytics = require("./analytics.js");

const accounts = {
  index(request, response) {
    const viewData = {
      title: "Login or Signup"
    };
    response.render("index", viewData);
  },

  login(request, response) {
    const viewData = {
      title: "Login to Homers Gym"
    };
    response.render("login", viewData);
  },

  logout(request, response) {
    response.cookie("member", "");
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Signup to Homers Gym"
    };
    response.render("signup", viewData);
  },

  register(request, response) {
    const member = request.body;
    member.id = uuid.v1();
    memberStore.addMember(member);
    logger.info(`registering ${member.email}`);
    response.redirect("/");
  },

  authenticate(request, response) {
    const member = memberStore.getMemberByEmail(request.body.email);
    const trainer = trainerStore.getTrainerByEmail(request.body.email);
    if (member && member.password === request.body.password) {
      response.cookie("member", member.memberid);
      logger.debug(`logging in ${member.email}`);
      response.redirect("/dashboard");
    } else if (trainer && trainer.password === request.body.password) {
      response.cookie("trainer", trainer.trainerid);
      logger.debug(`logging in ${trainer.email}`);
      response.redirect("/trainerDashboard");
    } else {
      logger.debug(`authentication failed`);
      response.redirect("/login");
    }
  },

  getCurrentMember(request) {
    const memberid = request.cookies.member;
    return memberStore.getMemberById(memberid);
  },

  getCurrentTrainer(request) {
    const trainerid = request.cookies.trainer;
    return trainerStore.getTrainerById(trainerid);
  }
};

module.exports = accounts;
