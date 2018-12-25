function NestoriaAPI() {
    var globalParams = {
        encoding: "json",
        pretty: 1,
        action: "search_listings",
        country: "" 
    };

    var locationParams = {
        place_name: "",
        south_west: "",
        north_east: "",
        centre_point: "",
        radius: "" 
    };

    var filterParams = {
        listing_type: "",
        price_min: "",
        price_max: "",
        bedroom_min: "",
        bedroom_max: "",
        room_min: "",
        room_max: "",
        bathroom_min: "",
        bathroom_max: "",
        keywords: "",
        keywords_exclude: "",
        has_photo: "",
        updated_min: ""
    };

    var sort = [
        "relevancy", 
        "bedroom_lowhigh", 
        "bedroom_highlow", 
        "price_lowhigh", 
        "price_highlow", 
        "newest",
        "oldest",
        "random",
        "distance"
    ];

    var listElement;
    var errorElement;
    var paginatorElement;
    var country;
    var nextElement;
    var prevElement;
    var listings;

    //save context
    var nestoria = this;

    var paginator = {
        currentPage: 1,
        totalPages: 0,
        totalResults: 0
    }


    var parseResponse = function(response) {
        console.log(response.status_code);
        errorElement.innerHTML = "";
        listElement.innerHTML = ""; 
        if(response.status_code !== "200") {
            console.log(response.status_text);
            errorElement.innerHTML = response.status_text;
            listElement.innerHTML = "Result not found.";    
        } else {
            paginator.currentPage = response.page;
            paginator.totalPages = response.total_pages;
            paginator.totalResults = response.total_results;
            return response.listings;
        }
    }

    var render = function(listings) {
        console.log("render listings=");  
        console.log(listings); 
        listElement.innerHTML = "";
        paginatorElement.style.visibility = "visible";
        paginatorElement.querySelector("#page").innerHTML = paginator.currentPage;
        paginatorElement.querySelector("#total").innerHTML = paginator.totalPages;
        for (var i = 0; i < listings.length; i++) {
            var li = document.createElement('li');
            li.id = i;
            li.onclick = function() {
                showModal(listings[this.id]);
            }
            li.innerHTML = listings[i]["title"] + 
                            " <b>Type:</b> " + listings[i]["property_type"] + 
                            ", <b>Price:</b> " + listings[i]["price_formatted"];
            listElement.appendChild(li);
        }

        function showModal(listing) {
            var modal = document.getElementById('nestoria-modal');
            var spanClose = document.getElementsByClassName("close")[0];
            var title = document.getElementById("title");
            title.innerHTML = listing["title"];
            var imgUrl = document.getElementById("img_url");
            imgUrl.src = listing["img_url"];
            var priceFormatted = document.getElementById("price_formatted");
            priceFormatted.innerHTML = listing["price_formatted"];
            var propertyType = document.getElementById("property_type");
            propertyType.innerHTML = listing["property_type"];
            var summary = document.getElementById("summary");
            summary.innerHTML = listing["summary"];
            var listerUrl = document.getElementById("lister_url");
            listerUrl.href = listing["lister_url"];
            listerUrl.innerHTML = "detail url";
            modal.style.display = "block";

            spanClose.onclick = function() {
                modal.style.display = "none";
            }

            window.onclick = function(event) {
                if (event.target == modal) {
                  modal.style.display = "none";
                }
            }
        }    
    }

    this.init = function(elementId, errorElementId) {
        listElement = document.getElementById(elementId); 
        errorElement =  document.getElementById(errorElementId);
        paginatorElement = document.createElement("div");
        paginatorElement.className = "paginator";
        listElement.parentNode.insertBefore(paginatorElement, listElement.nextSibling);
        paginatorElement.innerHTML = "<a href='#' id='prev'>&laquo;Prev</a>&nbsp;&nbsp;" + 
        "Page <span id='page'>" + paginator["currentPage"] + 
       "</span> of <span id='total'>" + paginator["totalPages"] +
       "</span>&nbsp;&nbsp;<a href='#' id='next'>Next&raquo;</a>";
        paginatorElement.style.visibility = "hidden";

        nextElement = document.getElementById("next");
        prevElement = document.getElementById("prev"); 

        nextElement.addEventListener('click', function() {
            paginator.currentPage++;
            if(paginator.currentPage > paginator.totalPages) {
                paginator.currentPage = paginator.totalPages;    
            }
            nestoria.getSearchListings(country);    
        }); 
        prevElement.addEventListener('click', function() {
            paginator.currentPage--;
            if(paginator.currentPage < 1) {
                paginator.currentPage = 1;    
            }
            nestoria.getSearchListings(country);    
        }); 
    }

    this.resetPaginator = function() {
        paginator.currentPage = 1;
        paginator.totalPages = 0;
        paginator.totalResults = 0;    
    }

    this.getServers = function() {
        return servers;
    }

    this.getLocationParams = function() {
        return locationParams;
    }

    this.setLocationParams = function(params) {
        for (var key in params) {
            locationParams[key] = params[key];
        }       
    }

    this.getFilterParams = function() {
        return filterParams;
    }

    this.setFilterParams = function(params) {
        for (var key in params) {
            filterParams[key] = params[key];
        }       
    }

    this.getGlobalParams = function() {
        return globalParams;
    }

    this.setGlobalParams = function(params) {
        for (var key in params) {
            globalParams[key] = params[key];
        }       
    }

    this.getSort = function() {
        return sort;
    }

    this.objectToUrl = function(object) {
        var params = [];
        for (var key in object) {
            if(object[key] === "") {
                continue;
            }
            params.push(encodeURIComponent(key) + "=" + encodeURIComponent(object[key]));
        }    
        console.log(params);   
        return this.implode("&", params); 
    }

    this.implode = function implode(glue, pieces) {  
        return ((pieces instanceof Array) ? pieces.join (glue) : pieces);
    }
        
    this.getUrl = function(countryName) {
        var services = nestoriaAPI.getServers();
        var url = services[countryName]["url"];
        var code = services[countryName]["code"];
        console.log(url);
        url += "/api?&country=" + code;
        var globalParamsUrl = this.objectToUrl(globalParams);
        var locationParamsUrl = this.objectToUrl(locationParams);
        var filterParamsUrl = this.objectToUrl(filterParams);
        var paginatorParamsUrl = this.objectToUrl({page: paginator.currentPage});
        console.log(globalParamsUrl);
        url += "&" + globalParamsUrl + 
               "&" + locationParamsUrl + 
               "&" + filterParamsUrl + 
               "&" + paginatorParamsUrl;
        console.log(url);
        return url;
    }

    this.getSearchListings = function(countryName) {
        listElement.innerHTML = '<img id="loader" src="images/loader.gif">';
        country = countryName;
        var request = new Request();
        var callback = request.getCallbackName();
        var url = this.getUrl(country) + "&callback=" + callback;
        request.jsonp(url).then(function(response) {
            listings = parseResponse(response.response);
            render(listings);
        }).catch(function(error) {
            console.log("Error: " + error);
        });
    }
}
