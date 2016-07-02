var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

$(document).ready(function() {
    
    $('#startbtn').on('click', function() {
        $.APP.startTimer('sw');
        newGame();
    }); 
    
    $('#dScore').on('show.bs.modal', function (e) {
        var h = $('#sw_h').html();
        var m = $('#sw_m').html();
        var s = $('#sw_s').html();
        var ms = $('#sw_ms').html();
        var timestr = "";
        
        if(h != "00"){
            timestr = h + " hours " + m + " minutes " + s + " seconds " + ms + " milliseconds ";
        } else if(m != "00"){
            timestr = m + " minutes " + s + " seconds " + ms + " milliseconds ";
        } else if(s != "00"){
            timestr = s + " seconds " + ms + " milliseconds ";
        } else {
            timestr = ms + " milliseconds ";
        }
        $('#totaltime').html(timestr);
        $('#inputUsername').val("");
        
    });
    
    $('#saveBtn').on('click', function(){
        $('#dScore').modal('hide');
        var h = $('#sw_h').html();
        var m = $('#sw_m').html();
        var s = $('#sw_s').html();
        var ms = $('#sw_ms').html();
        var scores = {};
        var username = $('#inputUsername').val();
        var time = (parseInt(h * 3600000) + parseInt(m * 60000) + parseInt(s * 1000) + parseInt(ms));
        
        if(localStorage.getItem('scoreObj') === null){
            scores[username] = time
            localStorage.setItem('scoreObj', JSON.stringify(scores));
            
        } else {
            var stored = localStorage.getItem('scoreObj');
            scores = JSON.parse(stored);
            scores[username] = time;
            localStorage.setItem('scoreObj', JSON.stringify(scores));
        }
        
    });
    
    $('#rankings').on('click', function() {
        $('#dRankings').modal('show');
    }); 
    
    $('#closeBtn').on('click', function() {
        $('#dRankings').modal('hide');
    });
    
    $('#dRankings').on('show.bs.modal', function (e) {
        if(localStorage.getItem('scoreObj') === null){
             $('#dRankings .modal-body').html('<h4>No scores found.</h4>');
        } else {
            var stored = localStorage.getItem('scoreObj');
            var scores = JSON.parse(stored);
            var sortable = [];
            for (var user in scores){
                sortable.push([user, scores[user]])
                sortable.sort(function(a, b) {return a[1] - b[1]})
            }
            $('#dRankings .modal-body').html('<h4>Top 10 fastest time</h4><table class="table table-striped"></table>');
            var list = "";
            var count = 0;
            for(var key in sortable){
                var rec = sortable[key].toString().split(',');
                if(count < 10){
                    list += '<tr><td>' + parseInt(count + 1) +' : </td><td class="username">' + rec[0]+ '</td><td>' + msToTime(rec[1]) + '</td></tr>';
                    count++;
                }
            }
             $('#dRankings .table').html(list);
            
        }
    });
    
});

function newGame(){
    var sArr = shuffle(arr);
    var counter = 0;
    $('.grid-cell .num-content').each(function(){
        $(this).html(sArr[counter]);
        counter++;
    });
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

(function () {
    var boxes_ = document.querySelectorAll('.grid-cell .num-content');
    var dragSrcEl_ = null;
    var adjacent = false;
    this.handleDragStart = function (e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
        dragSrcEl_ = this;
        adjacent = false;
        this.style.opacity = '0.5';
    };
    this.handleDragOver = function (e) {
        if (e.preventDefault) {
            e.preventDefault(); // Allows us to drop.
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    };
    
    this.handleDrop = function (e) {
        // this/e.target is current target element.
        
        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }
        // Don't do anything if we're dropping on the same box we're dragging.
        if (dragSrcEl_ != this) {
            
            //check if dropzone is adjacent to dragged object
            switch(dragSrcEl_.id){
                case "dr1":
                    if(this.id == "dr2" || this.id == "dr4"){
                        adjacent = true;
                    }
                    break;
                case "dr2":
                    if(this.id == "dr1" || this.id == "dr3" || this.id == "dr5"){
                        adjacent = true;
                    }
                    break;
                case "dr3":
                    if(this.id == "dr2" || this.id == "dr6"){
                        adjacent = true;
                    }
                    break;
                case "dr4":
                    if(this.id == "dr1" || this.id == "dr5" || this.id == "dr7"){
                        adjacent = true;
                    }
                    break;
                case "dr5":
                    if(this.id == "dr2" || this.id == "dr4" || this.id == "dr6" || this.id == "dr8"){
                        adjacent = true;
                    }
                    break;
                case "dr6":
                    if(this.id == "dr3" || this.id == "dr9" || this.id == "dr5"){
                        adjacent = true;
                    }
                    break;
                case "dr7":
                    if(this.id == "dr4" || this.id == "dr8"){
                        adjacent = true;
                    }
                    break;
                case "dr8":
                    if(this.id == "dr7" || this.id == "dr5" || this.id == "dr9"){
                        adjacent = true;
                    }
                    break;
                case "dr9":
                    if(this.id == "dr8" || this.id == "dr6"){
                        adjacent = true;
                    }
                    break;
                default:
                    adjacent = false;
            }
            if(adjacent == true){
                dragSrcEl_.innerHTML = this.innerHTML;
                this.innerHTML = e.dataTransfer.getData('text/html');
            }
            
            if(checkOrder()){
                $.APP.pauseTimer();
                $('#dScore').modal('show');
            }
        }
        return false;
    };
    this.handleDragEnd = function (e) {
        // this/e.target is the source node.
        this.style.opacity = '1';
        
    };

    [ ].forEach.call(boxes_, function (box) {
        box.addEventListener('dragstart', this.handleDragStart, false);
        box.addEventListener('dragenter', this.handleDragEnter, false);
        box.addEventListener('dragover', this.handleDragOver, false);
        box.addEventListener('dragleave', this.handleDragLeave, false);
        box.addEventListener('drop', this.handleDrop, false);
        box.addEventListener('dragend', this.handleDragEnd, false);
    });
})();

function checkOrder() {
    var correctorder = true;
    $('.grid-cell .num-content').each(function (index) {
        
        if (index != (parseInt($(this).html())) - 1) {
            correctorder = false;
        }
    });
    return correctorder;
}

function msToTime(s) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return hrs + ' hours ' + mins + ' minutes ' + secs + ' seconds ' + ms + ' milliseconds';
}