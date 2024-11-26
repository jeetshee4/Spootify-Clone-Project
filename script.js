console.log("Let's Write some JavScript")
let currentSong = new Audio(); //Global Varible...and it is made an object so that one time only one song will be played

//Function to change secods to minutes
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60); // Get the whole minutes
    const remainingSeconds = Math.floor(seconds % 60); // Get the remaining seconds (rounded down)

    // Format with leading zero if less than 10
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
//Function to fetch the songs from the API
async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text()
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML=response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        let element = as[index];
        if(element.href.endsWith(".mp3"))
        {
            songs.push(element.href.split("/songs/")[1])

        }
        
    }
    
    return songs;

}

//Function that defines the things happen after I play a song
const playMusic = (track ,pause=false)=>{
    // let audio = new Audio("/songs/" + track);
    currentSong.src = "/songs/" + track;
    if(!pause)
    {
        currentSong.play()
        play.src="pause.svg";
    }

    document.querySelector(".songinfo").innerHTML =decodeURI(track)
    document.querySelector(".songtime").innerHTML ="00:00 / 00:00"

}













async function main()
{



    //Get the list of all the songs
    let songs = await getSongs()

    //Setting a song by defualt to play
    playMusic(songs[0],true)
    // console.log(songs)



    //Show all the songs in the playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20" ," ")} </div>
                                <div>Jeet Shee</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div>

                        </li>`;
    }

    //Attatch an Event Listener to Each Song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(element => {
        element.addEventListener("click",()=>{
            console.log(element.querySelector(".info").firstElementChild.innerHTML)
            playMusic(element.querySelector(".info").firstElementChild.innerHTML.trim());

        })
    });
    
    //Attatch an Event Listener to the Play ,previous and next Now Button
    play.addEventListener("click",()=>{
        if(currentSong.paused)
        {
            currentSong.play()
            play.src="pause.svg"
        }
        else
        {
            currentSong.pause()
            play.src="play.svg"
        }
    })


    //Listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        //Update the progress bar
        document.querySelector(".songtime").innerHTML=`${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        console.log(currentSong.currentTime,currentSong.duration)
        document.querySelector(".circle").style.left=((currentSong.currentTime/currentSong.duration)*100) + "%";
        });
    

    //Seek Event Listener
    document.querySelector(".seekbar").addEventListener("click",(e)=>{
        let percent=((e.offsetX/e.target.getBoundingClientRect().width)*100)
       document.querySelector(".circle").style.left=percent + "%";
       currentSong.currentTime=(currentSong.duration*percent)/100;
    })
}




main()



