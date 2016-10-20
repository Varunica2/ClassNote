
import { Mongo } from 'meteor/mongo';

activityList = new Mongo.Collection('activityList');
teacherModules = new Mongo.Collection('teacherModules');
studentModules = new Mongo.Collection('studentModules');
questions = new Mongo.Collection('questions');
deployedquestions = new Mongo.Collection('deployedquestions');
responses = new Mongo.Collection('responses');
feedback = new Mongo.Collection('feedback');
notifications = new Mongo.Collection('notifications');

if (Meteor.isServer) {
  Meteor.publish('studentModules', function studentModulesPublication() {
      return studentModules.find();
  });
  Meteor.publish('teacherModules', function teacherModulesPublication() {
      return teacherModules.find({});
  });
  Meteor.publish('activityList', function activityListPublication() {
      return activityList.find();
  });
  Meteor.publish('questions', function questionsPublication() {
      return questions.find();
  });
  Meteor.publish('deployedquestions', function deployedquestionsPublication() {
      return deployedquestions.find();
  });
  Meteor.publish('responses', function responsesPublication() {
      return responses.find();
  });
  Meteor.publish('feedback', function feedbackPublication() {
      return feedback.find();
  });
  Meteor.publish('notifications', function notificationsPublication() {
      return notifications.find();
  });
}else {
  Meteor.subscribe('studentModules');
  Meteor.subscribe('teacherModules');
  Meteor.subscribe('activityList');
  Meteor.subscribe('questions');
  Meteor.subscribe('deployedquestions');
  Meteor.subscribe('responses');
  Meteor.subscribe('feedback');
  Meteor.subscribe('notifications');
}
