
/* Check window size/type of device being used */

	if ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent	)) || ($(window).width() <= 973)) {
    	$('#menuIcon').css('visibility', 'visible');
    }else{
	$('#navTabs').css('visibility', 'visible');
	}

/* Move the menu bar on and off the screen */

 $("#menuIcon").click(function(){
        $('#menuList').css('left', '50%');
         $('#menuIcon').css('left', '40%');
         $('.notMenu').css('opacity', .3);

    });

 $('.menuTabs').click(function(){
 		 $('.notMenu').css('opacity', 1);
 		 $('#menuList').css('left', '');
         $('#menuIcon').css('left', '');
 });


	var stockNames = ["EEM","EFA","GLD","IVV","IYR","TLT"];
	var monthNames = ["January", "February", "March", "April", "May", "June",
  	"July", "August", "September", "October", "November", "December"];
	var chartData;
	var stocksInTable = new Array();
	var historicalSignalData;
	var performanceData;

/* First get the historical signal data
		then move onto building the charts, tables, etc. */

$.when(getHistoricalSignalData()).done(function(a1){
		chartData = new Array(stockNames.length);
		wrapperForGettingStockData();
		});

/* Gets prior/current signal data from online html text */
function getHistoricalSignalData(){
		//cross origin request not working, returning blank responseText, so just using local copy
		// return $.ajax({
	  //   url: 'http://gaesample1-1175.appspot.com',
	  //   type: 'GET',
	  //   success: function(res) {
	  // 		var x = res.responseText;
	  // 		historicalSignalData = JSON.parse(getBody(x));
    // 		}
		// });
		historicalSignalData = historical_signals;

}

/**
	Searches for body, extracts and return the content
	New version contributed by users
*/

function getBody(content) {

   var x = content.indexOf("<body");
   if(x == -1) return "";

   x = content.indexOf(">", x);
   if(x == -1) return "";

   var y = content.lastIndexOf("</body>");
   if(y == -1) y = content.lastIndexOf("</html>");
   if(y == -1) y = content.length;    // If no HTML then just grab everything till end

   return content.slice(x + 1, y);
}

/* Wrapper method */
function wrapperForGettingStockData(){
		for(var i= 0; i < stockNames.length; i++){
			getDataFromYQL(stockNames[i]); //also generates table
			chartData[stockNames[i]] = new Array(213); //array will be used for displaying graph of each stock
//			generateChartData(stockNames[i]); No more historical data functionality from YQL

		};

}

	/* Gets stock price, name, etc. from YQL API
			Puts results into a table */

	function getDataFromYQL(thisStock) {
		var today = new Date();
		var monthNumber = today.getMonth();
		var currentMonth = monthNames[monthNumber];
		var currentYear = today.getFullYear();
		var key = currentMonth + "."+ currentYear;

			/* Makes sure current date's signals are updated, if not then
				use 1/1/2016's signals */
		if (!(key in historicalSignalData)){
			monthNumber = 0;
			currentYear = 2016;
			currentMonth = monthNames[monthNumber];
			key = currentMonth + "." + currentYear;
		};
		$('#signalDate').text("Signals from: " + currentMonth + " " + currentYear);
    	var url = "https://query.yahooapis.com/v1/public/yql";
			//working url https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22MSFT%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=
    	var data = encodeURIComponent("select * from yahoo.finance.quotes where symbol in ('" + thisStock + "')");
    	$.getJSON(url, 'q=' + data + "&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=")
        .done(function (data) {
					console.log(historicalSignalData[key]);
        	var tr = $('<tr/>');
           tr.append("<td class='stockGraphSymbol'><button type='button' onclick='showGraph(this.textContent);getYQLNews(this.textContent);'>" + thisStock + "</button></td>");
           	tr.append("<td>" + data.query.results.quote.Name + "</td>");
        	tr.append("<td>" + historicalSignalData[key][thisStock] + "</td>");
        	tr.append("<td>" + data.query.results.quote.LastTradePriceOnly + "</td>");

            $('#myTable').append(tr);

    		})

        .fail(function (jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
            $("#result").text('Request failed: ' + err);
    	});

	}

/* Displays the appropriate stock graph by using the appropriate data */

	function showGraph(inputStockName){
			//since there is no more yql historical data just show that in writing
			document.getElementById("chartText").innerHTML ="Last year's performance is unavailable, yahoo no longer supports historical stock data :(";
			return;

	document.getElementById("chartdiv").style.backgroundColor = "white";
	document.getElementById("chartdiv").style.boxShadow ="0px 3px 3px  3px #888888";
	var chart = AmCharts.makeChart("chartdiv", {
		"fontFamily":"Kefa",
		"fontSize": 14,
    "type": "serial",
    "theme": "patterns",
    "marginRight": 40,
    "marginLeft": 40,
    "autoMarginOffset": 20,
    "dataDateFormat": "YYYY-MM-DD",
    "valueAxes": [{
        "id": "v1",
        "axisAlpha": 0,
        "position": "left",
        "ignoreAxisWidth":true
    }],
    "balloon": {
        "borderThickness": 1,
        "shadowAlpha": 0
    },
    "graphs": [{
        "id": "g1",
        "balloon":{
          "drop":true,
          "adjustBorderColor":false,
          "color":"#ffffff",
          "type":"smoothedLine"
        },
        "fillAlphas":0.2,
        "bullet": "round",
        "bulletBorderAlpha": 1,
        "bulletColor": "#FFFFFF",
        "bulletSize": 5,
        "hideBulletsCount": 50,
        "lineThickness": 2,
        "title": "red line",
        "useLineColorForBulletBorder": true,
        "valueField": "value",
        "balloonText": "<span style='font-size:12px;'>[[value]]</span>"
    }],

    "chartCursor": {
        "valueLineEnabled": false,
        "valueLineBalloonEnabled": false,
        "cursorAlpha":0,
        "zoomable":false,
        "valueZoomable":false,
        "valueLineAlpha":0
    },
    "valueScrollbar":{
     "autoGridCount":true,
      "color":"#000000",
      "scrollbarHeight":50
    },
    "categoryField": "date",
    "categoryAxis": {
        "parseDates": true,
        "dashLength": 1,
        "minorGridEnabled": true
    },

    "dataProvider": chartData[inputStockName],
    "titles": [
		{
			"text": inputStockName + " Chart",
			"size": 20
		}
	]
});
chart.invalidateSize();
	 }


/* Gets historical stock prices */

	function generateChartData(thisStock) {
		//YQL Discontinued getting the historical data
	 // 		var currentDate = new Date();
	  // 	var firstDate = new Date();
	  // 	firstDate.setDate( currentDate.getDate() - 298 );
		//
	  // /*Use these strings to get the start and end date in a format that yql will accept*/
		//
		// var firstDateString = firstDate.getFullYear() + "-" + (firstDate.getMonth() + 1)+ "-" + firstDate.getDate();
		// var currentDateString = currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1)+ "-" + currentDate.getDate();
		//
	  // /*query data*/
		//
	  //   	$.getJSON('http://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.historicaldata where symbol = "'+ thisStock + '" and startDate = "' + firstDateString + '"and endDate = "' + currentDateString + '"&format=json&diagnostics=true&env=store://datatables.org/alltableswithkeys')
		//
	  //        /*loop throught the query results and store price from each day */
		//
	  //       .done(function (data) {
	  //       	 	for ( var i = data.query.results.quote.length - 1; i >= 0; i--) {
	  //   					var newDate = data.query.results.quote[i].Date;
	  //   					var a = data.query.results.quote[i].Close;
		//
	  //   				chartData[thisStock][data.query.results.quote.length - i - 1] = ( {
	  //     				date: newDate,
	  //     				value: a,
	  //   				} );
		//
	  // 				}//end of for loop
		//
	  //   		})
		//
	  //       .fail(function (jqxhr, textStatus, error) {
	  //       var err = textStatus + ", " + error;
	  //           $("#result").text('Request failed: ' + err);
	  //   	});



	}
	/* Clears the historical signals table */
	function clearTable(){
			$('#historicalTable').find('td').remove();
			$('#historicalTable').css('visibility', 'hidden');
		}

		/* Creates the historical signals table */
	function displayHistSignal(m, y) {
			if (m == 'Month' || y == 'Year') {
				return;
			};
			var date = m + "." +  y;
			var update = historicalSignalData[date];
			var i = 0;
			$('#historicalTable').find('tr').each(function(){

           		var trow = $(this);
             	if(trow.index() === 0){
              	   trow.append("<td>" + m + " " +  y + "</td>");
             	}else{
             	    trow.append("<td>" + update[stockNames[i]] +  "</td>");
             	    i++;
             	}
		});
			$('#historicalTable').css('visibility', 'visible');
}

	/* Gets news using YQL API */
	function getYQLNews(stock) {

		var url = "https://query.yahooapis.com/v1/public/yql";
    	var data = encodeURIComponent("select * from rss where url='https://finance.yahoo.com/rss/2.0/headline?s=" + stock + "&region=US&lang=en-US'");
    	$.getJSON(url, 'q=' + data + "&format=json&diagnostics=true&callback=")
        .done(function (data) {
        	$("#newsList li").remove();
        	for(var i = 0; i < 5; i++){
        		var newsLink = data["query"]["results"]["item"][i].link;
        		var newsTitle = data["query"]["results"]["item"][i].title;
        		$("#newsList").append('<li><a target="_blank" href=' + newsLink + '>' + newsTitle + '</a></li>');
        		$("#newsHeader").text("Recent News for " + stock);

        	}

    		})

        .fail(function (jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
            $("#result").text('Request failed: ' + err);
    	});


	}

 performanceData =
 			[
			{date: '2004',
				value: '111898',
				PercentReturn: '11.90%'
			},
			{date:'2005',
				value: '129944',
				PercentReturn: '16.13%'
			},
			{date:'2006',
				value: '156799',
				PercentReturn: '20.67%'
			},
			{date:'2007',
				value: '179757',
				PercentReturn: '14.64%'
			},
			{date:'2008',
				value: '208574',
				PercentReturn: '16.03%'
			},
			{date:'2009',
				value: '263285',
				PercentReturn: '26.23%'
			},
			{date:'2010',
				value:  '290769',
				PercentReturn: '10.44%'
			},
			{date:'2011',
				value:  '305788',
				PercentReturn: '5.17%'
			},
			{date:'2012',
				value:  '316149',
				PercentReturn: '3.39%'
			},
			{date:'2013',
				value:  '358747',
				PercentReturn: '13.47%'
			},
			{date:'2014',
				value:  '385887',
				PercentReturn: 	'7.57%'
			},
			{date:'2015',
				value:  '351231',
				PercentReturn: 	'-8.98%'
			}
			]

/* Draws the performance bar graph */
	function drawPChart(){

			var chart = AmCharts.makeChart( "performanceChartDiv", {
				"fontFamily":"Kefa",
			  "type": "serial",
			  "theme": "none",
			  "dataProvider": performanceData,
			  "valueAxes": [ {
			  	"title": "Portfolio Value",
			    "gridColor": "#FFFFFF",
			    "gridAlpha": 0.2,
			    "dashLength": 0
			  } ],
			  "gridAboveGraphs": true,
			  "startDuration": 1,
			  "graphs": [ {
			    "balloonText": "[[category]]: <b>$[[value]]</b>",
			    "fillAlphas": 0.8,
			    "lineAlpha": 0.2,
			    "type": "column",
			    "valueField": "value"
			  } ],
			  "chartCursor": {
			    "categoryBalloonEnabled": false,
			    "cursorAlpha": 0,
			    "zoomable": false
			  },
			  "categoryField": "date",
			  "categoryAxis": {
			  	"title":"Year",
			    "gridPosition": "start",
			    "gridAlpha": 0,
			    "tickPosition": "start",
			    "tickLength": 20
			  },
			  "export": {
			    "enabled": true
			  }

			} );

		}

for(var i= 0; i < performanceData.length; i++){
	drawPerformanceTable(performanceData[i]);
	if(i == performanceData.length -1 ){
		drawPChart();
	}
}

 function drawPerformanceTable(data){
 		var val = numberWithCommas(data.value)
 		var tr = $('<tr/>');
 		tr.append("<td>" + data.date + "</td>");
 		tr.append("<td>" + val + "</td>");
 		if(data.PercentReturn.indexOf('-') === -1){
 		tr.append("<td style='color:green'>" + data.PercentReturn + "</td>");
 	}else{
 		tr.append("<td style='color:red'>" + data.PercentReturn + "</td>");
 	}
 		$('#perfTable').append(tr);
 	}

function numberWithCommas(x) {
    return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



$(window).resize(function() {
    if($(this).width() < 973){
    	$('#navTabs').css('visibility', 'hidden');
    	$('#menuIcon').css('visibility', 'visible');
    }else{
    	$('#navTabs').css('visibility', 'visible');
    	$('#menuIcon').css('visibility', 'hidden');
    }

});
