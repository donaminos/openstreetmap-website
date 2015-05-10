
OSM.AlgoliaSearch = function() {

  var client = algoliasearch("A5DJCA01B4", "c2ba455c913eff7f8bf2673976599ca5");
  var index = client.initIndex('city-index');
  var page = {};

  page.pushstate = page.popstate = function(path) {
    var params = querystring.parse(path.substring(path.indexOf('?') + 1));
    var query = params.query; 
    $(".algolia_search_form input[name=as_query]").val(query);
    if(query && query != undefined){
      index.search(query,{hitsPerPage:10, aroundLatLngViaIP:false}, function (err, content){ 
        var  html = '<ul id="search_results">';
        if(err){
          html += '<li class="notfound">Hmm! Something went wrong... Please contact us at help@algolia.com.</li>';
        } else {
          if( content.hits.length === 0 ){
            html += '<li class="notfound">Are you sure this city exists?</li>';
          } else {
              content.hits.forEach(function (hit) {
                  // build url to visualize a city on the map :zoom/:latitude/:longitude
                  url = '/#map=12/'+ hit._geoloc.lat +'/' + hit._geoloc.lng;

                  html += '<li class="hit"><a href="'+ url +'"><span class="map-icon map-icon-position"></span>';
                  html += '<span class="city">' + hit._highlightResult.name.value + '</span>' ;
                  html += '<span class="country">' + hit.country_name + '</span></a></li>';
              });
          }
        }
        html += '</ul>';
        $('#sidebar_content').html(html);
      });
    }

  };

  page.load = function(){
    // no need for this callback
  }

  page.unload = function() {
    $(".algolia_search_form input[name=as_query]").val("");
  };

  return page;
};
