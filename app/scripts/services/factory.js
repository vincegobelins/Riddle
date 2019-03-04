"use strict";

angular.module('RiddleApp').factory('riddleFactory', function($window, $location, $firebase, $firebaseArray, $firebaseObject, $firebaseAuth, $firebaseUtils, config) {
  return {

    /**
     * Get all exams
     * @return {Array}
     */

    getExams: function(callback) {

      var ref = firebase.database().ref().child("exams");

      ref.on('value', function(snapshot) {
        if(callback){
          callback(snapshot.val());
        }
      }, function(errorObject) {
        callback($firebaseObject(result));
      });

    },

    /**
     * Get an exam by id
     * @param {number} id Id of exam
     * @return {Array}
     */

    getExam: function(id) {

      var ref = firebase.database().ref().child('exams/' + id);
      return $firebaseObject(ref);

    },

    /**
     * Get questions of exam
     * @param {number} id Id of exam
     * @return {Array}
     */

    getQuestions: function(id) {

      var ref = firebase.database().ref().child('exams/' + id + '/questions');
      return $firebaseArray(ref);

    },

    /**
     * Get questions of exam
     * @param {number} id Id of exam
     * @return {Array}
     */

    getIntitules: function(id, idChapter, callback) {

      var intitules = [];

      var ref = firebase.database().ref().child('exams/' + id + '/questions');

      ref.on('value', function(snapshot) {
        if(callback){

          snapshot.forEach(function(data) {

            // Pour chacun des résultats, on garde en mémoire l'id de l'utilisateur et l'id du commentaire
            var chapter =  data.val().chapter;

            if (chapter == idChapter){
              intitules.push(data.val());
            }
          });


          callback(intitules);
        }
      }, function(errorObject) {
        callback($firebaseObject(result));
      });

    },

    /**
     * Get different part of exam
     * @param {number} id Id of exam
     * @return {Array}
     */

    getChapters: function(id) {

      var ref = firebase.database().ref().child('exams/' + id + '/parties');
      return $firebaseArray(ref);

    },

    /**
     * Add question to one quizz
     * @param {number} id Id of exam
     * @param {title} title Title of question
     * @param {author} author Author of question
     * @param {question} question Question
     * @param {answers} answers Answers
     * @param {answerok} answerok The good answer
     * @param {solution} solution Some explanations
     * @return {Boolean}
     */

    setQuestion: function(id, title, author, question, chapter, answers, answerok, solution, image) {

      var ref = firebase.database().ref().child('exams/' + id + '/questions');

      ref.push({
          'titre': title, 'autheur': author, 'question': question, 'chapter': chapter, 'reponses': answers, 'reponseok': answerok, 'solution': solution, 'image': image, 'score': 0
        });

    },

    /**
     * Register a new account
     * @param {String} email User e-mail
     * @param {String} password User password
     * @return {Boolean}
     */

    setAccount : function(email, password, name, surname, photo){

      var auth = $firebaseAuth();
      auth.$createUserWithEmailAndPassword(email, password).then(function(userData) {
        console.log('User created with uid: ' + userData.uid);

        var user = {exam: name,
          'prenom': surname,
          'photo': photo,
          'exams': ''}

        firebase.database().ref().child('users/'+userData.uid).set(user);


        /*
        result_array.$add({
          uid: {
            'nom': name,
            'prenom': surname,
            'photo': photo,
            'exams': ''
          }
        }).then(function(result) {
          return result.data;
        });*/

      }).catch(function(error) {
        console.log(error);
        return 'coucou';
      });
    },

    /**
     * Get user account
     * @param {String} idUser Unique user id
     * @return {Array}
     */

    getAccount : function(idUser, callback){
      var ref = firebase.database().ref().child('users/' + idUser);

      ref.on('value', function(snapshot) {
        if(callback){
          callback(snapshot.val());
        }
      }, function(errorObject) {
          callback($firebaseObject(result));
      });
    },

    /**
     * Login
     * @param {String} email User e-mail
     * @param {String} password User password
     * @return {Boolean}
     */

    login : function(email, password){
      var auth = $firebaseAuth();
      auth.$signInWithEmailAndPassword(email, password).then(function(authData) {
        $location.path('/hello');
        $window.localStorage.setItem('user',authData.uid);
        console.log('Logged in as:', authData.uid);
      }).catch(function(error) {
        console.error('Authentication failed:', error);
      });
    },

    /**
     * Log out
     * @return {void}
     */

    logout : function(){

      var auth = $firebaseAuth();
      auth.$signOut().then(function() {
        console.log('logout success');
        $window.localStorage.setItem('user', false);
      }, function(error) {
        console.log(error);
      });

    },

    /**
     * Return Authentication reference
     * @return {Object} Firebase Authentication Reference
     */

    auth : function(){

      return $firebaseAuth();
    },

    /**
     * Return Authentication reference
     * @return {Object} Firebase Authentication Reference
     */

    getAuth : function(){
      return $window.localStorage.getItem('user');
    },

    /**
     * Get users result and personalisation (responses and favorites)
     * @param {number} id Id of exam
     * @return {Array}
     */

    getUserQuestion: function(idUser, idExam) {

      var ref = firebase.database().ref().child('users/' + idUser + '/exams/' + idExam);
      return $firebaseArray(ref);

    },

    /**
     * Set an empty result array for each user for specific exam
     * @param {String} idUser Unique id of user
     * @param {String} idExam Unique id of exam
     */

    setUserQuestion : function(idUser, idExam, idQuestion, answer){
      var exam = ({question : answer});

      var ref = firebase.database().ref().child('users/'+idUser+'/exams/'+idExam+'/'+idQuestion);
      ref.update(exam);
    },

    /**
     * Set user favorite questions
     * @param {String} idUser Unique id of user
     * @param {String} idExam Unique id of exam
     * @param {String} idQuestion Unique id of question
     */

    setUserFavorite : function(idUser, idExam, idQuestion){
      var favorite = ({favorite : 'true'});

      var ref = firebase.database().ref().child('users/'+idUser+'/exams/'+idExam+'/'+idQuestion);
      ref.update(favorite);
    },

    /**
     * Send comment about a question
     * @param {String} idUser Unique id of user
     * @param {String} idExam Unique id of exam
     * @param {String} idQuestion Unique id of question
     * @param {String} comment Unique id of question
     */

    setComment : function(idUser, idExam, idQuestion, comment){
      var timestamp = new Date().getTime();
      var comment = ({comment : comment, user : idUser, date : timestamp});
      //result.child('users/'+idUser+'/exams/'+idExam+'/'+idQuestion+'/commentaires').push(comment);

      var ref = firebase.database().ref().child('exams/' + idExam + '/questions/' + idQuestion + '/commentaires');
      ref.push(comment);
    },

    /**
     * Get all comments by question
     * @param {String} idUser Unique id of user
     * @param {String} idExam Unique id of exam
     * @param {String} idQuestion Unique id of question
     * @param {String} comment Unique id of question
     */

    getComments : function(idExam, idQuestion, callback){

      var result = firebase.database().ref().child('exams/' + idExam + '/questions/' + idQuestion + '/commentaires');

      var _self = this;

      // Declaration du tableau de commentaires
      var comments = [];

      result.once('value', function(snapshot) {
        if(callback){
          //console.log('callback :'+$firebaseArray(result));
          snapshot.forEach(function(data) {
            // Pour chacun des résultats, on garde en mémoire l'id de l'utilisateur et l'id du commentaire
            var authorId =  data.val().user;
            var commentKey = Object.keys(data)[0];

            // Requête pour récupérer l'utilisateur associé à l'id utilisateur
            _self.getAccount(authorId, function(result2){
                comments.push({'author' : result2, 'content' : data.val(), 'key':commentKey});
            });
          });

          callback(comments);
          console.log(comments);
        }
      }, function(errorObject) {
        callback($firebaseObject(result));
      });

      //return resultArray;


    },

    /**
     * Indent or decrement the score of a question
     * @param {String} idExam Unique id of exam
     * @param {String} idQuestion Unique id of question
     * @param {Integer} New score value
     */

    updateQuestionScore : function(idExam, idQuestion, newScore){
      var score = ({score : newScore});
      var ref = firebase.database().ref().child('exams/' + idExam + '/questions/' + idQuestion);
      ref.update(score);
    }


  };
});
