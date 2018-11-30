$(document).ready(function(){
	var _url = "https://my-json-server.typicode.com/syahroelanwar/pwaapi/wisata";
	var dataResults = '';
	var catResults = '';
	var categories = [];

	function renderPage(data){
		$.each(data, function(key, items){
		_cat = items.location;

			dataResults += "<div>"
							+"<a href='detail.html?id="+items.id+"'><h4 class='tm-margin-b-20 tm-gold-text'>"+ items.name +"</h4></a>"
							+"<a href='detail.html?id="+items.id+"'><img class='lazy' src='img/image_placeholder.png' data-src='"+ items.foto +"' style='max-width:100%;' alt=''/></a><br/><hr/>"
							/*+"<p class='tm-margin-b-20'>Kota : "+ items.location +"</p>"
							+"<p class='tm-margin-b-20'>"+ items.description +"</p>" */
							
						"</div>";

			if($.inArray(_cat, categories) == -1){
				categories.push(_cat);
				catResults += "<option value'"+ _cat +"'>"+ _cat + "</option>";
			}
		})
		$('#wisata').html(dataResults);	
		$('#cat_select').html("<option value='all'>All</option>"+catResults);
	};

	var networkDataReceived = false;

	//fresh data from online
	var networkUpdate = fetch(_url).then(function(response){
		return response.json();
	}).then(function(data){
		networkDataReceived = true;
		renderPage(data);
	});

	//return data from cache
	caches.match(_url).then(function(response){
		if(!response) throw Error('No data on cache');
			return response.json();
	}).then(function(data){
		if(!networkDataReceived){
			renderPage(data);
			console.log('render data from cache');
		}
	}).catch(function(){
		return networkUpdate;
	});


		//filtering
	$("#cat_select").on('change', function(){
		updateWisata($(this).val());
	});

	function updateWisata(cat){
		var dataResults = '';
		var _newUrl = _url;
		if(cat != 'all')
			_newUrl = _url + "?location=" + cat;

		$.get(_newUrl, function(data){
			$.each(data, function(key, items){

				_cat = items.location;

			dataResults += "<div>"
							+"<a href='detail.html?id="+items.id+"'><h4 class='tm-margin-b-20 tm-gold-text'>"+ items.name +"</h4></a>"
							+"<a href='detail.html?id="+items.id+"'><img class='lazy' src='img/image_placeholder.png' data-src='"+ items.foto +"' style='max-width:100%;' alt=''/></a><br/><hr/>"
							/* +"<p class='tm-margin-b-20'>Kota : "+ items.location +"</p>"
							+"<p class='tm-margin-b-20'>"+ items.description +"</p>"*/

							
						"</div>";
			});
			$('#wisata').html(dataResults);
		})
	}

})

//Lazy Loading
window.onscroll = function(ev){
	lazyload();
};

function lazyload(){
	var lazyImage = document.getElementsByClassName('lazy');
	for(var i=0; i<lazyImage.length; i++){
		if(elementInViewport(lazyImage[i])){
			lazyImage[i].setAttribute('src',lazyImage[i].getAttribute('data-src'));
		}
	}
}
function elementInViewport(el){
	var rect = el.getBoundingClientRect();
	return(
		rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth));
}

//PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('serviceworker.js')
      .then(reg => { 
        console.log('Service worker registered!', reg);
      }) 
      .catch(err => {
        console.log('Service worker registration failed: ', err);
      });
  });
}
