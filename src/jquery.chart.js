(function($){  
   $.fn.graph = function(options){
		var defaults = {
			chartType: 'pie',
			columns: { '0': 'labels', '1': 'series1' },
			apiOptions: { width: 400, height: 300, title: '' },
			valueSelector: null,
			labelSelector: null
		};
		options = $.extend(defaults, options);

		function getTdConents(td, selector) {
			if(selector != null){
				if(typeof(selector) == 'string'){
					return(td.find(selector).text());						   
				} else {
					return(selector(td));
				}
			} else {
				return(td.text());
			}
		}
		
		function getData(table){
			var rows = [];
			table.find('tr').each(
				function(index, row){
					row = $(row);
					row_data = [];

					row.find('td').each(
						function(index, td){
							td = $(td);
							if(options.columns[String(index)]){
								switch(options.columns[String(index)]){
									case 'labels':
										var label = getTdConents(td, options.labelSelector);
										row_data.push(label);
										break;
									default:
										var value = Number(getTdConents(td, options.valueSelector));
										row_data.push(value);
										break;
								}
							}
						}
					);  

					if(row_data.length == 2){
						rows.push(row_data);
					}
				}
			);
			return(rows)
		}
		
		function generateChart(rows){
			var data = new google.visualization.DataTable();
			$.each(options.columns,
				function(index, column){
					if(column == 'labels'){
						data.addColumn('string', '');
					} else {
						data.addColumn('number', column);      
					}
				}
			);
			data.addRows(rows);

			// Set chart options
			// Instantiate and draw our chart, passing in some options.
			var chartID = options.chartID;
			var chart = null;

			switch(options.chartType){
				case 'pie':
					chart = new google.visualization.PieChart(document.getElementById(chartID));
					break;
				case 'bar':
					chart = new google.visualization.BarChart(document.getElementById(chartID));
					break;
				case 'line':
					chart = new google.visualization.LineChart(document.getElementById(chartID));
					break;
				case 'area':
					chart = new google.visualization.AreaChart(document.getElementById(chartID));
					break;
				case 'column':
					chart = new google.visualization.ColumnChart(document.getElementById(chartID));
					break;
			}
			chart.draw(data, options.apiOptions);		
		}

		return this.each(
			function() {  
				var table = $(this);
				console.log('.graph');
				console.log(table);
				console.log(options);

				google.load('visualization', '1.0', 
					{
						'packages':['corechart'], 
						callback: function(){
							var rows = getData(table);
							// Create the data table.
							generateChart(rows);
						}
					}
				);
			}
		);  
	};  
})(jQuery);