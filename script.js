var nestoriaAPI = new NestoriaAPI();
nestoriaAPI.init("nestoria-result", "nestoria-error");
var services = nestoriaAPI.getServers();
console.log(services);
initCountrySelect(services);
var searchButton = document.getElementById('search-btn');

searchButton.addEventListener('click', function(event) {  
    nestoriaAPI.resetPaginator();
    var searchNav = document.getElementById("search-nav");
    var inputElements = searchNav.querySelectorAll("input, select");
    console.log("click");
    var params = {};
    for(var i = 0; i < inputElements.length; i++) {
        params[inputElements[i].name] = inputElements[i].value;
    }
    var radioElements = document.getElementsByName("listing_type");
    console.log(radioElements);
    for (var i = 0; i < radioElements.length; i++) {
        if (radioElements[i].checked) {
            params["listing_type"] = radioElements[i].value;
            break;
        }
    }
    console.log("Params: ");
    console.log(params);
    var country = params["country"];
    nestoriaAPI.setLocationParams({"place_name": params["place_name"]});
    nestoriaAPI.setGlobalParams({"country": services[country]["code"]});
    nestoriaAPI.setFilterParams({"listing_type": params["listing_type"]});

    params = {};
    var filtersNav = document.getElementById("filters-nav");
    inputElements = filtersNav.querySelectorAll("input");
    for(var i = 0; i < inputElements.length; i++) {
        params[inputElements[i].name] = inputElements[i].value;
    }
    console.log("filters=");
    console.log(params);
    nestoriaAPI.setFilterParams(params);
    nestoriaAPI.getSearchListings(country);
}, false);

function initCountrySelect(services) {
    var select = document.getElementById("country-select");
    for (const key in services) {
        if (services.hasOwnProperty(key)) {
            var option = document.createElement("option");
            option.text = key;
            option.value = key;
            select.appendChild(option);
        }
    }
}
