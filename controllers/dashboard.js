"use strict";

const logger = require("../utils/logger.js");
const accounts = require("./accounts.js");
const uuid = require("uuid");
const memberStore = require("../models/member-store.js");
const trainerStore = require("../models/trainer-store.js");
const analytics = require("./analytics.js");

const dashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedInMember = accounts.getCurrentMember(request);
    const bmi = analytics.calculateBMI(loggedInMember);
    const idealBodyWeight = analytics.idealBodyWeight(loggedInMember);
     const goals = loggedInMember.goals;
      let goalAlert = true;
      let assessmentAlert = false;
    logger.info(`checking the status of your goals ${loggedInMember.firstName}`);

    for (let i = 0; i < goals.length; i++) {
      if (
        goals[i].status === "open" ||
        goals[i].status === "processing result"
      ) {
        goalAlert = false;
        const timeLeft = new Date(goals[i].date) - new Date();
        const daysDue = Math.ceil(timeLeft / (1000 * 3600 * 24));
        if (daysDue <= 0) {
          const area = goals[i].area;
          const goal = goals[i].goal;

          if (loggedInMember.assessments.length > 0) {
            const recentAssessment = loggedInMember.assessments[0];
            const assessmentCheck =
              new Date(recentAssessment.date) - new Date();
            const daysSinceLastAssessment =
              assessmentCheck / (1000 * 3600 * 24);

            if (daysSinceLastAssessment <= 0 && daysSinceLastAssessment >= -3) {
              if (area === "weight") {
                if (goal <= recentAssessment.weight) {
                  goals[i].status = "achieved";
                } else {
                  goals[i].status = "missed";
                }
              } else if (area === "chest") {
                if (goal <= recentAssessment.chest) {
                  goals[i].status = "achieved";
                } else {
                  goals[i].status = "missed";
                }
              } else if (area === "thigh") {
                if (goal <= recentAssessment.thigh) {
                  goals[i].status = "achieved";
                } else {
                  goals[i].status = "missed";
                }
              } else if (area === "upperArm") {
                if (goal <= recentAssessment.upperArm) {
                  goals[i].status = "achieved";
                } else {
                  goals[i].status = "missed";
                }
              } else if (area === "waist") {
                if (goal <= recentAssessment.waist) {
                  goals[i].status = "achieved";
                } else {
                  goals[i].status = "missed";
                }
              } else if (area === "hips") {
                if (goal <= recentAssessment.hips) {
                  goals[i].status = "achieved";
                } else {
                  goals[i].status = "missed";
                }
              }
            } else {
              goals[i].status = "processing result";
              assessmentAlert = true;
            }
          } else {
            goals[i].status = "processing result";
            assessmentAlert = true;
          }
        }
      }
    }
    const viewData = {
      title: "member dashboard",
      member: loggedInMember,
      bmi: bmi,
      bmiCategory: analytics.BMICategory(bmi),
      idealBodyWeight: idealBodyWeight,
      goals: goals,
      goalAlert: goalAlert,
      assessmentAlert: assessmentAlert
    };
    logger.debug(
      `${loggedInMember.firstName} ${loggedInMember.lastName}'s main menu page`
    );
    response.render("dashboard", viewData);
  },

/*
const dashboard = {
  index(request, response) {
    logger.info("dashboard rendering");
    const loggedInMember = accounts.getCurrentMember(request);
    const bmi = analytics.calculateBMI(loggedInMember);
    const idealBodyWeight = analytics.idealBodyWeight(loggedInMember);
    const viewData = {
      title: "member dashboard",
      member: loggedInMember,
      bmi: bmi,
      bmiCategory: analytics.calculateBMI(bmi),
      idealBodyWeight: idealBodyWeight
//     goals: goals,
//     goalAlert: goalAlert,
//     assessmentAlert: assessmentAlert
    };
    logger.info("about to render", memberStore.getAllMembers());
    response.render("dashboard", viewData);
  },

*/

  memberAddAssessment(request, response) {
    logger.info("adding assessment rendering");
    const loggedInMember = accounts.getCurrentMember(request);
    const memberid = loggedInMember.memberid;
    const newAssessment = {
      assessmentid: uuid.v1(),
      date: new Date().toDateString(),
      weight: Number(request.body.weight),
      chest: Number(request.body.chest),
      thigh: Number(request.body.thigh),
      upperArm: Number(request.body.upperArm),
      waist: Number(request.body.waist),
      hips: Number(request.body.hips),
      trend: "",
      comment: ""
    };
    memberStore.addAssessment(memberid, newAssessment);
    analytics.trend(loggedInMember);
    logger.debug(
      `added assessment for ${loggedInMember.firstName}`,
      newAssessment
    );
    response.redirect("/dashboard");
  },

  removeAssessment(request, response) {
    logger.info("removing assessment rendering");
    const assessmentid = request.params.assessmentid;
    const loggedInMember = accounts.getCurrentMember(request);
    logger.debug(
      `removing assessmentid: ${assessmentid} from ${loggedInMember.firstName}`
    );
    memberStore.removeAssessment(loggedInMember.memberid, assessmentid);
    response.redirect("/dashboard");
  },

  settings(request, response) {
    logger.info("settings rendering");
    const loggedInMember = accounts.getCurrentMember(request);
    const viewData = {
      member: loggedInMember
    };
    logger.debug(
      `update settings menu rendered for ${loggedInMember.firstName}`
    );
    response.render("settings", viewData);
  },

  updateFirstName(request, response) {
    logger.info("updating first name rendering");
    const loggedInMember = accounts.getCurrentMember(request);
    loggedInMember.firstName = request.body.firstName;
    logger.debug(`saving ${loggedInMember.firstName}'s first name`);
    memberStore.store.save();
    response.redirect("/dashboard");
  },

  updateLastName(request, response) {
    logger.info("updating last name rendering");
    const loggedInMember = accounts.getCurrentMember(request);
    loggedInMember.lastName = request.body.lastName;
    logger.debug(`saving ${loggedInMember.firstName}'s last name`);
    memberStore.store.save();
    response.redirect("/dashboard");
  },

  updateEmail(request, response) {
    logger.info("updating email rendering");
    const loggedInMember = accounts.getCurrentMember(request);
    loggedInMember.email = request.body.email;
    logger.debug(
      `saving ${loggedInMember.firstName}'s email address: ${loggedInMember.email}`
    );
    memberStore.store.save();
    response.redirect("/dashboard");
  },

  updatePassword(request, response) {
    logger.info("updating password rendering");
    const loggedInMember = accounts.getCurrentMember(request);
    loggedInMember.password = request.body.password;
    logger.debug(`saving ${loggedInMember.firstName}'s password, ssssshhhhh`);
    memberStore.store.save();
    response.redirect("/dashboard");
  },

  updateAddress(request, response) {
    logger.info("updating address rendering");
    const loggedInMember = accounts.getCurrentMember(request);
    loggedInMember.address = request.body.address;
    logger.debug(`saving ${loggedInMember.firstName}'s home address`);
    memberStore.store.save();
    response.redirect("/dashboard");
  },

  updateHeight(request, response) {
    logger.info("updating height rendering");
    const loggedInMember = accounts.getCurrentMember(request);
    loggedInMember.height = Number(request.body.height);
    logger.debug(`saving ${loggedInMember.firstName}'s height`);
    memberStore.store.save();
    response.redirect("/dashboard");
  },


  memberGoals(request, response) {
    logger.info("members get goals rendering");
    const loggedInMember = accounts.getCurrentMember(request);
    const trainers = trainerStore.getAllTrainers();
    const goals = loggedInMember.goals;
    const viewData = {
      member: loggedInMember,
      trainers: trainers,
      goals: goals
    };
    logger.debug(`create goals menu rendered for ${loggedInMember.firstName}`);
    response.render("memberGoals", viewData);
  },

  memberAddGoal(request, response) {
    logger.info("adding goals rendering");
    const loggedInMember = accounts.getCurrentMember(request);
    const memberid = loggedInMember.memberid;
    const date = new Date(request.body.date);
    const newGoal = {
      goalid: uuid.v1(),
      date: date.toDateString(),
      area: request.body.area,
      goal: request.body.goal,
      description: request.body.description,
      status: "open"
    };

    const goals = memberStore.getAllMemberGoals(memberid);
    let notSet = true;
    for (let i = 0; i < goals.length; i++) {
      if (newGoal.area === goals[i].area) {
        notSet = false;
        break;
      }
    }

    if (notSet) {
      logger.debug(
        `adding new goal for ${loggedInMember.firstName} to the store`,
        newGoal
      );
      memberStore.addGoal(memberid, newGoal);
      response.redirect("/dashboard/memberGoals");
    } else {
      logger.debug(`goal already set by ${loggedInMember.firstName}`);
      response.redirect("/dashboard/memberGoals");
    }
  },

  removeGoal(request, response) {
    logger.info("removing goal rendering");
    const goalid = request.params.goalid;
    const loggedInMember = accounts.getCurrentMember(request);
    logger.debug(`removing goalid: ${goalid} from ${loggedInMember.firstName}`);
    memberStore.removeGoal(loggedInMember.memberid, goalid);
    response.redirect("/dashboard/memberGoals");
  }
};

module.exports = dashboard;
