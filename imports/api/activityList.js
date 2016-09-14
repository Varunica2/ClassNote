
import { Mongo } from 'meteor/mongo';
 
activityList = new Mongo.Collection('activityList');
teacherModules = new Mongo.Collection('teacherModules');
studentModules = new Mongo.Collection('studentModules');
questions = new Mongo.Collection('questions');
deployedquestions = new Mongo.Collection('deployedquestions');
responses = new Mongo.Collection('responses');
feedback = new Mongo.Collection('feedback');
notifications = new Mongo.Collection('notifications');