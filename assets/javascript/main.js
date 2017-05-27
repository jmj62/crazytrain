
/*
 *	File:
 *		main.js
 *
 *	Description:
 *		the main program for the assignment "Train Schedule Manager"
 *
 *		this program uses the Firebase database system to save/retrieve
 *		trains coming in to the San Diego train station.
 *
 *	Author:
 *		Jon M. Jump
 *		May 2017
 *
 *	Comments:
 *		Not completed.
 */

 /*
  * The firebase config object provided by Firebase at the
  *	construction of the database called "catch-a-ride".
  *	See Firebase documentation -- console
  */
var config = {
	apiKey: 			"AIzaSyABYxx4LIVbqNsRO3J7PlcBqfFhIte2yOc",
	authDomain: 		"catch-a-ride-c74e3.firebaseapp.com",
	databaseURL: 		"https://catch-a-ride-c74e3.firebaseio.com",
	projectId: 			"catch-a-ride-c74e3",
	storageBucket: 		"catch-a-ride-c74e3.appspot.com",
	messagingSenderId: 	"591483535477"
};

/*
 *	Fire up Firebase database connection
 */
firebase.initializeApp(config);

// Variable to reference the database
var database = firebase.database();

/*
 *	Global Variables (not recommended) & their initial values
 */
var name = "";
var destination = "";
var time = 0;
var frequency = 0;

/*
 *	Func:
 *		Submit-Bttn.on("click")
 *
 *	Desc:
 *		The user is adding a new train to the Schedule
 */
$('#Submit-Bttn').on("click", function(e){

	// clear the default
	e.preventDefault();


	/*
	 *	Grab the train values submitted via the
	 *	Note:   I know more work needs to be done to verify user input.
	 */
	var name = $('#name').val().trim(),
	destination = $('#destination').val().trim(),
	time = $('#firstTrain').val().trim(),
	frequency = parseInt($("#frequency").val().trim());

	console.log(name, destination, time, frequency);

	//Push to Firebase
	database.ref().push({
		name 		: name,
		destination : destination,
		time 		: time,
		frequency 	: frequency,
		dateAdded	:firebase.database.ServerValue.TIMESTAMP
	})

	//Prevent the page from refreshing
	return false;

});


/*
 *	Func:
 *		database.ref().on( "child_added" )
 *
 *	Desc:
 *		set up the callback for the database to use when a new client
 *		attaches to our program.
 *
 *	Return:
 *		success or failure
 *
 */


function addChild( childAdded )
{
	var name = childAdded.val().name;
	var destination = childAdded.val().destination;
	var frequency = childAdded.val().frequency;
	var time = childAdded.val().time;

	//First Time (pushed back 1 year to make sure it comes before current time)
	var timeConverted = moment(time, "HH:mm").subtract(1, "years");
	// console.log(timeConverted);

	//Current Time
	var currentTime = moment();
	console.log("CURRENT TIME : " + moment(currentTime).format("hh:mm"));

	var diffTime = moment().diff( moment( timeConverted), "minutes");
	console.log("DIFFERENCE IN TIME: " + diffTime);

	//Time apart(remainder)
	var tRemainder = diffTime % frequency;
	console.log(tRemainder);

	//Minutes Until train
	tMinutesTillTrain = frequency - tRemainder;
	console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

	//Next Train
	var nextTrain = moment().add(tMinutesTillTrain, "minutes");
	console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm A"));

	var nexttime = moment(nextTrain).format("hh:mm A");

	var oneRow = $("<td>"); //")"<tr>";
	oneRow += "<td>" + name + "</td>";
	oneRow += "<td>" + destination + "</td>";
	oneRow += "<td>" + frequency + "</td>";
	oneRow += "<td>" + nexttime + "</td>";
	oneRow += "<td>" + tMinutesTillTrain + "</td>";
	oneRow += "</tr>";
	$("#Schedule-Table").append(oneRow);

	//Firebase watcher + initial loader HINT: .on("value")
	database.ref().orderByChild("dateAdded").on("child_added", displayError);
}
function AddChildFailed( errorObject )
{
	displayError( errorObject);
}

function displayError( errorObject )
{
	console.log( errorObject );
}
