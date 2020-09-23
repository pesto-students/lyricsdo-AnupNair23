function getLyrics() {
  window.location.hash = 'openModal'
  fetch('https://api.lyrics.ovh/v1/' + this.getAttribute('artist') + '/' + this.getAttribute('song'))
    .then(response => response.json())
    .then(data => {
      let songModal = document.getElementsByClassName("la-modal-view")[0]
      removeAllChildNodes(songModal)
      let headingLyric = document.createElement("h2")
      headingLyric.classList.add("la-modal-lyrics-heading")
      headingLyric.innerHTML = this.getAttribute('song') + " - " + this.getAttribute('artist') + " Lyrics" 
      songModal.appendChild(headingLyric)
      let songLyric = document.createElement("p")
      songLyric.classList.add("la-modal-song-lyrics")
      if (data.lyrics === "") {
        songLyric.innerHTML = "Lyrics not listed"
        songLyric.classList.add('la-lyrics-not-listed')
      }
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
  let tableBody = document.getElementById("la-songs-table-list")
  let topPicksDiv = document.getElementById("la-top-picks")

  removeAllChildNodes(topPicksDiv)
  removeAllChildNodes(tableBody)

  let artistName = document.forms["myForm"]["artist"].value
  if (artistName === "" || artistName.length < 4) {
    alert("Please search for artist name or song!");
    return false;
  }
  else {
    let tableHead = document.getElementById("la-songs-table-head")
    tableHead.classList.add('la-songs-table-head-show')
    let loaderDiv = document.getElementById("la-loader")
    loaderDiv.classList.add("show-loader")
    fetch('https://api.lyrics.ovh/suggest/' + artistName)
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('songData', JSON.stringify(data.data));
        for (let i = 4; i < data.data.length; i++) {
          let tableRowSong = document.createElement("tr");
          let tableColumn1 = document.createElement("td")
          tableColumn1.setAttribute('data-column', "First Name")
          tableColumn1.innerHTML = data.data[i].artist.name
          tableRowSong.appendChild(tableColumn1)
          let tableColumn2 = document.createElement("td")
          tableColumn2.setAttribute('data-column', "Last Name")
          tableColumn2.innerHTML = data.data[i].title_short
          tableRowSong.appendChild(tableColumn2)
          let tableColumn3 = document.createElement("td")
          tableColumn3.setAttribute('data-column', "Job Title")
          tableColumn3.classList.add('la-view-lyrics-text')
          tableColumn3.innerHTML = "View"
          tableColumn3.setAttribute('song', data.data[i].title_short)
          tableColumn3.setAttribute('artist', data.data[i].artist.name)
          tableColumn3.addEventListener("click", getLyrics, false);
          tableRowSong.appendChild(tableColumn3)
          tableBody.appendChild(tableRowSong)
        }

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
          loaderDiv.classList.remove("show-loader")

        }

      }).catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
      });
  }
}