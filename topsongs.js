// Imports ///////////////////////////////////////////////////////////////////////////////////////////////////
var mysql = require('mysql');
var connection = require('./connection.js');

var table = require('text-table');

var prompt = require('prompt');
var inquirer = require('inquirer');
var Spotify = require('spotify');


function mainPrompt() {
	inquirer.prompt(
	{
		'type': 'list',
		'message': 'Sup?',
		'choices': ['Song Search','Songs by Artist', 'Recurring Artists', 'Add Genre', 'Exit'],
		'name': 'choice'
	}).then(function(answers){

		switch (answers.choice) {
			case 'Song Search':

				songSearch();
				break;

			case 'Songs by Artist':

				songsByArtist();
				break;

			case 'Recurring Artists':

				recurringArtists();
				break;

			case 'Add Genre':

				spotifyGenre();
				break;

			case 'Exit':
				process.exit();
		}
	})
};

function recurringArtists() {

	connection.query('select artist, count(*) AS cnt from top5000 group by artist having cnt > 1' , function(err, res) {
		
		var dataToDisplay = [["\nName", "Times in Top 5000"], ['=====','========================']];


		// loop through the results of the database query and display items in a table
		for (i = 0; i < res.length; i++){

			var row = [];
			var artist = res[i];

			row.push(artist.artist, artist.cnt)

			dataToDisplay.push(row)
		};

		var display = table( dataToDisplay, {hsep:' | '})

		console.log(display);
		console.log('\n')

		mainPrompt();
	})
}


function songSearch() {
	inquirer. prompt(
	 {
	   type: "input",
	   name: "songName",
	   message: "What song are you looking for?"
	 }
	).then(function(answer){
	 	connection.query("SELECT * FROM top5000 WHERE song =?", [answer.songName],  function(err, res){
	    // console.log(res)

	    var dataToDisplay = [["\nID", "Song", "Artist", "Year", "Total Sales"], ['===', '==========','==========','======','==========']];


		// loop through the results of the database query and display items in a table
		for (i = 0; i < res.length; i++){

			var row = [];
			var song = res[i];

			row.push(song.position, song.song, song.artist, song.year, song.totalSales)

			dataToDisplay.push(row)
		};

		var display = table( dataToDisplay, {hsep:' | '})

		console.log(display);
		console.log('\n')

	    mainPrompt();
	   	})
	})
}

function songsByArtist(){
	inquirer. prompt(
	  {
	    type: "input",
	    name: "artistName",
	    message: "Which artist are you looking for?"
	  }
	).then(function(answer){
	  connection.query("SELECT * FROM top5000 WHERE artist =?", [answer.artistName],  function(err, res){
	      // console.log(res)

	      var dataToDisplay = [["\nID", "Song", "Year", "Total Sales"], ['===', '==========','======','==========']];


			// loop through the results of the database query and display items in a table
			for (i = 0; i < res.length; i++){

				var row = [];
				var song = res[i];

				row.push(song.position, song.song, song.year, song.totalSales)

				dataToDisplay.push(row)
			};

			var display = table( dataToDisplay, {hsep:' | '})

			console.log(display);
			console.log('\n')


	      mainPrompt();
	    })
	})
}

function spotifyGenre() {

	inquirer.prompt(
	{
		'name': 'song',
		'message': 'For what song?'
	}
	).then(function(answers) {

		Spotify.search({ type: 'track', query: answers.song }, function(error, data){

			console.log(data)

			var song = data.tracks.items[0];

			console.log(song)

		})
	})
}


	

mainPrompt();