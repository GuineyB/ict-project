"use strict";

const _ = require("lodash");
const JsonStore = require("./json-store");

const memberStore = {
  store: new JsonStore("./models/member-store.json", { members: [] }),
  collection: "members",

  getAllMembers() {
    return this.store.findAll(this.collection);
  },

  addMember(member) {
    this.store.add(this.collection, member);
    this.store.save();
  },

  getMemberById(memberid) {
    return this.store.findOneBy(this.collection, { memberid: memberid });
  },

  removeMember(memberid) {
    const member = this.getMemberById(memberid);
    this.store.remove(this.collection, member);
    this.store.save();
  },

  getMemberByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },

  addAssessment(memberid, assessment) {
    const member = this.getMemberById(memberid);
    member.assessments.unshift(assessment);
    this.store.save();
  },

  getAssessmentById(memberid, assessmentid) {
    const member = this.getMemberById(memberid);
    for (let i = 0; i < member.assessments.length; i++) {
      if (member.assessments[i].assessmentid === assessmentid) {
        return member.assessments[i];
      }
    }
  },

  removeAssessment(memberid, assessmentid) {
    const member = this.getMemberById(memberid);
    _.remove(member.assessments, { assessmentid: assessmentid });
    this.store.save();
  },

  addGoal(memberid, goal) {
    const member = this.getMemberById(memberid);
    member.goals.push(goal);
    this.store.save();
  },

  removeGoal(memberid, goalid) {
    const member = this.getMemberById(memberid);
    _.remove(member.goals, { goalid: goalid });
    this.store.save();
  },

  getAllMemberGoals(memberid) {
    const member = this.getMemberById(memberid);
    return member.goals;
  }

};

module.exports = memberStore;
