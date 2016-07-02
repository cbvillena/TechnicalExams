$(document).ready(function () {
    //show animals list on default
    $('#divAnimals').show();

    //call method to populate list
    processJsonList('animals', 'tblAnimals');
    processJsonList('fruitveg', 'tblFruitVeg');

    //navigation bar events
    $('.navbar-nav li a').click(function () {
        var active = $(this).attr('id');
        $('.sections').hide();
        $('#div' + active).show();
        $('.navbar-nav li').removeClass('active');
        $(this).parent().addClass('active');
    });

    //modal close event
    $('#closeBtn').click(function () {
        $('#mDetails').modal('hide');
    });

});

function processJsonList(category, listName) {

    //set base url + category
    var jsonurl = 'http://adweb.agency/interview/api/' + category;

    //get json data on specified url
    $.getJSON(jsonurl, function (data) {

        //list DOM will be written on this variable
        var parsed = '';

        //parse each object on json array 
        $.each($.parseJSON(data), function (i, currentData) {

            parsed += '<tr><td><a onclick="showModal(this)" href="#" id="' + currentData.Id + '-' + category + '">'
            parsed += '<img src="' + currentData.ImageURLs.Thumb + '"></a></td>'
            parsed += '<td><div><strong>' + currentData.Title + '</strong></div><div>' + currentData.Description + '</div></td>';
            parsed += '</tr>';

        });

        $('#' + listName).html(parsed);
    });

};

function processJsonDetails(category, item) {

    //set base url + category
    var jsonurl = 'http://adweb.agency/interview/api/' + category;

    //get json data on specified url
    $.getJSON(jsonurl, function (data) {

        //details DOM will be written on this variable
        var parsed = '';

        //parse each object on json array 
        $.each($.parseJSON(data), function (i, currentData) {

            //check if current object is the item to show
            if (currentData.Id == item) {
                parsed += '<h3><center>' + currentData.Title + '</center></h3>';
                parsed += '<img src="' + currentData.ImageURLs.FullSize + '"></a></td>';
                parsed += '<div>' + currentData.Description + '</div>';
                parsed += '<ul><li><strong>Family</strong> : ' + currentData.Family + '</li>';

                //check if animal or fruit & veg
                if (category == 'animals') {
                    parsed += '<li><strong>Collective Noun</strong> : ' + currentData.CollectiveNoun + '</li>';
                } else {
                    parsed += '<li><strong>Genus</strong> : ' + currentData.Genus + '</li>';
                }

                parsed += '</ul>';
            };

        });
        $('.modal-body').html(parsed);
        $('#mDetails').modal('show');
    });

}

//method to show modal process
function showModal(e) {
    //get id of current item
    var elem = e.id;

    //parse id to get item category and item id
    var item = elem.split('-');

    //remove modal content on initialize
    $('.modal-body').empty();

    // call to populate modal details
    processJsonDetails(item[1], item[0]);

}