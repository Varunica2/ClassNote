import { Mongo } from 'meteor/mongo';
export const NotebooksDB = new Mongo.Collection('notebooks');
export const StudentsDB = new Mongo.Collection('students');
export const SectionsGrpDB = new Mongo.Collection('nb_sectionGrps');
export const SectionsDB = new Mongo.Collection('nb_sections');
export const PagesDB = new Mongo.Collection('nb_pages');

if (Meteor.isServer) {
  Meteor.publish('notebooks', function notebooksPublication() {
      return NotebooksDB.find();
  });
  Meteor.publish('students', function studentsPublication() {
      return StudentsDB.find();
  });
  Meteor.publish('nb_sectionGrps', function sectionsGrpsPublication() {
      return SectionsGrpDB.find();
  });
  Meteor.publish('nb_sections', function sectionsPublication() {
      return SectionsDB.find();
  });
  Meteor.publish('nb_pages', function pagesPublication() {
      return PagesDB.find();
  });
}else{
  Meteor.subscribe('notebooks');
  Meteor.subscribe('students');
  Meteor.subscribe('nb_sectionGrps');
  Meteor.subscribe('nb_sections');
  Meteor.subscribe('nb_pages');
}
