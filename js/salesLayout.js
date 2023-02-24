// date picker fx
$(function () {
    $( "#sales-date" ).datepicker({
        dateFormat: "yy-mm-dd"
    });
});

// Click sidebar
const formDiv        = document.querySelector('#form-div');
const dashboardDiv 	 = document.querySelector('#dashboard-div');
const formLink       = document.querySelector('#form-link');
const dashboardLink  = document.querySelector('#dashboard-link');

formLink.addEventListener('click', () => {
    dashboardDiv.style.display  = 'none';
    formDiv.style.display       = 'block';
});

dashboardLink.addEventListener('click', () => {
    formDiv.style.display       = 'none';
    dashboardDiv.style.display  = 'block';
});

// ajax fetch from api getsales and display total revenue by mth
$.ajax({
    url: "http://localhost:8080/getsales",
    method: "POST",
    dataType: "json",
    success: function(data) {
      var monthlyRevenue = {};
      for (var i = 0; i < data.length; i++) {
        var sale = data[i];
        var saleMonth = new Date(sale.salesDate).getMonth();
        if (!monthlyRevenue[saleMonth]) {
          monthlyRevenue[saleMonth] = 0;
        }
        monthlyRevenue[saleMonth] += sale.dealAmount;
      }
      var chartData = [];
      for (var month in monthlyRevenue) {
        chartData.push({
          x: month,
          y: monthlyRevenue[month] 
        });
      }
      var chartOptions = {
        series: [{
          name: "Revenue",
          data: chartData
        }],
        chart: {
          height: 350,
          type: 'line'
        },
        xaxis: {
          categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          labels: {
            formatter: function(val) {
              // format the x-axis labels as month names
              return new Date(Date.UTC(2000, val, 1)).toLocaleString('default', { month: 'short' });
            }
          }
        }
      };
      var chart = new ApexCharts(document.querySelector("#revenueByMonth-chart"), chartOptions);
      chart.render();
    }
  });

  // ajax fetch from api getsales and display deal closed by mth
  $.ajax({
    url: "http://localhost:8080/getsales",
    method: "POST",
    dataType: "json",
    success: function(data) {
      var dealsByMonth = {};
      for (var i = 0; i < data.length; i++) {
        var sale = data[i];
        var saleMonth = new Date(sale.salesDate).getMonth();
        if (!dealsByMonth[saleMonth]) {
          dealsByMonth[saleMonth] = 0;
        }
        dealsByMonth[saleMonth]++;
      }
      var chartData = [];
      for (var month in dealsByMonth) {
        chartData.push({
          x: month,
          y: dealsByMonth[month]
        });
      }
      var chartOptions = {
        series: [{
          name: "Deals Closed",
          data: chartData
        }],
        chart: {
          height: 350,
          type: 'bar'
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '50%',
            endingShape: 'rounded'
          },
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        },
        yaxis: {
          title: {
            text: 'Number of Deals Closed'
          }
        }
      };
      var chart = new ApexCharts(document.querySelector("#dealsClosedByMonth-chart"), chartOptions);
      chart.render();
    }
  });

  // ajax fetch from api getsales and display avg deal size by mth
  $.ajax({
    url: "http://localhost:8080/getsales",
    method: "POST",
    dataType: "json",
    success: function(data) {
      var monthlyTotal = {};
      var monthlyCount = {};
      var monthlyAverage = {};
  
      for (var i = 0; i < data.length; i++) {
        var sale = data[i];
        var saleMonth = new Date(sale.salesDate).getMonth();
        if (!monthlyTotal[saleMonth]) {
          monthlyTotal[saleMonth] = 0;
          monthlyCount[saleMonth] = 0;
        }
        monthlyTotal[saleMonth] += sale.dealAmount;
        monthlyCount[saleMonth]++;
      }
  
      for (var month in monthlyTotal) {
        monthlyAverage[month] = monthlyTotal[month] / monthlyCount[month];
      }
  
      var chartData = [];
      for (var month in monthlyAverage) {
        chartData.push({
          x: month,
          y: monthlyAverage[month]
        });
      }
  
      var chartOptions = {
        series: [{
          name: "Average Deal Size",
          data: chartData
        }],
        chart: {
          height: 350,
          type: 'line'
        },
        xaxis: {
          categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        }
      };
  
      var chart = new ApexCharts(document.querySelector("#averageDealSize-chart"), chartOptions);
      chart.render();
    }
  });

  // ajax fetch from api getsales and display conversion rate by mth
  $.ajax({
    url: "http://localhost:8080/getsales",
    method: "POST",
    dataType: "json",
    success: function(data) {
      var monthlyConversion = {};
      var monthlyDealCount = {};
      for (var i = 0; i < data.length; i++) {
        var sale = data[i];
        var saleMonth = new Date(sale.salesDate).getMonth();
        if (!monthlyDealCount[saleMonth]) {
          monthlyDealCount[saleMonth] = 0;
          monthlyConversion[saleMonth] = 0;
        }
        monthlyDealCount[saleMonth]++;
        if (sale.dealAmount > 0) {
          monthlyConversion[saleMonth]++;
        }
      }
      var chartData = [];
      for (var month in monthlyDealCount) {
        var conversionRate = monthlyConversion[month] / monthlyDealCount[month];
        chartData.push({
          x: month,
          y: conversionRate 
        });
      }
      var chartOptions = {
        series: [{
          name: "Conversion Rate",
          data: chartData
        }],
        chart: {
          height: 350,
          type: 'line'
        },
        xaxis: {
          categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        },
        yaxis: {
          tickAmount: 5,
          labels: {
            formatter: function (value) {
              return Math.round(value * 100) + '%';
            }
          }
        }
      };
      var chart = new ApexCharts(document.querySelector("#conversionRate-chart"), chartOptions);
      chart.render();
    }
  });

  // ajax fetch from api getsales and create salesperson performance table
  $.ajax({
    url: "http://localhost:8080/getsales",
    method: "POST",
    dataType: "json",
    success: function(data) {
      var salesPeople = {};
      for (var i = 0; i < data.length; i++) {
        var sale = data[i];
        var salesPerson = sale.salesPerson;
        if (!salesPeople[salesPerson]) {
          salesPeople[salesPerson] = {
            dealsClosed: 0,
            totalRevenue: 0,
            totalDealAmount: 0
          };
        }
        salesPeople[salesPerson].dealsClosed++;
        salesPeople[salesPerson].totalRevenue += sale.dealAmount;
        salesPeople[salesPerson].totalDealAmount += sale.dealAmount;
      }
      for (var salesPerson in salesPeople) {
        salesPeople[salesPerson].averageDealSize = salesPeople[salesPerson].totalDealAmount / salesPeople[salesPerson].dealsClosed;
      }
  
      var tableData = "";
      for (var salesPerson in salesPeople) {
        tableData += "<tr><td>" + salesPerson + "</td>";
        tableData += "<td>" + salesPeople[salesPerson].dealsClosed + "</td>";
        tableData += "<td>" + salesPeople[salesPerson].totalRevenue + "</td>";
        tableData += "<td>" + salesPeople[salesPerson].averageDealSize.toFixed(2) + "</td></tr>";
      }
      $('#sales-performance-table').html('<table class="table border border-secondary"><thead class="thead-dark"><tr><th>Name</th><th>Deals Closed</th><th>Total Revenue</th><th>Average Deal Size</th></tr></thead><tbody>' + tableData + '</tbody></table>');
    }
  });

  // save data from sales form and send params to addsales API with ajax
  $(function() {
    // Attach a submit event handler to the form
    $('#salesForm').submit(function(event) {
      // Prevent the default form submission behavior
      event.preventDefault();
  
      // Create a JavaScript object representing the sales form data
      var formData = {
        salesDate: $('#sales-date').val(),
        salesPerson: $('#sales-person').val(),
        productName: $('#product-name').val(),
        customerName: $('#customer-name').val(),
        dealAmount: parseFloat($('#deal-amount').val()),
        remarks: $('#remarks').val()
      };
  
      // Send an AJAX request to the API endpoint
      $.ajax({
        url: 'http://localhost:8080/addsales',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
          // Handle the successful response from the server
          console.log(response);
          alert('Sales data added successfully!');
          location.reload();
        },
        error: function(jqXHR, textStatus, errorThrown) {
          // Handle any errors that occurred during the request
          console.error(textStatus, errorThrown);
          alert('Error adding sales data!');
        }
      });
    });
  });
  
  