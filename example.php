
<!DOCTYPE html>
<html>
  
  <head>
    <title>HTML5 Audio Player </title>    
    <!-- Uncomment the following meta tag if you have issues rendering this page on an intranet site. -->    
    <!--  <meta http-equiv="X-UA-Compatible" content="IE=9"/> -->  
    <script type="text/javascript">
        // Global variable to track current file name.
        var currentFile = "";
        function playAudio() {
            // Check for audio element support.
            if (window.HTMLAudioElement) {
                try {
                    var oAudio = document.getElementById('myaudio');
                    var oAudio2 = document.getElementById('myaudio2');
                    var btn = document.getElementById('play'); 
                    var audioURL = document.getElementById('audiofile'); 
               

                    //Skip loading if current file hasn't changed.
                    if (audioURL.value !== currentFile) {
                        oAudio.src = "resources/01.Gentle.mp3";
                        oAudio2.src = "resources/se001.ogg";
                        currentFile = audioURL.value;                       
                    }

                    // Tests the paused attribute and set state. 
                    if (oAudio.paused) {
                                    if(typeof oAudio.loop == 'boolean'){
                                      oAudio.loop = true;
                                    }
                                    else{
                                      oAudio.addEventListener('ended', function(){
                                        this.currentTime = 0;
                                        this.play();
                                      }, false);
                                    }
                        oAudio.play();
                        oAudio2.play();
                        btn.textContent = "Pause";
                    }
                    else {
                        oAudio.pause();
                        oAudio2.pause();
                        btn.textContent = "Play";
                    }
                }
                catch (e) {
                    // Fail silently but show in F12 developer tools console
                     if(window.console && console.error("Error:" + e));
                }
            }
        }
             // Rewinds the audio file by 30 seconds.

        function rewindAudio() {
             // Check for audio element support.
            if (window.HTMLAudioElement) {
                try {
                    var oAudio = document.getElementById('myaudio');
                    oAudio.currentTime -= 30.0;
                }
                catch (e) {
                    // Fail silently but show in F12 developer tools console
                     if(window.console && console.error("Error:" + e));
                }
            }
        }

             // Fast forwards the audio file by 30 seconds.

        function forwardAudio() {

             // Check for audio element support.
            if (window.HTMLAudioElement) {
                try {
                    var oAudio = document.getElementById('myaudio');
                    oAudio.pause();
                    oAudio.src = "resources/02.Active.mp3";
                    oAudio.play();
                }
                catch (e) {
                    // Fail silently but show in F12 developer tools console
                     if(window.console && console.error("Error:" + e));
                }
            }
        }

             // Restart the audio file to the beginning.

        function restartAudio() {
             // Check for audio element support.
            if (window.HTMLAudioElement) {
                try {
                    var oAudio = document.getElementById('myaudio');
                    oAudio.currentTime = 0;
                }
                catch (e) {
                    // Fail silently but show in F12 developer tools console
                     if(window.console && console.error("Error:" + e));
               }
            }
        }
            
    </script>
  </head>
  
  <body>
    <p>
      <input type="text" id="audiofile" size="80" value="demo.mp3" />
    </p>
    <audio id="myaudio">
      HTML5 audio not supported
    </audio>
    <audio id="myaudio2">
      HTML5 audio not supported
    </audio>
    <button id="play" onclick="playAudio();">
      Play
    </button>
    
    <button onclick="rewindAudio();">
      Rewind
    </button>
    <button onclick="forwardAudio();">
      Fast forward
    </button>
    <button onclick="restartAudio();">
      Restart
    </button>

  </body>

</html>
