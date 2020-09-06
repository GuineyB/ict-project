"use strict";

const logger = require("../utils/logger");
const accounts = require("./accounts.js");
const uuid = require("uuid");
const memberStore = require("../models/member-store.js");
const trainerStore = require("../models/trainer-store.js");
const analytics = require("./analytics.js");


const trainerDashboard = {
  index(request, response) {
    logger.info("trainer dashboard rendering");
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const members = memberStore.getAllMembers();
    logger.debug(`logged in trainer ${loggedInTrainer.firstName}`);
    const viewData = {
      title: "Trainer Dashboard",
      trainer: loggedInTrainer,
      member: members
    };
    response.render("trainerDashboard", viewData);
  },

  trainerViewAssessments(request, response) {
    logger.info("view members assessments rendering");
    const memberid = request.params.memberid;
    const member = memberStore.getMemberById(memberid);
    const bmi = analytics.calculateBMI(member);
    const idealBodyWeight = analytics.idealBodyWeight(member);
    const viewData = {
      memberid: memberid,
      member: member,
      bmi: bmi,
      bmiCategory: analytics.BMICategory(bmi),
      idealBodyWeight: idealBodyWeight
    };
    logger.debug(`view ${member.firstName} ${member.lastName}'s assessments`);
    response.render("trainerViewAssessments", viewData);
  },

  removeAssessment(request, response) {
    logger.info("remove assessment rendering");
    const memberid = request.params.memberid;
    const assessmentid = request.params.assessmentid;
    logger.debug(
      `removing ${memberStore.firstName}'s assessment by id: ${assessmentid}`
    );
    memberStore.removeAssessment(memberid, assessmentid);
    response.redirect("/trainerDashboard");
  },

  removeMember(request, response) {
    logger.info("removing member rendering");
    const memberid = request.params.memberid;
    logger.debug(`removing ${memberStore.firstName} by member id: ${memberid}`);
    memberStore.removeMember(memberid);
    response.redirect("/trainerDashboard");
  },

  updateComment(request, response) {
    logger.info("update comment rendering");
    const memberid = request.params.memberid;
    const assessmentid = request.params.assessmentid;
    const comment = request.body.comment;
    const assessment = memberStore.getAssessmentById(memberid, assessmentid);
    assessment.comment = comment;
    logger.debug(`saving updated comment for memberid: ${memberid}`);
    memberStore.store.save();
    response.redirect("/trainerDashboard");
  },

  trainerGoals(request, response) {
    logger.info("members goals rendering");
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const members = memberStore.getAllMembers();
    const goals = loggedInTrainer.goals;
    const viewData = {
      trainer: loggedInTrainer,
      members: members,
      goals: goals
    };
    logger.debug(`create goals menu rendered for ${loggedInTrainer.lastName}`);
    response.render("trainerGoals", viewData);
  },

  trainerAddGoal(request, response) {
    logger.info("trainer add goals rendering");
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const trainerid = loggedInTrainer.trainerid;
    const memberid = request.body.memberid;
    const member = memberStore.getMemberById(memberid);
    const date = new Date(request.body.date);
    const newGoal = {
      goalid: uuid(),
      memberid: memberid,
      trainerid: trainerid,
      memberfirstname: member.firstName,
      memberlastname: member.lastName,
      trainerlastname: loggedInTrainer.lastName,
      date: date.toDateString(),
      area: request.body.area,
      goal: Number(request.body.goal),
      description: request.body.description,
      status: "open"
    };

    const goals = memberStore.getAllMemberGoals(memberid);
    let noGoals = true;
    for (let i = 0; i < goals.length; i++) {
      if (newGoal.time === goals[i].time && newGoal.date === goals[i].date) {
        noGoals = false;
        break;
      }
    }

    if (noGoals) {
      logger.debug(
        `adding new goals for trainer ${loggedInTrainer.lastName} to the store`
      );
      memberStore.addGoal(memberid, newGoal);
      trainerStore.addGoal(trainerid, newGoal);
      response.redirect("/trainerDashboard/trainerGoals");
    } else {
      logger.debug(
        `goal already made for ${member.firstName} ${member.lastName}`
      );
      response.redirect("/trainerDashboard/trainerGoals");
    }
  },

  removeGoal(request, response) {
    logger.info("removing goal rendering");
    const goalid = request.params.goalid;
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    logger.debug(`removing goalid: ${goalid} from ${loggedInTrainer.lastName}`);
    trainerStore.removeGoal(loggedInTrainer.trainerid, goalid);
    response.redirect("/trainerDashboard/trainerGoals");
  },

  trainerUpdateGoal(request, response) {
    logger.info("update booking rendering ");
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const goalid = request.params.goalid;
    const goalToUpdate = trainerStore.getGoalById(
      loggedInTrainer.trainerid,
      goalid
    );
    const members = memberStore.getAllMembers();
    const viewData = {
      goalToUpdate: goalToUpdate,
      members: members
    };
    logger.debug(`updating goalid: ${goalid} page rendered`);
    response.render("trainerUpdateGoal", viewData);
  }
};

module.exports = trainerDashboard;
