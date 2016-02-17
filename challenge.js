players = new Mongo.Collection('players');

if (Meteor.isClient) {
  Template.usersList.helpers({
  'username': function(){ 
    var currentUserId = Meteor.userId();
    return players.find({createdBy:currentUserId},{sort:{score:-1}}).fetch();
  },
  'selectedUser':function(){ 
      var currentId = this._id;
      var selectedId = Session.get('userId');
      if( currentId === selectedId ){
        return 'selected';
      } 
    }
  });
  Template.usersList.events({
    'click li':function(){
      var currentUser = this._id;
      Session.set('userId', currentUser);
    },
    'click .increment': function(){
      var selectedUser1 = Session.get('userId');
      players.update({ _id: selectedUser1 },{ $inc: {score:5} });
    },
    'click .remove':function(){
      var selectedPlayer = Session.get('userId');
      players.remove({ _id:selectedPlayer });
    }
  });
  Template.form.events({
    'submit form':function(e){
      e.preventDefault();
      var currentUserId = Meteor.userId();
      var playerNameVar = e.target.playerName.value;
      players.insert({
        name:playerNameVar,
        score:0,
        createdBy:currentUserId
      });
      e.target.playerName.value ="";
    }
  });
  Meteor.subscribe('thePlayers');
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
  Meteor.publish('thePlayers',function(){
    var currentUserId = this.userId;
    return players.find();
  });
}
