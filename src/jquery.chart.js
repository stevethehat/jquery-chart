(function($){  
   $.fn.graph = function(options){
	  function getTdConents(td, selector){
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
	  
      var defaults = {
		 chartType: 'pie',
		 columns: { '0': 'labels', '1': 'series1' },
		 apiOptions: { width: 400, height:300, title: '' },
		 valueSelector: null,
		 labelSelector: null
	  };  
	  options = $.extend(defaults, options);    
   
	  return this.each(
		 function() {  
			var table = $(this);
			
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
								 row_data.push(getTdConents(td, options.labelSelector));
								 break;
							  default:
								 row_data.push(Number(getTdConents(td, options.valueSelector)));
								 break;
						   }
						}
					 }
				  );            
				  rows.push(row_data);
			   }
			);
			
			// Create the data table.
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
	  );  
   };  
})(jQuery);