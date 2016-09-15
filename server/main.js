import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import '../imports/api/activityList.js';

import './api/onenote_api.js';
import { Session } from 'meteor/session';
import { NotebooksDB, StudentsDB, SectionsDB } from '../imports/api/mongoRelations.js';
import { EJSON } from 'meteor/ejson'

Meteor.startup(() => {

});

Meteor.methods({
  getNoteBooks:function (code) {
    Meteor.call('API_getNoteBooks', code, function(err, result){
      NotebooksDB.remove({});
      if(result["statusCode"] == 200)
      {
        var values = EJSON.parse(result["content"])["value"];
        for(i = 0; i < values.length; i++){
          var id = values[i]["id"];
          var name = values[i]["name"];
          NotebooksDB.insert({rawId: id, name: name});
        }
      }
    });
  },
  getStudents:function (code, notebookId) {
    Meteor.call('API_getStudents', code, notebookId, function(err, result){
      StudentsDB.remove({});
      if(result["statusCode"] == 200){
        var values = EJSON.parse(result["content"])["value"];
        for(i = 0; i < values.length; i++){
          var id = values[i]["id"];
          var name = values[i]["name"];
          var userId = values[i]["userId"];
          var self = values[i]["self"];
          StudentsDB.insert({rawId: id, name: name, userId: userId, self: self});
        }
      }
    });
  },
  getNotebookSectionGroups:function (code, notebookId) {
    Meteor.call('API_getNoteBookSectionGroups', code, notebookId, function(err, result){
      SectionsDB.remove({});
      if(result["statusCode"] == 200){
        var values = EJSON.parse(result["content"])["value"];
        for(i = 0; i < values.length; i++){
          var id = values[i]["id"];
          var name = values[i]["name"];
          var self = values[i]["self"];
          SectionsDB.insert({rawId: id, name: name, self: self});
        }
      }
    });
  },
  getSectionGroupSections:function(code, selfLink){
    Meteor.call('API_getSectionGroupSections', code, selfLink, function(err, result){
      console.log(result);
    });
  },
  getNotebookSectionPages:function(code, selfLink){
    Meteor.call('API_getNoteBookSectionPages', code, selfLink, function(err, result){
      console.log(result);
    });
  }
});
