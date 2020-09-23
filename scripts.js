// fetch('https://jsonplaceholder.typicode.com/posts').then(function (response) {
//   // The API call was successful!
//   console.log('success!', response);
// }).catch(function (err) {
//   // There was an error
//   console.warn('Something went wrong.', err);
// });

function getLyrics(e, a) {
  console.log('e here -- ',this.getAttribute('song'), this.getAttribute('artist'))
  window.location.hash = 'openModal'
  fetch('https://api.lyrics.ovh/v1/'+this.getAttribute('artist')+'/'+this.getAttribute('song'))
    .then(response => response.json())
    .then(data => {
      let songModal = document.getElementsByClassName("la-modal-view")[0]
      removeAllChildNodes(songModal)
      console.log('data -- ', data.lyrics)
      let headingLyric = document.createElement("h2")
      headingLyric.classList.add("la-modal-lyrics-heading")
      headingLyric.innerHTML = "Lyrics of "+ this.getAttribute('song')
      songModal.appendChild(headingLyric)
      let songLyric = document.createElement("p")
      songLyric.classList.add("la-modal-song-lyrics")
      if(data.lyrics === "")
        songLyric.innerHTML = "Lyrics not listed"
      else
        songLyric.innerHTML = data.lyrics
      songModal.appendChild(songLyric)
    })
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}



function validateForm() {
  // e.preventDefault();
  let artistName = document.forms["myForm"]["artist"].value;
  let songName = document.forms["myForm"]["song"].value
  if (artistName === "" || songName === "") {
    alert("Please fill all the fields");
    return false;
  }
  else {
    fetch('https://api.lyrics.ovh/suggest/catalyst')
      .then(response => response.json())
      .then(data => {
        console.log('data -- ', data.data)
        localStorage.setItem('testObject', JSON.stringify(data.data));
        let songListDiv = document.getElementById("la-songs-list")
        // songListDiv = null
        removeAllChildNodes(songListDiv)
        for (let i = 0; i < data.data.length; i++) {
          let tableRowSong = document.createElement("tr");
          tableRowSong.innerHTML = 'Name: ' + data.data[i].title_short + ' ' + data.data[i].artist.name;
          songListDiv.append(tableRowSong)
        }
        console.log('list --- ', songListDiv)

        let topPicksDiv = document.getElementById("la-top-picks")
        for (let i = 0; i < 4; i++) {
          let topPick = document.createElement("div")
          topPick.classList.add("la-top-pick-div")
          topPick.classList.add("col-3")
          if (i % 2 === 0)
            topPick.classList.add('la-dark-green')
          let topPickImg = document.createElement("img")
          topPickImg.classList.add("la-top-pick-img")
          topPickImg.src = data.data[i].album.cover;
          topPick.appendChild(topPickImg)

          let topPickPara = document.createElement("p")
          topPickPara.classList.add("la-top-pick-song-details")
          topPickPara.innerHTML = data.data[i].title_short + " - " + data.data[i].artist.name

          let topPickAudio = document.createElement("audio")
          // topPickAudio.classList.add("")
          console.log('check -- ', topPickAudio)
          // topPickAudio.src = data.data[i].preview
          // var audio = document.getElementsByTagName('audio');
          // audio[0].load();
          // topPickAudio.audioTrackList.onaddtrack = function (event) {
          //   trackEditor.addTrack(data.data[i].preview);
          // };

          // topPickAudio.audioTracks.onaddtrack = function (event) {
          //   addToTrackList(data.data[i].preview);
          // };
          let topPickLyrics = document.createElement("p")
          topPickLyrics.classList.add("la-top-pick-view-lyrics")
          topPickLyrics.innerHTML = "View Lyrics"
          topPickLyrics.setAttribute('song', data.data[i].title_short)
          topPickLyrics.setAttribute('artist', data.data[i].artist.name)
          topPick.appendChild(topPickPara)
          topPickLyrics.addEventListener("click", getLyrics, false);
          // topPick.appendChild(topPickAudio)
          topPick.appendChild(topPickLyrics)
          topPicksDiv.appendChild(topPick)

        }
        console.log('list --- ', topPicksDiv)

      }).catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
      });

    // fetch('https://api.lyrics.ovh/suggest/stairway').then(function (response) {
    //   // The API call was successful!
    //   console.log('success!', response.json());
    //   localStorage.setItem('testObject', JSON.stringify(response.data));
    //   let songListDiv = document.getElementById("la-songs-list")

    //   for(let i = 0; i< response.data.length; i++) {
    //     let tableRowSong = document.createElement("tr");
    //     tableRowSong.innerHTML = 'Name: ' + data[i].firstName + ' ' + data[i].lastName;
    //     songListDiv.append(tableRowSong)
    //   }

    //   console.log('list --- ', songListDiv)
    // }).catch(function (err) {
    //   // There was an error
    //   console.warn('Something went wrong.', err);
    // });
  }
}