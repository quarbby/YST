var month;
var year;
var ysturl = "https://scmapp.nus.edu.sg/musweb/";
var concertsdiv;

window.onload = function(e) {
    var currentTime = new Date();
    month = currentTime.getMonth() + 1;
    year = currentTime.getFullYear();
    $('#month').val(month);
    
    for (var i = new Date().getFullYear(); i>1995; i--) {
        $('#year').append($('<option />').val(i).html(i));
    }
    $('#year').val(year);
    
    concertsdiv = document.getElementById('concertsdiv');
    
    getConcerts();
}

function monthchanged() {
    month = $('#month').val();
    clearConcerts();
    getConcerts();
}

function yearchanged() {
    year = $('#year').val();
    clearConcerts();
    getConcerts();
}

function clearConcerts() {
    $('#concertsdiv').empty();
}

function getConcerts() {
    /* In YQL Console: 
    select * from html where url="https://scmapp.nus.edu.sg/musweb/DynaEvents.aspx?YearFilter=2015&TypeFilter=&MonthFilter=11"
    */
    
    var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22https%3A%2F%2Fscmapp.nus.edu.sg%2Fmusweb%2FDynaEvents.aspx%3FYearFilter%3D" +
            year + "%26TypeFilter%3D%26MonthFilter%3D" + month + "%22&format=json&diagnostics=true&callback=?";
    $.getJSON(url,
        function(data) {
            if (data.query.results.body.form.div[0].div.div.table.tbody == undefined) {
                console.log("No Results");
                concertsdiv.innerHTML = "Exciting Things Coming your Way!";
            }
            else {
                var rows = data.query.results.body.form.div[0].div.div.table.tbody.tr;
                function getContent(rowdata) {
                  //console.log(rowdata);
                  var content = ""
                  if ((typeof rowdata.content) != 'undefined') {
                      content=rowdata.content;
                  }
                  else if (rowdata.p != undefined) {
                      for (var i=0; i<rowdata.p.length; i++) {
                          content += rowdata.p[i] + " ";
                      }
                  }
                  
                  //return String.fromCharCode(content);
                  return content;
                }
                
                /*
                var rowdata = rows[8].td.div[0].div
                console.log(rowdata[5].content);
                var concert = {
                  img: ysturl + rowdata[0].img.src,
                  type: rowdata[1].a.content,
                  link: rowdata[1].a.href,
                  timedate: rowdata[2].strong[0]+ " " + rowdata[2].strong[1].span.content,
                  venue: rowdata[2].strong[1].content,
                  people: rowdata[4].content,
                  content: getContent(rowdata[5])
                };      
                
                var concertElem = document.createElement("concert-block");
                concertElem.concert = concert;
                concertsdiv.appendChild(concertElem);   
                
                console.log(rows[5].td.div[0].div)
                */
                
                for (var i=0; i<rows.length; i++) {
                    var rowdata = rows[i].td.div[0].div;
                    
                    var concert = {
                      img: ysturl + rowdata[0].img.src,
                      type: rowdata[1].a.content || rowdata[1].p.a.content,
                      typeimg: ysturl + rowdata[3].a.img.src,
                      link: rowdata[1].a.href,
                      timedate: rowdata[2].strong[0]+ " " + rowdata[2].strong[1].span.content,
                      venue: rowdata[2].strong[1].content,
                      people: rowdata[4].content,
                      content: getContent(rowdata[5])
                    };
                
                var concertElem = document.createElement("concert-block");
                concertElem.concert = concert;
                concertsdiv.appendChild(concertElem); 
                }

            }
        }
    );
}