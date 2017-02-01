import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
import {Mongo} from 'meteor/mongo';
import {HTTP} from 'meteor/http'
import {Session} from 'meteor/session';
import {Meteor} from 'meteor/meteor'
import {EJSON} from 'meteor/ejson'
import '../imports/ui/onenotefront.js'
import '../imports/api/activityList.js';
import ivle from '../imports/api/nus-ivle-api.js';
import {
	NotebooksDB,
	StudentsDB,
	SectionsGrpDB,
	SectionsDB,
	PagesDB,
	PagesContentDB
} from '../imports/api/mongoRelations.js';
import './main.html';
//default session
Session.setDefaultPersistent('userID', '');
Session.setDefaultPersistent('setID', 'No');
Session.setDefaultPersistent('setuserName', 'No');
Session.setDefaultPersistent('userName', '');
Session.setDefaultPersistent('userType', '');
Session.setDefaultPersistent('profileMade', 'No');
Session.setDefault('qvselect', '');
Session.setDefaultPersistent('actstatus', 'inactive');
Session.setDefaultPersistent('students','');
Session.setDefaultPersistent('addmodcode','');
Session.setDefaultPersistent('AuthToken','');
Session.setDefaultPersistent('APIKey',"6YIDjroMfeBjiTP49ms99");
Session.setDefaultPersistent('APIDomain',"http://ivle.nus.edu.sg/");
Session.setDefaultPersistent('APIUrl', Session.get('APIDomain') + "api/lapi.svc/");
Session.setDefaultPersistent('accessToken', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ilk0dWVLMm9hSU5RaVFiNVlFQlNZVnlEY3BBVSIsImtpZCI6Ilk0dWVLMm9hSU5RaVFiNVlFQlNZVnlEY3BBVSJ9.eyJhdWQiOiJodHRwczovL29uZW5vdGUuY29tLyIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzViYTVlZjVlLTMxMDktNGU3Ny04NWJkLWNmZWIwZDM0N2U4Mi8iLCJpYXQiOjE0ODU5MzA0MTcsIm5iZiI6MTQ4NTkzMDQxNywiZXhwIjoxNDg1OTM0MzE3LCJhY3IiOiIxIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6IjJhMTljMjc2LTU1OTMtNDRiOS05NTA4LTk5YTY4YmIyYjcxZCIsImFwcGlkYWNyIjoiMCIsImdpdmVuX25hbWUiOiJWYXJ1bmljYSIsImlwYWRkciI6IjEzNy4xMzIuMjIwLjE5MCIsIm5hbWUiOiJWYXJ1bmljYSIsIm9pZCI6ImJlM2RiNjNiLTE1YTgtNGYyOC05OWIwLTRjYmFmMjFjZDM3NCIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS03NjkzMjMyMzItMTU1ODcwMTg3My0xMzE3MDU5NDk1LTUyMjI4IiwicGxhdGYiOiI1IiwicHVpZCI6IjEwMDNCRkZEOEVCNDEwNjYiLCJzY3AiOiJOb3Rlcy5DcmVhdGUgTm90ZXMuUmVhZCBOb3Rlcy5SZWFkLkFsbCBOb3Rlcy5SZWFkV3JpdGUgTm90ZXMuUmVhZFdyaXRlLkFsbCBOb3Rlcy5SZWFkV3JpdGUuQ3JlYXRlZEJ5QXBwIiwic3ViIjoiRWxZWTE4bTRlVHFDaWYwaGdoTk9oNXpfbG1IVllrUVRuYnh4QVo1RUdhVSIsInRpZCI6IjViYTVlZjVlLTMxMDktNGU3Ny04NWJkLWNmZWIwZDM0N2U4MiIsInVuaXF1ZV9uYW1lIjoiYTAxMTcwNTdAdS5udXMuZWR1IiwidXBuIjoiYTAxMTcwNTdAdS5udXMuZWR1IiwidmVyIjoiMS4wIn0.Ua02vq55oQQi3iMuF4eR6A1vfLffqlQsNj28rQ7gJltabtB8fK5TsuphE_4DClZJHTHZ_mSZWWbLJ2EdqXXE2BE4007_6esfx9NTgB9IWEyewPJ_ghy5UBHuGO4Ft0Jm_gn_1suDv93WcazPrV7i3QtJu60-xFYxxmMCHF_kt2CyqvkhWn8KzIQo0Uf0eQiNWQFSYPxZ0XjXcChbfbe0MXsbqd9YzO0mzQzwugeK95E-V210_hfGy6fJd4orIzUihg0aSG9VRDvlWbNcxyJcDpNq2LP0flMNU07ZOAJi4kf8ptw4GI7b849DIAM3sjTx92wjXmWfnFodM_CGHdKPcg');

//default session end

var prevOpen = "";
var newModuleName = "";
var flag = false;

var user;

//Router Info
Router.route('/dashboard', {
	template: 'dashboard',
	name: 'dash'
});
Router.route('/', {
	template: 'home',
	name: 'home'
});
Router.route('/actcreate', {
	template: "actcreate",
	name: 'create'
});
Router.route('/addmodule', {
	template: "addmodule",
	name: 'addmodule'
});
Router.route('/editmodule', {
	template: "editmodule",
	name: 'editmodule'
});
Router.route('/session', {
	template: "session",
	name: 'session'
});
Router.route('/notebooks', {
	template: "notebook_main",
	name: 'notebooks'
});
Router.route('/responses',{

  template : "responses",
  name:'responses'
});
//router info end

Meteor.startup(() => {
	console.log("startup");
	var fullUrl = window.location.href;
    var n = fullUrl.indexOf("?code=");
	if(n > 0){
		var arr = fullUrl.substring(n).split("&");
	    var code = arr[0].substring(arr[0].indexOf("=") + 1);
		Meteor.call('getAccessTokenByCode','tempForNow',code, function(err, result){
			console.log(result);
			if(result['status'] == "success"){
				Session.set("accessToken", result['token']);
				userName = Session.get('userName');
				if(userName != ""){
					Router.go('/dashboard');
				}
			}else{
				if(result["status"] == "invalid_grant"){

				}
			}
		});

	}else{

	}
});

//template home events
Template.home.events({
	'click #fourth #Login': function() {
		console.log("Heya!");
		loginIVLE();
	}
});
//template home events end
Template.dashboard.events({
	'click #viewact': function(e) {
		//console.log(e.currentTarget.parentNode.childNodes;
		Session.setPersistent('aID', e.currentTarget.parentNode.childNodes[11].innerHTML);
		Router.go('/session');
	}
});

Template.dashboard.rendered = function() {
	console.log('rendered');

	var token = ivle.getToken();
	Session.setPersistent('AuthToken', token);

	user = ivle.User(Session.get("APIKey"), token);
};

Template.dashboard.helpers({
	username: function() {
		return Session.get('userName');
	},
	dashboard: function() {
		var user = Session.get('userID');
		if (user != '') {
			if ((user == 't0914194') || (user == 'dcsbw') || (user = 'A0117057')) {
				Session.setPersistent('userType', 'teacher');
			} else {
				Session.setPersistent('userType', 'student');
			}
		}
	},
	setAuthToken: function(){
		//Token =/= AuthToken
		//below method may not work
		Session.setPersistent('AuthToken', Session.get('Token'));
		console.log(Session.get('Token'));
		console.log(Session.get('AuthToken'));
	},
	modList: function() {
		return teacherModules.find({userID: Session.get('userID')});
	},
	list: function() {
		return activityList.find({
			userID: Session.get('userID')
		}, {
			sort: {
				time: -1
			}
		});
	},
	stulist: function() {
		var smod = studentModules.findOne({studentID: Session.get('userID')}).codes;
		return activityList.find({
			module: {
				$in: smod
			},
			status: 'active'
		}, {
			sort: {
				time: -1
			}
		});
	},
	isteacher: function() {
		if (Session.get('userType') == 'teacher') {
			return true;
		}
	},
	checkIndex: function(index) {
		return index == 0
			? true
			: false;
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
	currentTime: function() {
		return 1; //Chronos.currentTime().toString().slice(0,24); // updates every second
	},
	getUser: function() {
		return Session.get('userName');
	},
	getID: function() {
		return Session.get('userID');
	},
	getModules: function() {
		if (Session.get('userType') == 'teacher') {
			return teacherModules.find({userID: Session.get('userID')});
		} else {
			return studentModules.find({studentID: Session.get('userID')});
		}
	},
	isModule: function() {
		if (Session.get('userType') == 'student') {
			if (studentModules.find({studentID: Session.get('userID')}).fetch() == '') {
				return false;
			} else {
				return true;
			}
		} else {
			if (teacherModules.find({userID: Session.get('userID')}).fetch() == '') {
				return false;
			} else {
				return true;
			}
		}
	},
	teach: function() {
		if (Session.get('userType') == 'teacher') {
			return true;
		} else {
			return false;
		}
	},
	unseen: function() {
		return notifications.find({studentID: Session.get('userID'), status: 'unseen'}).fetch().length;
	},
	getNoti: function() {
		return notifications.find({
			studentID: Session.get('userID')
		}, {
			sort: {
				time: -1
			}
		});
	}
});
Template.navigation.events({
	'click #out': function() {
		Router.go('/');
		logout();
	},
	'click #noti': function() {
		var p;
		var ret = notifications.find({studentID: Session.get('userID'), status: 'unseen'}).fetch();
		var len = ret.length;
		if (len != 0) {
			for (p = 0; p < len; p++) {
				var id = ret[p]._id;
				notifications.update({
					_id: id
				}, {
					$set: {
						status: "seen"
					}
				}, {multi: true});
			}
		}
	},
	'click #createModule': function() {
		Router.go('/addmodule');
	},
	'click #createbtn': function() {
		Router.go('/actcreate');
	},
	'click #first #homebtn': function() {
		if (Session.get('userState') == "logged-out") {
			Router.go('/');
		} else {
			Router.go('/dashboard');
		}
	}
});
//
Template.actcreate.helpers({
	setCounter: function() {
		Session.setPersistent('counter', []);
	},
	count: function() {
		return Session.get('counter');
	}
});
Template.questionlist.helpers({});

Template.actcreate.events({
	'click #addquestion': function() {
		count = Session.get('counter');
		var uniqid = 'count' + (Math.floor(Math.random() * 100000)).toString(); // Give a unique ID so you can pull _this_ input when you click remove
		count.push({uniqid: uniqid, value: ""});
		newcount = count;
		Session.setPersistent('counter', newcount);
	},
	'submit #activityform' (event) {
		count = Session.get('counter');
		event.preventDefault();
		const target = event.target;
		var module = target.modulename.value;
		var activity = target.activityname.value;
		var code = target.modulecode.value;
		var append = [];
		var x;
		var deployed = false;
		for (x = 0; x < count.length; x++) {
			var uid = count[x].uniqid;
			var val = target[uid].value;
			append.push(val);
		}
		activityList.insert({
			aID: code + activity,
			activity: activity,
			name: module,
			module: code,
			status: "inactive",
			time: new Date(),
			userID: Session.get('userID')
		});

		for (var dexI = 0; dexI < append.length; dexI++){
			questions.insert({
				aID: code + activity,
				questIndex : dexI+1,
				quest: append[dexI],
				time: new Date(),
				deployState: false
			});
		}
		Session.setPersistent('counter', '');
		alert("Activity has been created!");
		Router.go('/dashboard');
	}
});
Template.addquestion.events({
	'click #remove': function(event) {
		console.log('remove');
		uniqid = this.uniqid;
		count = Session.get('counter');
		newercount = _.filter(count, function(x) {
			return x.uniqid != uniqid;
		});
		Session.setPersistent('counter', newercount);
	}
});
Template.addquestion.helpers({
	qnumber: function() {
		return Session.get('counter').length;
	}
});
Template.addmodule.helpers({
	getModuleList: function() {
		return teacherModules.find({userID: Session.get('userID')});
	}
});
Template.addmodule.events({
	'submit #moduleform': function(event) {
		event.preventDefault();
		const target = event.target;
		var modname = target.modulename.value;
		var modcode = target.modulecode.value;
		Session.setPersistent('addmodcode', modcode);
		var nb_name = modcode;
		var teacherID = Session.get("userID");
		var code = Session.get("accessToken");
		var teacherID_Full = teacherID + "@u.nus.edu";
		var sectionsInStudents = [];
		sectionsInStudents.push("assignments");
		sectionsInStudents.push("homework");
		var studentlist = target.studentlist.value;
		var array = studentlist.split('\n');
		/**/
		//getting student list from IVLE API
		var APIKey = Session.get('APIKey');
		var APIDomain = Session.get('APIDomain');
		var APIUrl = Session.get('APIUrl');
		var token = Session.get('AuthToken'); //change to get authtoken from IVLE
		var courseID = Session.get('addmodcode');
		var url = APIUrl + "Class_Roster?APIKey=" + APIKey + "&AuthToken=" + token + "&CourseID=" + courseID;
		var result = 'x123';
		//https://ivle.nus.edu.sg/API/Lapi.svc/Class_Roster?APIKey={System.String}&AuthToken={System.String}&CourseID={System.String}
		/*
		user.get("Class_Roster", {CourseID: modcode})
			.success(function(data) {
				console.log("Class_Roster");
	        	console.log(data);
	    	});

	    var studentlist = Session.get('students');
		console.log('studentlist from IVLE: '+studentlist);
		*/
		//Populate_StudentList();
		
		//var array = studentlist.split('\n');
		//end of code for getting students from IVLE API

		//delete after testing classroster LAPI
		/*teacherModules.insert({
					module: modname,
					code: modcode,
					userID: Session.get('userID'),
					notebook_F_KEY: result,
					studentID: studentlist,
					time: new Date()
				});
				var z;
				for (z = 0; z < array.length; z++) {
					currentID = array[z];
					if (studentModules.find({studentID: currentID}).fetch() == '') {
						var mods = [modcode];
						studentModules.insert({studentID: currentID, module: modname, codes: mods, time: new Date()});
					} else {
						var currentmods = studentModules.findOne({studentID: currentID}).codes;
						var id = studentModules.findOne({studentID: currentID})._id;
						currentmods.push(modcode);
						studentModules.update({
							_id: id
						}, {
							$set: {
								codes: currentmods
							}
						});
					}
				}
				alert("Module has been created!");
				Router.go('/dashboard');
		//till here*/

		Meteor.call('createNewNoteBook', code, nb_name, teacherID_Full, array, sectionsInStudents, teacherID, function(error, result) {
			console.log(error);
			if (result.status) {

				//this should be place somewhere else
				Meteor.call('getNoteBookInformation', code, result.id, teacherID);
				//

				teacherModules.insert({
					module: modname,
					code: modcode,
					userID: Session.get('userID'),
					notebook_F_KEY: result.id,
					studentID: studentlist,
					time: new Date()
				});
				var z;
				for (z = 0; z < array.length; z++) {
					currentID = array[z];
					if (studentModules.find({studentID: currentID}).fetch() == '') {
						var mods = [modcode];
						studentModules.insert({studentID: currentID, module: modname, codes: mods, time: new Date()});
					} else {
						var currentmods = studentModules.findOne({studentID: currentID}).codes;
						var id = studentModules.findOne({studentID: currentID})._id;
						currentmods.push(modcode);
						studentModules.update({
							_id: id
						}, {
							$set: {
								codes: currentmods
							}
						});
					}
				}
				alert("Module has been created!");
				Router.go('/dashboard');
			} else {
				console.log("result.status: "+result.status);
				alert("Module has failed to be created!");
			}
		});
	}
});

Template.editmodule.helpers({
	getModuleList: function() {
		return teacherModules.find({userID: Session.get('userID')});
	},
	setCounter: function() {
		Session.setPersistent('counter', []);
	},
	count: function() {
		return Session.get('counter');
	},
	getModule: function() {
		return teacherModules.findOne({_id: Session.get('modID')}).code;
	},
	getModuleName: function() {
		return teacherModules.findOne({_id: Session.get('modID')}).module;
	},
	getStudentList: function() {
		var x = teacherModules.findOne({_id: Session.get('modID')}).studentID;
		var y = x.split('\n');
		return y;
	}

});


Template.editmodule.events({
	'click #deletemod': function() {
		teacherModules.remove({_id: Session.get('modID')});
		alert("Module has been deleted!");
		Router.go('/dashboard');
	},
	'click #modname': function() {
		$.fn.editable.defaults.mode = 'inline';
		var modulecode = teacherModules.findOne({_id: Session.get('modID')}).code;
		var modid = teacherModules.findOne({code: modulecode})._id;

		$('#modname').editable({
	      	type: 'text',
		    title: 'Enter new module name',
		    success: function(response, newModName) {
		        teacherModules.update({
					_id: modid
				}, {
					$set: {
						module: newModName
					}
				});
				activityList.update({
					module: modulecode
				}, {
				$set: {
					name: newname
				}
			});
				
			flag = true;
			newModuleName = newModName;
			/*
		       editing to existing notebooks goes here
		    */
		    location.reload();
			}
		});
/*
		if(flag){
			activityList.update({
				module: modulecode
			}, {
				$set: {
					name: newname;
				}
			});
			flag_success = false;
		};
*/
	},
	'click .updateactlist': function(){
		$.fn.editable.defaults.mode = 'inline';
		var modulecode = teacherModules.findOne({_id: Session.get('modID')}).code;

		$('#updateactlist').editable({
	      	type: 'text',
		    title: 'Enter new module name',
		    success: function(response, newModName) {
		        activityList.update({
					module: modulecode
				}, {
				$set: {
					name: newModName
				}
				});
			}
		});
	}
});

Template.module.events({
	'click .modlist': function(e) {
		Session.setPersistent('modID', this._id);
		Router.go('/editmodule');
	}
});
Template.actbox.events({
	'click #viewact': function(e) {
		Session.setPersistent('aID', this.aID);
		Router.go('/session');
	}
});
Template.session.helpers({
	teach: function() {
		if (Session.get('userType') == 'teacher') {
			return true;
		} else {
			return false;
		}
	}
});
Template.teachersession.helpers({
	qlist: function() {
		var quest = questions.find({'aID': Session.get('aID')});
		var r = [];

		quest.forEach(function(question) {
			r.push(question);
		});
		Session.setPersistent('qnumber', r.length);
		return r;
	},
	aid: function() {
		return Session.get('aID');
	},
	getactqnum: function() {
		return Session.get('qnumber');
	/*	var a = questions.findOne({'aID': Session.get('aID')}).quest;
		console.log("a.length: " + a.length);
		console.log("qnumber " + Session.get('qnumber'));
		return a.length;
	*/	
	},
	getactmod: function() {
		return activityList.findOne({'aID': Session.get('aID')}).name;
	},
	getmodcode: function() {
		return activityList.findOne({'aID': Session.get('aID')}).module;
	},
	getactcode: function() {
		return activityList.findOne({'aID': Session.get('aID')}).activity;
	},
	getactnum: function() {
		var x = activityList.findOne({'aID': Session.get('aID')}).module;
		return teacherModules.findOne({'code': x}).studentID.split('\n').length;
	},
	qviewmain: function() {
		if (Session.get('qvselect') == '') {
			return 'None Selected';
		} else {
			var quest = questions.find({'aID': Session.get('aID')});
			var r = [];
			quest.forEach(function(question) {
				r.push(question.quest);
			});
			return r[Session.get('qvselect')];
		}
	},
	activitystatus: function() {
		if (Session.get('actstatus') == "inactive") {
			return 'Start Activity';
		} else {
			return 'Finish Activity';
		}
	},

	rlist: function() {
		return responses.find({aID: Session.get('aID')});
	},

	getdeployedq: function() {
		var count = deployedquestions.findOne({'aID': Session.get('aID')}).deployed;
		return count.length;
	}
});
Template.teachersession.events({
	'click .qbtn': function(event) {
		event.preventDefault();
		const target = event.target;
		var qid = target.id;
		qid = qid.slice(1);
		Session.set('qvselect', qid);
	},
	'click .qbtn2': function(event) {
		event.preventDefault();
		const target = event.target;

		var code = Session.get("accessToken");

		var qid = target.id;
		qid = qid.slice(1);

		var activity = Session.get('aID');
		var teacher = Session.get('userID');
		var teacher_cUser = teacher + '@u.nus.edu';
		var deployedSet = deployedquestions.find({aID: activity}).fetch();

		var quest = questions.find({'aID': Session.get('aID')});
		var r = [];
		quest.forEach(function(question) {
			r.push(question.quest);
		});
		var currentq = r[qid];
		var currentqid = questions.findOne({'quest': currentq})._id;
		
		var nbID = activityList.findOne({'aID': Session.get('aID')}).module;
		const pageObject = new PageObject(activity);

		console.log(qid + " " + currentq);
		pageObject.addQuestion(qid, currentq);

		console.log(nbID);
		var notebook_F_KEY = teacherModules.findOne({code: nbID}).notebook_F_KEY;
		console.log(notebook_F_KEY);
		var acttype = Session.get("acttype");
		console.log(acttype);
		console.log(Session.get('modID'));
		console.log(teacherModules.findOne({_id: Session.get('modID')}).code);
		var studentlist = teacherModules.findOne({_id: Session.get('modID')}).studentID;
		var studentarray = studentlist.split('\n'); 
		console.log(studentarray);

		if (acttype === "individual") {
			console.log("send");
			//sendPageToStudents: function(code, notebook_id, pageObject, sectionName)
			//sendQuestionIndividualStudents : function(code, notebook_id, questionSet, sectionName, pageName, cUser)
			Meteor.call('sendQuestionIndividualStudents', code, notebook_F_KEY, studentarray, pageObject, 'assignments', Session.get('aID'), teacher_cUser, function(error, result) {
				console.log(result);
				if (deployedSet.length == 0) {
			
					var quests = [currentq];
					deployedquestions.insert({teacherID: teacher, aID: activity, deployed: quests, time: new Date()});
					alert("Question has been deployed");

				} else {
					
					var currentdeployed = deployedquestions.findOne({aID: activity}).deployed;
					var id = deployedquestions.findOne({aID: activity})._id;

					currentdeployed.push(currentq);
					
					deployedquestions.update({
						_id: id
					}, {
						$set: {
							deployed: currentdeployed
						}
					});
					
					alert("Question has been deployed");
				}
				
				questions.update({
					_id: currentqid
				}, {
					$set: {
						deployState: true
					}
				});
					});
		} else {
			var questionSet = [];
	    	questionSet.push(new QuestionObject(qid,currentq));

		    Meteor.call('pushQuestionToCollabFull', code, notebook_F_KEY, Session.get('aID'), questionSet, teacher, function(err, result){
		      console.log(result);

		      if (deployedSet.length == 0) {
			
					var quests = [currentq];
					deployedquestions.insert({teacherID: teacher, aID: activity, deployed: quests, time: new Date()});
					alert("Question has been deployed");

				} else {
					
					var currentdeployed = deployedquestions.findOne({aID: activity}).deployed;
					var id = deployedquestions.findOne({aID: activity})._id;

					currentdeployed.push(currentq);
					
					deployedquestions.update({
						_id: id
					}, {
						$set: {
							deployed: currentdeployed
						}
					});
					
					alert("Question has been deployed");
				}
				
				questions.update({
					_id: currentqid
				}, {
					$set: {
						deployState: true
					}
				});
		    });
		}
		
	},
	'click .deployall': function(event) {

		event.preventDefault();

		var acttype = Session.get("acttype");

		var code = Session.get("accessToken");
		const target = event.target;
		var qid = target.id;
		qid = qid.slice(1);
		activity = Session.get('aID');
		teacher = Session.get('userID');

		//get questionList and deployed question
		var deployedSet = deployedquestions.find({aID: activity}).fetch();
		//var currentqlist = questions.find({'aID': Session.get('aID'), deployState: false}).fetch();
		var currentqlist = questions.find({'aID': Session.get('aID')}).fetch();
		console.log(currentqlist);
		var nbID = activityList.findOne({'aID': Session.get('aID')}).module;

		//format question to question set.
		var questionSet = [];
		for (var i = 0; i < currentqlist.length; i++) {
			questionSet.push(new QuestionObject(currentqlist[i].questIndex, currentqlist[i].quest));
		}

		var notebook_F_KEY = teacherModules.findOne({code: nbID}).notebook_F_KEY;

				
		//push page to student
		if (acttype === "individual") {
			Meteor.call('sendPageToStudents', code, notebook_F_KEY, pageObject, 'assignments', function(error, result) {
				console.log(result);

				if(result.status == 1){
					//successfully send question to students;

					for (var i = 0; i < currentqlist.length; i++) {
						deployedquestions.insert({
							teacherID: teacher, 
							aID: activity, 
							deployed: currentqlist[i].quest, 
							deployedQuestIndex : currentqlist[i].questIndex , 
							time: new Date()
						});
						
						questions.update({ 
							_id: currentqlist[i]._id}, 
							{$set: { deployState: true}
						});
					
					}
					alert("Question has been deployed");

				}else{
					alert("Something went wrong!");
				}
			});

		} else if (acttype === "collab") {
			Meteor.call('pushQuestionToCollabFull', code, notebook_F_KEY, activity, questionSet, teacher, function(err, result) {
				console.log(result);
				if(result.status == 1){
					//successfully send question to students;

					for (var i = 0; i < currentqlist.length; i++) {
						deployedquestions.insert({
							teacherID: teacher, 
							aID: activity, 
							deployed: currentqlist[i].quest, 
							deployedQuestIndex : currentqlist[i].questIndex , 
							time: new Date()
						});
						
						questions.update({ 
							_id: currentqlist[i]._id}, 
							{$set: { deployState: true}
						});
					
					}
					alert("Question has been deployed");

				}else{
					alert("Something went wrong!");
				}
			});
		}else{
			alert("Something went wrong!");
		}
	},
	'click #individual': function() {
		Session.setPersistent('acttype', 'individual');
	},
	'click #collab': function() {
		Session.setPersistent('acttype', 'collab');
	},
	'submit #addqform': function(e) {
		e.preventDefault();
		const target = event.target;
		var addQ = target.addition.value;
		//var old = questions.findOne({'aID': Session.get('aID')}).quest;
		//var id = questions.findOne({'aID': Session.get('aID')})._id;
		console.log(addQ);

		var quest = questions.find({'aID': Session.get('aID')});
		var r = [];
		var index=0;
		quest.forEach(function() {
			index++;
		});
		
		questions.insert({
				aID: Session.get('aID'),
				questIndex : index+1,
				quest: addQ,
				time: new Date(),
				deployState: false
		});
	},
	'click #togglestatus': function() {
		console.log("yo");
		var id = activityList.findOne({aID: Session.get('aID')})._id;
		var status = activityList.findOne({aID: Session.get('aID')}).status;

		console.log(status);

		if (status == 'active') {
			activityList.update({
				_id: id
			}, {
				$set: {
					status: 'inactive'
				}
			});
			Session.setPersistent('actstatus', 'inactive');
			Router.go('/dashboard');
		} else {
			activityList.update({
				_id: id
			}, {
				$set: {
					status: 'active'
				}
			});
			Session.setPersistent('actstatus', 'active');

      console.log("asd");

			var moduleCode = activityList.findOne({aID : Session.get('aID')}).module;
			console.log(moduleCode);

			var notebookDB_Id = teacherModules.findOne({code : moduleCode}).notebook_F_KEY;
			console.log(notebookDB_Id);
			console.log("start");
			var code = Session.get("accessToken");
			Meteor.call('addNewCollaborativeActivity', code, notebookDB_Id, Session.get('aID'), function(err, result){
		      console.log(result);
		    });
		}
	},

	'click #notibutton': function() {
		var noti = prompt("Type the message you want to send", "Have mercy");
		var modu = activityList.findOne({aID: Session.get('aID')}).module;
		var slist = teacherModules.findOne({code: modu}).studentID;
		var y = slist.split('\n');
		var z;
		for (z = 0; z < y.length; z++) {
			current = y[z];
			notifications.insert({studentID: current, module: modu, message: noti, status: 'unseen', time: new Date()});
		}
		alert("Notifications sent");
	},

	'click #respbutton' : function(){

	   //getIndividualAnswers
		var aId = Session.get('aID');
		var moduleCode = activityList.findOne({aID : Session.get('aID')}).module;
		var notebookDB_Id = teacherModules.findOne({code : moduleCode}).notebook_F_KEY;
		var code = Session.get("accessToken");
		var teacherID = Session.get("userID") + "@u.nus.edu";

		Meteor.call('getStudentsQuestions', code, notebookDB_Id, "assignments", Session.get('aID'), teacherID, function(err, result){
			console.log(result);
		/*	
		result = {};
		result.numberOfQuestion = 3;
		result.students = ["student1", "student2", "student3"];
		result.answers = 
		[ 
			["student 1 answer1", "student 2 answer1", "student 3 answer1"], 
			["student 1 answer2", "student 2 answer2", "student 3 answer2"], 
			["student 1 answer3", "student 2 answer3", "student 3 answer3"]
		]

	 	var answerSet = result;
	 	console.log(answerSet);
	 	var activityExists = responses.find({aID: "xxx"}).count();
	 	//var activityExists = teacherModules.find({code : moduleCode}).count();
	 	console.log(activityExists);
		/*
	 	if (activityExists > 0){
	 		console.log('true');
	 	} else { console.log('false');}
	 	*/

	 	var activityExists = responses.find({code : moduleCode}).count();
	 	var answerSet = result;
	 	console.log(activityExists);

	 	if(activityExists>0) {
	 		console.log("ififififif");
	 		responses.update({
		    	aID : aId,
		    },{
		    	$set: {
			    	numberOfQuestions: answerSet.numberOfQuestions,
		    		student: answerSet.studentList, 
			      	answers: answerSet.questionSet
		      	}
	    	});
	 	} else {
	 		console.log("elseelsesleselse");
	 		responses.insert({
		    	aID : aId,
		    	numberOfQuestions: answerSet.numberOfQuestions,
		    	student: answerSet.studentList, 
			    answers: answerSet.questionSet
	    	});
		}
	});
		
	//getCollabAnswers 
		var sections = SectionsDB.find({notebook_id: notebookDB_Id, name :Session.get('aID')}).fetch();
		console.log(sections);
		var sectionDB_id = sections[0]._id;
		
		Meteor.call('getStudentsCollabAnswers', code, teacherID, sectionDB_id, function(err, result){
		    	console.log('entered collab answers');
			 	var answerSet = result;
			 	var activityExists = groupresponses.find({aID: aId}).count();
			 	var this_id = groupresponses.findOne({aID: aId})._id
			 	console.log(result);
			 	console.log(answerSet);
			 	console.log(answerSet.data.numberOfQuestions);
			 	console.log(answerSet.data.studentList);
			 	console.log(answerSet.data.questionSet);

			 	if(activityExists>0) {
			 		groupresponses.update({
				    	_id : this_id,
				    },{
				    	$set: {
					    	numberOfQuestions: answerSet.data.numberOfQuestions,
				    		student: answerSet.data.studentList, 
					      	answers: answerSet.data.questionSet
				      	}
			    	});

			 	} else {
			 		groupresponses.insert({
				    	aID : aId,
				    	numberOfQuestions: answerSet.data.numberOfQuestions,
			    		student: answerSet.data.studentList, 
				      	answers: answerSet.data.questionSet
			    	});
				}
		    
		});	

		Router.go('/responses');
	},

});

Template.responses.helpers({

	getAID : function (){
		return Session.get('aID');
	},

	getResponses : function() {
		
		var answerSet = responses.find({aID: Session.get('aID')});
		var responseObject;
		var totalQns = answerSet.numberOfQuestion;
		console.log(answerSet.numberOfQuestion);
		console.log('entered');
		var noOfStudents = answerSet.students.length;
		var answers;
		console.log('entered');
		
		console.log(totalQns);
		console.log(noOfStudents);


		for (i=0; i<totalQns; i++){
			for (j=0; j<noOfStudents; j++){
				responseObject.question = i;
				responseObject.student = answerSet.students[j];
				responseObject.answer = answerSet.answers[i][j];
				console.log('entered for loop');
			}

			answers.push(responseObject);
		}
		console.log(answers);
		return answers;
	},

	getGroupResponses : function() {
		var answerSet = groupresponses.find({aID: Session.get('aID')});
		var responseObject;
		var totalQns = answerSet.numberOfQuestion;
		var noOfStudents = answerSet.students.length;
		var answers;

		for (i=0; i<totalQns; i++){
			for (j=0; j<noOfStudents; j++){
				responseObject.question = i;
				responseObject.student = answerSet.students[j];
				responseObject.answer = answerSet.answers[i][j];
			}

			answers.push(responseObject);
		}

		return answers;
	},
	/*
	isIndividual : function(){
		if (this.type == "individual"){
			return true;
		} else { return false; }
	},

	isCollab : function(){
		if (this.type == "collab"){
			return true;
		} else { return false; }
	},

	getStudentName : function(){
		return this.name;
	},
	*/

});


Template.studentsession.helpers({
	sqlist: function() {
		var a = deployedquestions.findOne({'aID': Session.get('aID')}).deployed;
		Session.setPersistent('qnumber', a.length);
		return a;
	},
	aid: function() {
		return Session.get('aID');
	},
	getactqnum: function() {
		return Session.get('qnumber');
	},
	getactmod: function() {
		return activityList.findOne({'aID': Session.get('aID')}).name;
	},
	getmodcode: function() {
		return activityList.findOne({'aID': Session.get('aID')}).module;
	},
	getactcode: function() {
		return activityList.findOne({'aID': Session.get('aID')}).activity;
	},
	getactnum: function() {
		var x = activityList.findOne({'aID': Session.get('aID')}).module;
		return teacherModules.findOne({'code': x}).studentID.split('\n').length;
	},
	qviewmain: function() {
		if (Session.get('sqvselect') == '') {
			return 'None Selected';
		} else {
			return deployedquestions.findOne({'aID': Session.get('aID')}).deployed[Session.get('sqvselect')];
		}
	},
	prlist: function() {
		return responses.find({
			aID: Session.get('aID'),
			studentID: {
				$ne: Session.get('userID')
			}
		});
	}
});
Template.studentsession.events({
	'click .sqbtn': function(event) {
		event.preventDefault();
		const target = event.target;
		var qid = target.id;
		qid = qid.slice(1);
		Session.set('sqvselect', qid);
	},
	'submit #respform': function(respe) {
		respe.preventDefault();
		const target = respe.target;
		var resp = target.responseadd.value;
		var id = Session.get('aID');
		var stuid = Session.get('userID');
		responses.insert({studentID: stuid, response: resp, aID: id, time: new Date()});
	}
});

//loginIVLE
function loginIVLE() {
	var APIKey = Session.get('APIKey');
	var APIDomain = Session.get('APIDomain');
	var APIUrl = Session.get('APIUrl');
	var returnURL = 'http://localhost:3000/dashboard';
	//var returnURL = 'http://classnote.meteorapp.com/dashboard';
	var LoginURL = APIDomain + "api/login/?apikey=6YIDjroMfeBjiTP49ms99&url=" + returnURL;
	var url = LoginURL;
	
	/*
	//getJSON not working find alternative coz returned object is not in JSON format
	jQuery.getJSON(url, function(data) {
		console.log('inside');
		Session.setPersistent('AuthToken', data);
		console.log('AuthToken: '+ Session.get('AuthToken'));
		console.log('data received - '+data);
	});
	*/
	
	Session.setPersistent('userState', "logged-in");
	location.assign(ivle.login(APIKey, returnURL));

	/*window.location = LoginURL;
	//getting AuthToken
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		console.log('entered xhttp');
	    if (this.readyState == 4 && this.status == 200) {
	       // Action to be performed when the document is read;
	       console.log('entered into readystate and status if loop');
	       //search for XML DOM and DOM Elements for more usable functions
	       	xmlDoc = this.responseXML;
	       	console.log(this);
	       	console.log(xmlDoc);
	       	console.log(this.responseXML);
		//	x = xmlDoc.getElementsByID("Token");
		//	console.log(x);
	    }
	};
	xhttp.open("GET", "filename", true);
	xhttp.send();*/
}
//function end

var Token = window.location.search.substr(1).split(/\&/)[0].slice(6);
Session.setPersistent("Token", Token);
Populate_UserId();
Populate_UserName();


//userName through IVLE
function Populate_UserName() {
	var APIKey = Session.get('APIKey');
	var APIDomain = Session.get('APIDomain');
	var APIUrl = Session.get('APIUrl');
	var token = Session.get('Token');
	var url = APIUrl + "UserName_Get?output=json&callback=?&APIKey=" + APIKey + "&Token=" + token;
	if (Session.get('setuserName') == 'No') {
		jQuery.getJSON(url, function(data) {
			Session.setPersistent('userName', data);
			Session.setPersistent('setuserName', 'Yes');
		});
	}
}
//function end
//userID through IVLE
function Populate_UserId() {
	var APIKey = Session.get('APIKey');
	var APIDomain = Session.get('APIDomain');
	var APIUrl = Session.get('APIUrl');
	var token = Session.get('Token');
	var url = APIUrl + "UserID_Get?output=json&callback=?&APIKey=" + APIKey + "&Token=" + token;
	if (Session.get('setID') == 'No') {
		jQuery.getJSON(url, function(data) {
			Session.setPersistent('userID', data);
			Session.setPersistent('setID', 'Yes');
		});
	}
}
//function end
//students in a module through IVLE
function Populate_StudentList(){
	var APIKey = Session.get('APIKey');
	var APIDomain = Session.get('APIDomain');
	var APIUrl = Session.get('APIUrl');
	//change to get authtoken
	var token = Session.get('Token');
	var courseID = Session.get('addmodcode');

	var url = APIUrl + "Class_Roster?APIKey=" + APIKey + "&AuthToken=" + token + "&CourseID=" + courseID;
	//https://ivle.nus.edu.sg/API/Lapi.svc/Class_Roster?APIKey={System.String}&AuthToken={System.String}&CourseID={System.String}

	if (Session.get('setID') == 'No') {
		jQuery.getJSON(url, function(data) {
			Session.setPersistent('students', data);
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
		this.questions.push(new QuestionObject(questionIndex, questionText));
	}
	getQuestions() {
		return this.questions;
	}
}
function logout() {
	Session.setPersistent('userState', 'logged-out');
	Session.setPersistent('userID', '');
	Session.setPersistent('userName', '');
	Session.setPersistent('userType', '');
	Session.setPersistent('UserType', '');
	Session.setPersistent('Token', '');
	Session.setPersistent('setID', 'No');
	Session.setPersistent('setuserName', 'No');
}
//Independent functions end
console.log("Welcome to ClassNote");
