import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {Mongo} from 'meteor/mongo';
import { HTTP } from 'meteor/http'

import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor'
import { EJSON } from 'meteor/ejson'

import '../imports/ui/onenotefront.js'
import '../imports/api/activityList.js';
import { NotebooksDB, StudentsDB, SectionsGrpDB, SectionsDB, PagesDB, PagesContentDB } from '../imports/api/mongoRelations.js';
import './main.html';

//default session

Session.setDefaultPersistent('userID','');
Session.setDefaultPersistent('setID','No');
Session.setDefaultPersistent('setuserName','No');
Session.setDefaultPersistent('userName','');
Session.setDefaultPersistent('userType','');
Session.setDefaultPersistent('profileMade','No');
Session.setDefault('qvselect','');
Session.setDefaultPersistent('actstatus','inactive');


//default session end

//currently hardcoded for one-way authentication.
// Required to be changed to automated retrieval of token in 2-way authentication
Session.set("accessToken", "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IlliUkFRUlljRV9tb3RXVkpLSHJ3TEJiZF85cyIsImtpZCI6IlliUkFRUlljRV9tb3RXVkpLSHJ3TEJiZF85cyJ9.eyJhdWQiOiJodHRwczovL29uZW5vdGUuY29tLyIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzViYTVlZjVlLTMxMDktNGU3Ny04NWJkLWNmZWIwZDM0N2U4Mi8iLCJpYXQiOjE0NzUxNTQ0NTMsIm5iZiI6MTQ3NTE1NDQ1MywiZXhwIjoxNDc1MTU4MzUzLCJhY3IiOiIxIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6IjJhMTljMjc2LTU1OTMtNDRiOS05NTA4LTk5YTY4YmIyYjcxZCIsImFwcGlkYWNyIjoiMCIsImdpdmVuX25hbWUiOiJWYXJ1bmljYSIsImlwYWRkciI6IjEzNy4xMzIuMjcuMTk5IiwibmFtZSI6IlZhcnVuaWNhIiwib2lkIjoiYmUzZGI2M2ItMTVhOC00ZjI4LTk5YjAtNGNiYWYyMWNkMzc0Iiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTc2OTMyMzIzMi0xNTU4NzAxODczLTEzMTcwNTk0OTUtNTIyMjgiLCJwdWlkIjoiMTAwM0JGRkQ4RUI0MTA2NiIsInNjcCI6Ik5vdGVzLkNyZWF0ZSBOb3Rlcy5SZWFkIE5vdGVzLlJlYWQuQWxsIE5vdGVzLlJlYWRXcml0ZSBOb3Rlcy5SZWFkV3JpdGUuQWxsIE5vdGVzLlJlYWRXcml0ZS5DcmVhdGVkQnlBcHAiLCJzdWIiOiJFbFlZMThtNGVUcUNpZjBoZ2hOT2g1el9sbUhWWWtRVG5ieHhBWjVFR2FVIiwidGlkIjoiNWJhNWVmNWUtMzEwOS00ZTc3LTg1YmQtY2ZlYjBkMzQ3ZTgyIiwidW5pcXVlX25hbWUiOiJhMDExNzA1N0B1Lm51cy5lZHUiLCJ1cG4iOiJhMDExNzA1N0B1Lm51cy5lZHUiLCJ2ZXIiOiIxLjAifQ.RZBG2rQdF6n6Na7AxD0dzl9h4SwAG9NVUmSpQyh0E_1Ubz-hgxC9dlhl6D2Yqhbhk_8kNdNjCpak4tuzugq7u-YC65CELs4nYwqlzlQzk624PFTRO5b6aEFfS0Khqgq7cAZdtunIHnVkpoJV0T7Y5hakkAqgntGcc1oKYLuXKqmPANnQzHSVZC_xcx682-wUT08kcTcgOFs2iTwMeCs6XdgfA7Ywq0xqgzoKmSb1xp6sxxTyQr20qNPmEBDNFR6avY-faoqndq7PpYzjT7cQ2b3ABgrs05ZhlhpGBLwyk3dea2ai-US1JoK-lJFYjvlfePYxdMHgd00llEm1Lu9D2A");

//Global Variable
var prevOpen = "";

//Router Info

Router.route('/dashboard',{
  template:'dashboard',
  name:'dash'
});

Router.route('/',{

  template:'home',
  name:'home'
});


Router.route('/actcreate',{

  template : "actcreate",
  name:'create'
});


Router.route('/addmodule',{

  template : "addmodule",
  name:'addmodule'
});

Router.route('/editmodule',{

  template : "editmodule",
  name:'editmodule'
});

Router.route('/modulemanagement',{

  template : "modulemanagement",
  name:'modulemanagement'
});

Router.route('/session',{

  template : "session",
  name:'session'
});

Router.route('/notebooks',{

  template : "notebook_main",
  name:'notebooks'
});



//router info end


//template home events

Template.home.events({
   'click #fourth #Login' : function(){

   console.log("Heya!");
   loginIVLE();

   }
 });




//template home events end
Template.dashboard.events({
  'click #viewact': function(e){
    //console.log(e.currentTarget.parentNode.childNodes;
    Session.setPersistent('aID',e.currentTarget.parentNode.childNodes[11].innerHTML);
    Router.go('/session');
  }
})


Template.dashboard.helpers({



   username:function(){

     return Session.get('userName');
   },


   dashboard: function (){
    var user = Session.get('userID');

    if(user != ''){
    if((user == 't0914194') || (user =='dcsbw') || (user ='A0117057')){

      Session.setPersistent('userType','teacher');

    }

    else{
        Session.setPersistent('userType','student');

    }
   }

 },

 modList: function() {
    return teacherModules.find({userID : Session.get('userID')});
 },

   list : function(){
      return activityList.find({ userID : Session.get('userID')},{ sort: { time: -1 } });

   },

   stulist : function(){

       var smod = studentModules.findOne({studentID:Session.get('userID')}).codes;
       return activityList.find({module: {$in: smod},status : 'active'},{ sort: { time: -1 } });

  },

   isteacher: function(){
    if(Session.get('userType')=='teacher'){
      return true;
    }
   },

   checkIndex: function (index) {
    return index == 0 ? true : false;
  },

  checkIfSame: function(modCode, activityCode, index) {
    if (index === 0) {
      $("#" + modCode).css("display", "block");
      prevOpen = "#" + modCode;
    }
    return modCode === activityCode;
  }


/*
    load_OneNote : function() {

      var code = Session.get("accessToken");
      //getNotebooks
      Meteor.call('getNoteBooks', code, function(){});

      //notebook_template
      var cursor = NotebooksDB.find();
      console.log(cursor);

      // Execute the each command, triggers for each document
      cursor.each(function(err, item) {

        console.log("entered");
        // If the item is null then the cursor is exhausted/empty and closed - may remove later
        if(item == null) {
          alert("no notebooks available!");
        }

        else {


          var notebook = NotebooksDB.find({_id : this._id}).fetch();
          if(notebook.length == 1){
          Meteor.call('getStudents', code, notebook[0]["rawId"]);
          Meteor.call('getNotebookSectionGroups', code, notebook[0]["rawId"]);
          }

          var sectionsGrp = SectionsGrpDB.find({_id: this._id}).fetch();
          if(sectionsGrp.length == 1){
            var code =   Session.get("accessToken");
            Meteor.call('getSectionGroupSections', code, sectionsGrp[0]["self"], sectionsGrp[0]["_id"]);
          }else{
            alert("problem detected");
          }


          //Meteor.call('createSectionGrp', code, this._id); - work on creating

          var sections = SectionsDB.find({_id: this._id}).fetch();
          if(sections.length == 1){
            Meteor.call('getNotebookSectionPages', code, sections[0]["self"], sections[0]["_id"]);
          }else{
            alert("problem detected");
          }

          var sections = PagesDB.find({_id: this._id}).fetch();
          if(sections.length == 1){
            var code =   Session.get("accessToken");
            Meteor.call('getPageContent', code, sections[0]["rawId"], sections[0]["self"], sections[0]["_id"]);
          }else{
            alert("problem detected");
          }

        }
      });
    }
*/
});

Template.insertTab.events({
  'click a': function(event) {
    if (prevOpen === "") {
      prevOpen = "#" + event.currentTarget.innerHTML;
    } else {
      $(prevOpen).css("display", "none");
      prevOpen = "#" + event.currentTarget.innerHTML;
    }

    $("#" + event.currentTarget.innerHTML).css("display", "block");
  }
});

Template.insertActiveTab.events({
  'click a': function(event) {
    if (prevOpen === "") {
      prevOpen = "#" + event.currentTarget.innerHTML;
    } else {
      $(prevOpen).css("display", "none");
      prevOpen = "#" + event.currentTarget.innerHTML;
    }

    $("#" + event.currentTarget.innerHTML).css("display", "block");
  }
});




Template.navigation.helpers({

   currentTime : function() {

       return 1;//Chronos.currentTime().toString().slice(0,24); // updates every second
   },

   getUser : function(){

    return Session.get('userName');
   },

   getID: function(){

    return Session.get('userID');
   },

   getModules : function () {

        if(Session.get('userType')=='teacher'){
        return teacherModules.find({userID:Session.get('userID')});
      }
        else{

         return studentModules.find({studentID:Session.get('userID')});

                  }
   },

   isModule: function(){

    if(Session.get('userType')=='student'){

    if(studentModules.find({studentID:Session.get('userID')}).fetch()==''){

      return false;
    }

    else{
      return true;
    }
  }


   else{

    if(teacherModules.find({userID:Session.get('userID')}).fetch()==''){

      return false;
    }

    else{
      return true;
    }
  }

   },

   teach : function(){

    if(Session.get('userType') == 'teacher'){

      return true;
    }

    else{

      return false;
    }
   },

   unseen : function(){

    return notifications.find({studentID:Session.get('userID'), status : 'unseen'}).fetch().length;
   },


   getNoti : function(){

    return notifications.find({studentID:Session.get('userID')},{ sort: { time: -1 } });
   }


});

Template.navigation.events({
   'click #out' : function(){

   Router.go('/');
   logout();

   },

   'click #noti' : function(){

    var p;
    var ret = notifications.find({studentID:Session.get('userID'), status:'unseen'}).fetch();
    var len = ret.length;

    if(len != 0){
    for(p=0;p<len;p++){
    var id = ret[p]._id;
    notifications.update({_id:id},{ $set : {status : "seen"}},{multi : true} );
   }
}
   },

   'click #createModule' : function(){


   Router.go('/addmodule');


   },

   'click #createbtn' : function(){

    Router.go('/actcreate');
  },


   'click #first #homebtn' : function(){

   if(Session.get('userState') == "logged-out"){
    Router.go('/');
   }

   else{
    Router.go('/dashboard');
   }


   }
 });
//




Template.actcreate.helpers({

  setCounter : function(){


   Session.setPersistent('counter', []);


  },

  count : function (){

    return Session.get('counter');
  }


});

Template.questionlist.helpers({




});



Template.actcreate.events({
   'click #addquestion' : function(){

    count = Session.get('counter');
    var uniqid =  'count' + (Math.floor(Math.random() * 100000)).toString(); // Give a unique ID so you can pull _this_ input when you click remove
    count.push({uniqid: uniqid, value: ""});
    newcount = count;
    Session.setPersistent('counter',newcount);
  },


'submit #activityform'(event){

   count = Session.get('counter');
   event.preventDefault();
   const target = event.target;

   var module = target.modulename.value;
   var activity = target.activityname.value;
   var code = target.modulecode.value;
   var append = [];
   var x;
   var deployed = false;

   for(x=0;x<count.length;x++){
     var uid = count[x].uniqid;
     var val = target[uid].value;
     append.push(val);
   }

   activityList.insert({
        aID : code + activity,
        activity:activity,
        name : module,
        module : code,
        status : "inactive",
        time : new Date(),
        userID : Session.get('userID')
    });

   questions.insert({
        aID : code + activity,
        quest : append,
        time : new Date(),
        deployState : deployed

  });

   Session.setPersistent('counter','');
   alert("Activity has been created!");
   Router.go('/dashboard');
}
});



Template.addquestion.events({

   'click #remove': function(event) {
    console.log('remove');
    uniqid = this.uniqid;

    count = Session.get('counter');
    newercount = _.filter(count, function(x) { return x.uniqid != uniqid; });
    Session.setPersistent('counter', newercount);
  },


});

Template.addquestion.helpers({

qnumber : function (){

  return Session.get('counter').length;
}

});

Template.addmodule.helpers({

 getModuleList:function(){

  return teacherModules.find({userID:Session.get('userID')});
 }


});

Template.addmodule.events({


  'submit #moduleform'(event){

   event.preventDefault();
   const target = event.target;
   var modname = target.modulename.value;
   var modcode = target.modulecode.value;
   var nb_name = modcode;
   var teacherID = Session.get("userID");
   var studentlist = target.studentlist.value;
   var array = studentlist.split('\n');


   var code =   Session.get("accessToken");

    Meteor.call('createNewNoteBook', code, nb_name, teacherID, array, function(){
    });

    for(var i=0; i<array.length; i++){
      Meteor.call('createSectionGrp', code, nb_name,array[i]); 
      Meteor.call('createSectionInStudents', code, nb_name, 'assignments'); 
    }

   teacherModules.insert({
        module : modname,
        code : modcode,
        userID : Session.get('userID'),
      //  notebook: notebookName,
        studentID : studentlist,
        time : new Date(),

   });

   var z;
   for (z=0; z< array.length;z++){
   currentID = array[z];

   if(studentModules.find({studentID:currentID}).fetch() == ''){

   var mods =[modcode];
   studentModules.insert({
        studentID : currentID,
        module : modname,
        codes : mods,
        time : new Date(),

   });
   }

   else{
    var currentmods = studentModules.findOne({studentID:currentID}).codes;
    var id = studentModules.findOne({studentID:currentID})._id;
    currentmods.push(modcode);
    studentModules.update({_id:id }, { $set: {codes: currentmods }});


   }
  }


   alert("Module has been created!");
   Router.go('/dashboard');


}
});


Template.editmodule.helpers({

 getModuleList:function(){
  return teacherModules.find({userID:Session.get('userID')});
 }

});

Template.editmodule.events({

'submit #moduleform'(event){

   event.preventDefault();
   const target = event.target;
   var modulecode = target.modulecode.value;
   var newmodname = target.newmodulename.value;
   var newmodcode = target.newmodulecode.value;
   var nb_name = modulecode;
   var newstudentlist = target.newstudentlist.value;
   var array = newstudentlist.split('\n');
   var modid = teacherModules.findOne({code:modulecode})._id;
   var actids = [activityList.find({module:modulecode})._id];
//   console.log(actids);

   var code =   Session.get("accessToken");
    /*
      editing to existing notebooks goes here
    */
   teacherModules.update({_id:modid}, { $set: {code:newmodcode, module:newmodname, studentID:newstudentlist }});
  /*
   for(i=0 ; i<actids.length ; i++){
    activityList.update({id:actids[i]}, { $set: {code:newmodcode, name:newmodname}});
    console.log(actids[i]);
   };
  */
   alert("Module has been edited!");
   Router.go('/dashboard');
  }
});


Template.module.events({

  'click .modlist': function(e){

    Session.setPersistent('modID',this._id);
    Router.go('/modulemanagement');
    /*
      enter code to auto populate fields of the form upon module clicked
    */
  }

});


Template.modulemanagement.helpers({

  getModule : function () {
      var code = teacherModules.findOne({_id:Session.get('modID')}).code;
      var module = teacherModules.findOne({_id:Session.get('modID')}).module;

      return code + ' - ' + module;
  },

  getStudentList : function (){
    var x =  teacherModules.findOne({_id:Session.get('modID')}).studentID;
    var y = x.split('\n');
    return y;
  }

});

Template.modulemanagement.events({

   'click #editmod' : function(){
      Router.go('/editmodule');
   },

   'click #deletemod' : function(){
      teacherModules.remove({_id:Session.get('modID')});
      alert("Module has been deleted!");
      Router.go('/dashboard');
   }
});

Template.actbox.events({

  'click #viewact': function(e){

  Session.setPersistent('aID',this.aID);
  Router.go('/session');
}
});

Template.session.helpers({

  teach : function(){

    if(Session.get('userType') == 'teacher'){

      return true;
    }

    else{

      return false;
    }
  }
});

Template.teachersession.helpers({

   qlist : function (){

      var a =  questions.findOne({'aID':Session.get('aID')}).quest;
      Session.setPersistent('qnumber',a.length);
      return a;

   },

   aid : function (){

    return Session.get('aID');
   },

   getactqnum : function(){

    var a =  questions.findOne({'aID':Session.get('aID')}).quest;
    return a.length;

   },

   getactmod : function(){

    return activityList.findOne({'aID':Session.get('aID')}).name;
   },

   getmodcode : function(){

    return activityList.findOne({'aID':Session.get('aID')}).module;
   },

   getactcode : function(){

    return activityList.findOne({'aID':Session.get('aID')}).activity;
   },

   getactnum : function (){

    var x = activityList.findOne({'aID':Session.get('aID')}).module;
    return teacherModules.findOne({'code':x}).studentID.split('\n').length;
   },

   qviewmain : function(){

    if(Session.get('qvselect') == ''){

    return 'None Selected';

     }

   else{

    return questions.findOne({'aID':Session.get('aID')}).quest[Session.get('qvselect')];

   }

   },

   activitystatus : function(){

    if(Session.get('actstatus') == "inactive"){
      return 'Start Activity';
    }

    else{

      return 'Finish Activity';
    }
   },

   rlist : function(){

    return responses.find({aID : Session.get('aID')});
   },

   getdeployedq : function () {
     var count = deployedquestions.findOne({'aID':Session.get('aID')});
     console.log(count.length);
     return count.length;
   }

});


Template.teachersession.events({

  'click .qbtn' : function(event){

   event.preventDefault();
   const target = event.target;
   var qid = target.id;
   qid = qid.slice(1);
   Session.set('qvselect',qid);
  },

  'click .qbtn2' : function(event){

   event.preventDefault();
   var code = Session.get("accessToken");
   const target = event.target;
   var qid = target.id;
   qid = qid.slice(1);
   activity = Session.get('aID');
   teacher = Session.get('userID');
   var deployedSet = deployedquestions.find({aID:activity}).fetch();
   var currentq = questions.findOne({'aID':Session.get('aID')}).quest[qid];
   var nbID = activityList.findOne({'aID':Session.get('aID')}).module;
   const pageObject = new PageObject("currentActivity");


   if(deployedSet == ''){

     var quests =[currentq];
     deployedquestions.insert({
          teacherID : teacher,
          aID : activity,
          deployed : quests,
          time : new Date(),
     });

     alert("Question has been deployed");
   }

   else{

    var currentdeployed = deployedquestions.findOne({aID:activity}).deployed;
    var id = deployedquestions.findOne({aID:activity})._id;
    currentdeployed.push(currentq);
    deployedquestions.update({_id:id }, { $set: {deployed: currentdeployed }});

    alert("Question has been deployed");

   }

   pageObject.addQuestion(qid,currentq);

   if (acttype === "individual"){
     Meteor.call('sendPageToStudents', code, nbID, pageObject, 'assignments');
   } else {
     Meteor.call('addNewCollaborativeActivity', code, nbID, aID, function(err, result){
       console.log(result);
     });
   }
   questions.update({_id:id }, { $set: {deployState: true }});

  },

  'click .deployall' : function(event){

     event.preventDefault();
     var code = Session.get("accessToken");
     const target = event.target;
     var qid = target.id;
     qid = qid.slice(1);
     activity = Session.get('aID');
     teacher = Session.get('userID');
     var deployedSet = deployedquestions.find({aID:activity}).fetch();
     var currentqlist = questions.find({'aID':Session.get('aID'), deployState:false}).fetch();
     var nbID = activityList.findOne({'aID':Session.get('aID')}).module;
     const pageObject = new PageObject("currentActivity");

     if(deployedSet == ''){

       for (i=0 ; i<currentqlist.length ; i++) {

          deployedquestions.insert({
          teacherID : teacher,
          aID : activity,
          deployed : currentqlist[i],
          time : new Date(),
          });

          pageObject.addQuestion(qid,currentqlist[i]);
          questions.update({_id:id, aID: activity }, { $set: {deployState: true }});

       }
       alert("Question has been deployed");
     }

     else{

      var currentdeployed = deployedquestions.findOne({aID:activity}).deployed;
      var id = deployedquestions.findOne({aID:activity})._id;

      for (i=0 ; i<currentqlist.length ; i++) {

        pageObject.addQuestion(qid,i);
        deployedquestions.update({_id:id }, { $set: {deployed: currentqlist[i] }});
        questions.update({_id:id, aID: activity }, { $set: {deployState: true }});
      }

      alert("Question has been deployed");

     }

     if (acttype === "individual") {
      Meteor.call('sendPageToStudents', code, nbID, pageObject, 'assignments');
     } else if (acttype === "collab") {
      Meteor.call('addNewCollaborativeActivity', code, nbID, aID, function(err, result){
        console.log(result);
      });
     }


  },

  'click #individual' : function(){
    Session.setPersistent('acttype','individual');
  },

  'click #collab' : function(){
    Session.setPersistent('acttype','collab');
  },

  'submit #addqform' : function(e){

   e.preventDefault();
   const target = event.target;
   var q = target.addition.value;
   var old = questions.findOne({'aID':Session.get('aID')}).quest;
   var id = questions.findOne({'aID':Session.get('aID')})._id;
   console.log(old);
   old.push(q);

   questions.update({_id:id }, { $set: {quest: old }});
  },

  'click #togglestatus' : function(){

    var id = activityList.findOne({aID:Session.get('aID')})._id;
    var status = activityList.findOne({aID:Session.get('aID')}).status;

    if(status == 'active'){
    activityList.update({_id:id }, { $set: {status: 'inactive' }});
    Session.setPersistent('actstatus','inactive');
    Router.go('/dashboard');


   }
    else{
      activityList.update({_id:id }, { $set: {status: 'active' }});
      Session.setPersistent('actstatus','active');

    }
  },

   'click #notibutton' : function(){

   var noti = prompt("Type the message you want to send", "Have mercy");
   var modu =  activityList.findOne({aID:Session.get('aID')}).module;
   var slist =  teacherModules.findOne({code:modu}).studentID;
   var y = slist.split('\n');

   var z;
   for (z=0; z< y.length;z++){
   current = y[z];

   notifications.insert({
        studentID : current,
        module : modu,
        message : noti,
        status : 'unseen',
        time : new Date(),

   });


   }

   alert("Notifications sent");

  },


});

Template.studentsession.helpers({

  sqlist : function (){

      var a =  deployedquestions.findOne({'aID':Session.get('aID')}).deployed;
      Session.setPersistent('qnumber',a.length);
      return a;

   },

   aid : function (){

    return Session.get('aID');
   },

   getactqnum : function(){

   return Session.get('qnumber');

   },

   getactmod : function(){

    return activityList.findOne({'aID':Session.get('aID')}).name;
   },

   getmodcode : function(){

    return activityList.findOne({'aID':Session.get('aID')}).module;
   },

   getactcode : function(){

    return activityList.findOne({'aID':Session.get('aID')}).activity;
   },

   getactnum : function (){

    var x = activityList.findOne({'aID':Session.get('aID')}).module;
    return teacherModules.findOne({'code':x}).studentID.split('\n').length;
   },

   qviewmain : function(){

    if(Session.get('sqvselect') == ''){

    return 'None Selected';

     }

   else{

    return deployedquestions.findOne({'aID':Session.get('aID')}).deployed[Session.get('sqvselect')];

   }

   },

   prlist : function(){

    return responses.find({aID : Session.get('aID'), studentID: { $ne: Session.get('userID')}});

   }

});

Template.studentsession.events({

   'click .sqbtn' : function(event){

   event.preventDefault();
   const target = event.target;
   var qid = target.id;
   qid = qid.slice(1);
   Session.set('sqvselect',qid);
  },

  'submit #respform' : function(respe){


   respe.preventDefault();
   const target = respe.target;
   var resp = target.responseadd.value;
   var id = Session.get('aID');
   var stuid = Session.get('userID');

   responses.insert({
        studentID : stuid,
        response : resp,
        aID  : id,
        time : new Date(),

   });


  },

});
//loginIVLE

function loginIVLE() {
  var APIKey = "6YIDjroMfeBjiTP49ms99";
  var APIDomain = "https://ivle.nus.edu.sg/";
  var APIUrl = APIDomain + "api/lapi.svc/";
  var returnURL = 'http://localhost:3000/dashboard';
  var LoginURL = APIDomain + "api/login/?apikey=6YIDjroMfeBjiTP49ms99&url=" + returnURL;
  Session.setPersistent('userState',"logged-in");

  window.location = LoginURL;



}

//function end
var Token = window.location.search.substr(1).split(/\&/)[0].slice(6);
Session.setPersistent("Token",Token);


Populate_UserId();
Populate_UserName();

//userName through IVLE
function Populate_UserName() {
  var APIKey = "6YIDjroMfeBjiTP49ms99";
  var APIDomain = "https://ivle.nus.edu.sg/";
  var APIUrl = APIDomain + "api/lapi.svc/";
  var token = Session.get('Token');
  var url = APIUrl + "UserName_Get?output=json&callback=?&APIKey=" + APIKey + "&Token=" + token;



  if(Session.get('setuserName') == 'No'){
  jQuery.getJSON(url, function (data) {
      Session.setPersistent('userName', data);
      Session.setPersistent('setuserName', 'Yes');


  });
}
}
//function end

//userID through IVLE

function Populate_UserId() {
  var APIKey = "6YIDjroMfeBjiTP49ms99";
  var APIDomain = "https://ivle.nus.edu.sg/";
  var APIUrl = APIDomain + "api/lapi.svc/";
  var token = Session.get('Token');
  var url = APIUrl + "UserID_Get?output=json&callback=?&APIKey=" + APIKey + "&Token=" + token;


  if(Session.get('setID') == 'No'){
  jQuery.getJSON(url, function (data) {
      Session.setPersistent('userID', data);
      Session.setPersistent('setID', 'Yes');

  });
}



}

//function end

function QuestionObject(questionIndex, questionText) {
    this.index = questionIndex;
    this.text = questionText;
}

class PageObject {
  constructor(pageName) {
    this.name = pageName;
    this.questions = [];
  }

  addQuestion(questionIndex, questionText) {
    this.questions.push(new QuestionObject(questionIndex,questionText));
  }

  getQuestions(){
     return this.questions;
  }
}




function logout(){

  Session.setPersistent('userState','logged-out');
  Session.setPersistent('userID','');
  Session.setPersistent('userName','');
  Session.setPersistent('userType','');
  Session.setPersistent('UserType','');
  Session.setPersistent('Token','');
  Session.setPersistent('setID', 'No');
  Session.setPersistent('setuserName', 'No');


}


//Independent functions end

console.log("Welcome to ClassNote");
