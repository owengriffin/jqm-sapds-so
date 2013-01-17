// Listen for any attempts to call changePage().
            
(function($) {
showSOHeader = function(url, options) {
    var soHeaderId=url.hash.match(/soheader_id=([0-9]+)/)[1];
    $('#soheader_number').html(soHeaderId);
    $.ajax({ 
        url: '/sap/opu/odata/sap/SALESORDERS/SOHeaders(\'' + soHeaderId + '\')/SOItems?$top=10',
        async: false,
        success: function(data) {
	    $.mobile.changePage($('#page_soheader'), data.options);
	    var i, html, item;
	    $('#soheader_content').html('');
	    for (i = 0; i < data.d.results.length; i++){
		item = data.d.results[i];
		html = '<div data-role="collapsible">' +
		    '<h3>' + item.Description + '</h3>' +
		    '<p><strong>' + item.Quantity + '</strong> ' + item.UoM + '</p>' +
		    '<p>' + item.Value + '</p>' +
		    '<p>Material: ' + item.Material + ' Plant: ' + item.Plant + '</p>' + 
		    '</div>';
		$('#soheader_content').append(html);
	    }
	    $('#soheader_content').collapsibleset( "refresh" );
 	}, 
        error: function(response, error) {
	    console.debug(error);
            $("#order").html("Unable to load order: " + error);
        }
    });
};

$(document).ready(function() {
$.mobile.changePage('#page_orders');
});

$(document).bind( "pagebeforechange", function( e, data ) {
    // We only want to handle changePage() calls where the caller is
    // asking us to load a page by URL.
    if ( typeof data.toPage === "string" ) {
	
	// We are being asked to load a page by URL, but we only
	// want to handle URLs that request the data for a specific
	// category.
	var u = $.mobile.path.parseUrl( data.toPage ),
	re = /^#category-item/;
	
	if ( u.hash.search(re) !== -1 ) {
	    
	    // We're being asked to display the items for a specific category.
	    // Call our internal method that builds the content for the category
	    // on the fly based on our in-memory category data structure.
	    // showCategory( u, data.options );
	    
	    // Make sure to tell changePage() we've handled this call so it doesn't
	    // have to do anything.
	    e.preventDefault();
	}
        
        if (u.hash.search(/^#page_orders/) !== -1) {
            $.ajax({ 
                url: '/sap/opu/odata/sap/SALESORDERS/SOHeaders?$top=10&$orderby=DocumentDate%20desc&$expand=SOItems',
                async: false,
                success: function(data) {
		    var i, html;
		    html =''; 
		    for (i = 0; i < data.d.results.length; i++ ){
			html = html + '<li>' + 
			    '<a href="#soheader?soheader_id=' + data.d.results[i].OrderId + '">' +
			    '<h3>' + data.d.results[i].CustomerId + ' / ' + data.d.results[i].OrderId + '</h3>' +
			    '<p><strong>US$</strong> ' + data.d.results[i].OrderValue + '</p>' +
			    '<p class="ui-li-aside"><strong>' + moment(new Date(parseInt(data.d.results[i].DocumentDate.match(/([0-9]+)/)[1]))).format('LLL') + '</strong></p>' +
			    '<span class="ui-li-count">' + data.d.results[i].SOItems.results.length + '</span>' +
			    '</a>' +
			    '</li>';
			
		    }
   	            $("#orders_list").html(html).listview("refresh");
		    $.mobile.changePage($('#page_orders'), data.options);
		    e.preventDefault();
 	        }, 
                error: function(response, error) {
console.debug(error);
                    $("#orders_list").html("Unable to load search results." + error);
                }
            });
        }

	if ( u.hash.search(/^#soheader/) !== -1 ) {
	    showSOHeader(u, data.options);
	    e.preventDefault();
	}
    }
});
            
})(jQuery);	
