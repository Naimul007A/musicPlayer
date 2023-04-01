$(document).ready(function () {
  // Select all the elements in the HTML page
  // and assign them to a variable
  let nowPlaying = $(".nowPlaying");
  let trackArt = $(".track-art");
  let trackName = $(".track-name");
  let trackArtist = $(".track-artist");
  //track buttons
  let prve_Track = $(".prevTrack");
  let play_Pause = $(".playPause");
  let next_Track = $(".nextTrack");
  //slider info
  let currTime = $(".current-time");
  let totalDuration = $(".total-duration");
  let seekSlider = $(".seekSlider");
  let volumeSlider = $(".volume_slider");

  // Specify globally used values
  let track_index = 0;
  let isPlaying = false;
  let updateTimer;
  // Create the audio element for the player
  var curr_track = document.createElement("audio");

  // Define the list of tracks that have to be played
  let track_list = [
    {
      name: "Dishehara Tui",
      artist: "unknow",
      image: "https://source.unsplash.com/Qrspubmx6kE/640x360",
      path: "/music/Dishehara Tui .mp3",
    },
    {
      name: "Deshpactio",
      artist: "Broke For Free",
      image: "https://source.unsplash.com/Qrspubmx6kE/640x360",
      path: "/music/deshpacito.mp3",
    },
    {
      name: "Enemy",
      artist: "Tours",
      image: "https://source.unsplash.com/Qrspubmx6kE/640x360",
      path: "/music/enemy.mp3",
    },
    {
      name: "Feelings - Vatsala",
      artist: "Sumit Goswami",
      image: "https://i.ytimg.com/vi/ZMLoJEgI2mY/mqdefault.jpg",
      path: "/music/feelings.mp3",
    },
  ];
  //load music and fuction
  function loadTrack(track_index) {
    // Clear the previous seek timer
    clearInterval(updateTimer);
    resetValues();

    // Load a new track
    curr_track.src = track_list[track_index].path;
    curr_track.load();

    // Update details of the track

    trackArt.css(
      "background-image",
      "url(" + track_list[track_index].image + ")"
    );

    nowPlaying.text(
      "PLAYING" + " " + (track_index + 1) + " OF " + track_list.length
    );
    trackName.text(track_list[track_index].name);
    trackArtist.text(track_list[track_index].artist);
    // Set an interval of 1000 milliseconds
    // for updating the seek slider
    updateTimer = setInterval(seekUpdate, 1000);

    // Apply a random background color
    random_bg_color();
  }
  function random_bg_color() {
    // Get a random number between 64 to 256
    // (for getting lighter colors)
    let red = Math.floor(Math.random() * 256) + 64;
    let green = Math.floor(Math.random() * 256) + 64;
    let blue = Math.floor(Math.random() * 256) + 64;

    // Construct a color with the given values
    let bgColor = "rgb(" + red + ", " + green + ", " + blue + ")";

    // Set the background to the new color
    $("*").css("background-color", bgColor);
  }
  // Function to reset all values to their default
  function resetValues() {
    currTime.text("00:00");
    totalDuration.text("00:00");
    seekSlider.val(0);
  }
  play_Pause.on("click", function () {
    // Switch between playing and pausing
    // depending on the current state
    if (!isPlaying) playTrack();
    else pauseTrack();
  });

  function playTrack() {
    // Play the loaded track
    curr_track.play();
    isPlaying = true;

    // Replace icon with the pause icon
    play_Pause.html('<i class="fa fa-pause-circle fa-5x"></i>');
  }
  function pauseTrack() {
    // Pause the loaded track
    curr_track.pause();
    isPlaying = false;

    // Replace icon with the play icon
    play_Pause.html('<i class="fa fa-play-circle fa-5x"></i>');
  }
  next_Track.on("click", function () {
    // Go back to the first track if the
    // current one is the last in the track list
    if (track_index < track_list.length - 1) track_index += 1;
    else track_index = 0;

    // Load and play the new track
    loadTrack(track_index);
    playTrack();
  });
  // Move to the next track if the current finishes playing
  // using the 'ended' event
  $(curr_track).on("ended", function () {
    // Go back to the first track if the
    // current one is the last in the track list
    if (track_index < track_list.length - 1) track_index += 1;
    else track_index = 0;

    // Load and play the new track
    loadTrack(track_index);
    playTrack();
  });

  prve_Track.on("click", function () {
    // Go back to the last track if the
    // current one is the first in the track list
    if (track_index > 0) track_index -= 1;
    else track_index = track_list.length - 1;

    // Load and play the new track
    loadTrack(track_index);
    playTrack();
  });

  //slider
  seekSlider.on("change", function () {
    // Calculate the seek position by the
    // percentage of the seek slider
    // and get the relative duration to the track
    seekto = curr_track.duration * (seekSlider.val() / 100);

    // Set the current track position to the calculated seek position
    curr_track.currentTime = seekto;
  });
  volumeSlider.on("change", function () {
    // Set the volume according to the
    // percentage of the volume slider set
    curr_track.volume = volumeSlider.val() / 100;
  });
  function seekUpdate() {
    let seekPosition = 0;

    // Check if the current track duration is a legible number
    if (!isNaN(curr_track.duration)) {
      seekPosition = curr_track.currentTime * (100 / curr_track.duration);
      seekSlider.val(seekPosition);

      // Calculate the time left and the total duration
      let currentMinutes = Math.floor(curr_track.currentTime / 60);
      let currentSeconds = Math.floor(
        curr_track.currentTime - currentMinutes * 60
      );
      let durationMinutes = Math.floor(curr_track.duration / 60);
      let durationSeconds = Math.floor(
        curr_track.duration - durationMinutes * 60
      );

      // Add a zero to the single digit time values
      if (currentSeconds < 10) {
        currentSeconds = "0" + currentSeconds;
      }
      if (durationSeconds < 10) {
        durationSeconds = "0" + durationSeconds;
      }
      if (currentMinutes < 10) {
        currentMinutes = "0" + currentMinutes;
      }
      if (durationMinutes < 10) {
        durationMinutes = "0" + durationMinutes;
      }

      // Display the updated duration
      currTime.text(currentMinutes + ":" + currentSeconds);
      totalDuration.text(durationMinutes + ":" + durationSeconds);
    }
  }
  // Load the first track in the tracklist
  loadTrack(track_index);
});
