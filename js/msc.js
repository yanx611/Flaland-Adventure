

var dark = document.createElement('audio');   
var cossack = document.createElement('audio');
var kazanka = document.createElement('audio');
cossack.setAttribute('src','snd/cossack.wav');
dark.setAttribute('src', 'snd/8bit.wav');
kazanka.setAttribute('src','snd/kazanka.wav');

function darkeyes()

{
kazanka.pause();
cossack.pause();
dark.play();
dark.loop=true;
}

function cossacks ()
{ 
dark.pause();
kazanka.pause();      
cossack.play();
cossack.loop=true;
 }
 
 function kaza
 {
 dark.pause();
 cossack.pause();
 kazanka.play();
 kazanka.loop=true;
 }
 function muteall()
 
 {
 dark.pause();
 cossack.pause();
 kazanka.pause();
 }