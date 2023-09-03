


//old stuff but now just hides scrollbar
function openEnterScreen() {
	document.getElementsByTagName("body")[0].style.overflow = "hidden";
};

//transition effect
function transitionScreen(){
	screenCover = document.getElementById('transitionScreen');
	screenCover.style.opacity = .25;
	screenCover.style.display = "block";
	setTimeout(()=>{
		screenCover.style.opacity = 0;
	}, 300);
	setTimeout(()=>{
		screenCover.style.display = "none";
	}, 800);
};

//fades out splash screen and hides it
function closeEnterScreen(){
	document.getElementsByTagName("body")[0].style.overflow = "auto";
	screenCover = document.getElementById("screenCover")
	screenCover.style.opacity = 0;
	setTimeout(()=>{
		screenCover.style.display = "none";
	}, 500);
	//plays music
	mainMusic.loop = true;
	if (readCookie('muteMusic') === 'true') {
		console.log('mute pref = muted');
		document.getElementsByClassName('playbackButton')[0].style.backgroundImage = "url('./res/notVibing.gif')";
	} else {
		mainMusic.play();
	};
};


//runs on page load
window.onload = function(){
  openEnterScreen();
  loadPageContents(uri);
};



//music
let mainMusic = new Audio('./res/CoaXioNLowSampleRate.ogg');
let click = new Audio('./res/click.mp3');

function music() {
	if (mainMusic.paused === false){
		mainMusic.pause();
		document.getElementsByClassName('playbackButton')[0].style.backgroundImage = "url('./res/notVibing.gif')";
		writeCookie('muteMusic', 'true');
	} else {
		mainMusic.play();
		document.getElementsByClassName('playbackButton')[0].style.backgroundImage = "url('./res/vibing.gif')";
		deleteCookie('muteMusic');
	}
};


function clickSound(){
	click.play();
};


//page switching
pageHtml = "";

url = window.location.href;

uri = url.substring(url.search("=") +1 , url.length);

firstLoad = true;

function loadPageContents(name) {
	if (firstLoad === false){
	//funny effects
	transitionScreen();
	clickSound();
	};
	firstLoad = false;
	//changes url
	const url = new URL(window.location);
	url.searchParams.set('', [name]);
	window.history.pushState({}, '', url);
	if (name === 'home' || name === 'deathmatch_classic_refragged' || name === 'lambda_fortress' || name === 'the_espionage_project' || name === 'error'){
		//fetches html file
		fetch("./" + [name] + ".html")
		.then(response => response.text())
		.then(text => pageHtml = text)
		.then(enact => {
			let stage = document.getElementById("infoCards");
			stage.innerHTML = pageHtml;
			pageSpecificChanges(name);
			retreiveBlogList();
			window.scrollTo(0, 0);
		});
	//for fetching blog pages
	} else if(name.search('-') > -1){
		postName = name.substring(name.search("-") + 1, name.length);
		game = name.substring(0, name.search("-"));
		//normal page fetch but it puts it in a card
		fetch("./blogs/" + game + "/" + postName + ".html")
		.then(response => response.text())
		.then(text => pageHtml = text)
		.then(enact => {
			let stage = document.getElementById("infoCards");
			stage.innerHTML = '';
			let newCard = document.createElement("div");
			newCard.classList.add("infoCard");
			newCard.innerHTML = pageHtml;
			stage.appendChild(newCard);
			pageSpecificChanges(game);
			retreiveBlogList();
			window.scrollTo(0, 0);
		});
	} else {
		const url = new URL(window.location);
		url.searchParams.set('', 'home');
		window.history.pushState({}, '', url);
		firstLoad = true;
		loadPageContents('home');
	};
};

function pageSpecificChanges(page){
	switch(page){
		case "home":
			//just to make home look more normal, i got rid of its search parameter
			const url = new URL(window.location);
			url.searchParams.delete('');
			window.history.pushState({}, '', url);
			resetIcons();
			break;
		case "error":
			resetIcons();
			break;
		case "deathmatch_classic_refragged":
			resetIcons();
			icon = document.getElementById("dmcrIcon");
			icon.style.backgroundImage = "url('./res/dmcrIcon.png')";
			break;
		case "lambda_fortress":
			resetIcons();
			icon = document.getElementById("lfIcon");
			icon.style.backgroundImage = "url('./res/lfIcon.png')";
			break;
		case "the_espionage_project":
			resetIcons();
			icon = document.getElementById("tepIcon");
			icon.style.backgroundImage = "url('./res/tepIcon.png')";
			break;
		default:
			resetIcons();
			break;
	};
};

//i stole this code so idk. it changes the page when you use the browser to navigate back a page but doesnt work well.
/*window.addEventListener('popstate', function(event) {
  loadPageContents(url.substring(url.search("=") +1 , url.length));
  clickSound();
  transitionScreen();
  console.log('Browser back button was pressed');
});*/

function retreiveBlogList(){
	//for building blog lists
	let fullBlogList = {};
	if (document.getElementsByClassName("blogPostList")[0] != undefined){
		fetch("./blogs/bloglist.json")
		.then(response => response.json())
		.then(json => fullBlogList = json)
		.then(bruh => {console.log(fullBlogList); buildBlogList()});
	};
	//what to do if
	function buildBlogList(){
		let postListElement = document.getElementsByClassName("blogPostList")[0];
		let blogType = postListElement.id;
		let blogTypeName = '';
		switch(blogType){
			case "dmcrList":
				blogTypeName = 'deathmatch_classic_refragged';
				break;
		};
		let totalPostCount = fullBlogList[blogTypeName].length;
		for (let i = 0; i <= totalPostCount -1; i++){
			console.log(i);
			let post = document.createElement("div");
			post.classList.add("postPreview");
			let thumbnail = document.createElement("img");
			thumbnail.src = fullBlogList[blogTypeName][i].thumbnailUrl;
			post.appendChild(thumbnail);
			let previewTextDiv = document.createElement("div");
			previewTextDiv.classList.add("postPreviewText");
			let title = document.createElement("h2");
			title.innerHTML = fullBlogList[blogTypeName][i].title;
			let postUrl = fullBlogList[blogTypeName][i].contentUrl;
			title.setAttribute('onclick', "loadPageContents('" + postUrl + "')");
			previewTextDiv.appendChild(title);
			let date = document.createElement("p");
			date.innerHTML = fullBlogList[blogTypeName][i].date;
			previewTextDiv.appendChild(date);
			let description = document.createElement("p");
			description.innerHTML = fullBlogList[blogTypeName][i].description;
			previewTextDiv.appendChild(description);
			post.appendChild(previewTextDiv);
			post.style.order = -i;
			postListElement.appendChild(post);
		};
	};
};



//resets icon styles
function resetIcons(){
	dmcrIcon = document.getElementById("dmcrIcon");
	lfIcon = document.getElementById("lfIcon");
	tepIcon = document.getElementById("tepIcon");
	dmcrIcon.style.backgroundImage = "url('./res/dmcrIconGrey.png')";
	lfIcon.style.backgroundImage = "url('./res/lfIconGrey.png')";
	tepIcon.style.backgroundImage = "url('./res/tepIconGrey.png')";
};

//mobile scroll physics
if (screen.width < 1053){
	window.onscroll = function(e) {
	  // print "false" if direction is down and "true" if up
	  let scrollingDown = this.oldScroll < this.scrollY;
	  this.oldScroll = this.scrollY;
	  console.log(scrollingDown);
	  if (scrollingDown === true){
		  document.getElementsByClassName('topBar')[0].style.top = '-100px';
	  } else {
		  document.getElementsByClassName('topBar')[0].style.top = '0px';
	  };
	};
};


//cookie functions borrowed from boxkid.net

function writeCookie(name, property) {
    document.cookie = name + '=' + property + ';expires=Thu, 01 Jan 2030 00:00:00 GMT;path=/';
};

function readCookie(name) {
	if (document.cookie !== '') {
	    let allCookies = document.cookie.split('; ');
		let cookie = allCookies.find(row => row.startsWith(name + '='));
		if (cookie) {
			let cookieValue = cookie.split('=')[1];
			return cookieValue;
		} else {
			return false;
		};
	};
};
function deleteCookie(name) {
	document.cookie = name + '=' + ';expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'; 
}
function clearCookies() {
	let allCookies = document.cookie.split('; ');
	for (var i = 0; i < allCookies.length; i++) {
		deleteCookie(allCookies[i]);
	};
};