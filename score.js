function createObserver() {
  var observer = new MutationObserver(function(mutations) {
   mutations.forEach(function(mutation) {
     var loadedLaterList = $('ul.soundList').get(0);
     var lazyLoaded = $('ul.lazyLoadingList__list').get(0);
     if (mutation.type === 'childList' && (mutation.target === loadedLaterList || mutation.target === lazyLoaded)) {
       mutation.addedNodes.forEach(function(song) {
         addScore(song);
       })
     }
   })
  });
  var target = document.body;
  var config = {attributes: true, childList: true, subtree: true, characterData: true};
  observer.observe(target, config);
}

function isPlaylist(song) {
  return $(song).find('.compactTrackList')[0];
}

function hasScore(song) {
  return $(song).find('ul.soundStats').children().length > 2;
}

function getPlays(song) {
  var songPlaysHTML = $(song).find('span.sc-ministats-plays').find('span.sc-visuallyhidden');
  return parsePlays(songPlaysHTML);
}

function parsePlays(playsElement) {
  var plays = $(playsElement).text();
  var str = plays.split(" ")[0];
  str = str.replace(/,/g, "");
  return parseFloat(str);
}

function getLikes(song) {
  var buttonLikesStr = $(song).find('button.sc-button-like').text();
  return parseLikes(buttonLikesStr);
}

function parseLikes(likeString) {
  var likes;
  if (likeString.includes("K")) {
    likes = parseFloat(likeString.split("K")[0]) * 1000;
  }
  else if (likeString.includes("M")) {
    reposts = parseFloat(likeString.split("M")[0]) * 1000000;
  }
  else {
    var str = likeString.replace(/,/g, "");
    likes = parseFloat(str);
  }
  return likes;
}

function getReposts(song) {
  var buttonRepostStr = $(song).find('button.sc-button-repost').text();
  return parseReposts(buttonRepostStr);
}

function parseReposts(repostString) {
  var reposts;
  if (repostString.includes("K")) {
    reposts = parseFloat(repostString.split("K")[0]) * 1000;
  }
  else if (repostString.includes("M")) {
    reposts = parseFloat(repostString.split("M")[0]) * 1000000;
  }
  else {
    var str = repostString.replace(/,/g, "");
    reposts = parseFloat(str);
  }
  return reposts;
}

function calculateSongScore(likes, reposts, plays) {
  console.log("Likes: " + likes + ", " + "Reposts: " + reposts + ", " + "Plays: " + plays);
  //return ((reposts / likes) * (plays / 1000)).toFixed(1);
  return (((likes + (5 * reposts)) / plays) * 1000).toFixed(1);
}

function replaceWindow() {
  document.write("Didn't find property.");
}

function getAllSongs() {
  return $('.soundList__item');
}

function addScore(song) {
  if (!isPlaylist(song)){
    var plays = getPlays(song);
    var reposts = getReposts(song);
    var likes  = getLikes(song);
    var score = calculateSongScore(likes, reposts, plays);
    // createHTMLElementWithScore();
    $(song).find("ul.soundStats").prepend('<li title="score" class="sc-ministats-item"><span class="sc-ministats sc-ministats-small sc-ministats-plays"><span class="sc-visuallyhidden"></span><span aria-hidden="true">' + score + '</span></span></li>');
  }
}

createObserver();
