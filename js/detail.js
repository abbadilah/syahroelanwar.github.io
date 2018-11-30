function getUrlParameters(parameter, staticURL, decode){
  var currLocation = (staticURL.length)? staticURL : window.location.search,
  parArr = currLocation.split("?")[1].split("&"),
  returnBool = true;

  for(var i = 0; i < parArr.length; i++){
    parr = parArr[i].split("=");
    if(parr[0] == parameter){
      return (decode) ? decodeURIComponent(parr[1]) : parr[1];
      returnBool = true;
    }else{
      returnBool = false;            
    }
  }
  if(!returnBool) return false;  
}

var idParameter = getUrlParameters("id", "", true);

function loadJSON(){
  fetch('https://my-json-server.typicode.com/syahroelanwar/pwaapi/wisata?id=' + idParameter)
  .then(function(response){
    return response.json();
  })
  .then(function(data){
    let html = '';
    data.forEach(function(wisata){
    html = `<h4 class='tm-margin-b-20 tm-gold-text'>${wisata.name}</h4>
            <img class='lazy' src='img/image_placeholder.png' data-src='${wisata.foto}' style='max-width:100%;' alt=''/>
            <p class='tm-margin-b-20'>Kota : ${wisata.location}</p>
            <p class='tm-margin-b-20'>${wisata.description}</p>`;
    });
    document.getElementById('detail').innerHTML = html;
  }).catch(function(){
    return caches.match('fallback.json')
  })
}

loadJSON();

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