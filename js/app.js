$(document).ready(function() {
	sSource = 'https://api.nextfarm.vn/api/crop/overview?cropid=1&fromdate=2019-01-01&todate=2019-01-31';
	loadAjaxTask(sSource);
	/**
	 * [loadAjaxTask gọi API và thực hiện in ra bảng dữ liệu]
	 * @param  {[type]} url [url]
	 * @return {[type]}     [none]
	 */
	function loadAjaxTask(url) {
		$.ajax({
	        url: url,
	        type: 'GET',
	        dataType: 'json',
	        headers: {
	        	'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvYXBpLm5leHRmYXJtLnZuXC9hcGlcL2F1dGhcL2xvZ2luIiwiaWF0IjoxNTYwODc4MTg5LCJleHAiOjE1NjA5MTQxODksIm5iZiI6MTU2MDg3ODE4OSwianRpIjoiOHdyaUxsaEpFUXN6N3dzTSIsInN1YiI6MjEsInBydiI6Ijk0ZGJkOTYxYWFlZjBlM2NlNjZhZDdkNTBlNjQ3NzE3NjA5ZGRhMjQifQ.0ECBsP64nU3KJ29mHa9D7q9C1L8x5ZIAyPv8mdHyJE4'
	       	},
	    })
		.done(function(response) {
	        // change title
	        $('#description').html('<i aria-hidden="true" class="far fa-check-circle"></i>' + response['0']['description']);
	        params = url.split('&');
	    	params = params[1].split('=');
	    	params = params[1].split('-');
	    	yearShow = params[0];
	    	monthShow = params[1];
	        allDay = getAllDayInMonth(monthShow, yearShow);
	        // lấy ra số lượng ngày trong tháng
	        countDay = allDay.length;
	        // change seasons
	        html = `<table class="table table-responsive">
						<thead>
							<tr class="select-month">
								<th rowspan="2" scope="col">#</th> 
								<th rowspan="2" scope="col">
									<input type="checkbox">
								</th> 
								<th rowspan="2" scope="col">Công việc</th> 
								<th rowspan="2" scope="col">Start</th> 
								<th rowspan="2" scope="col">Deadline</th> 
								<th rowspan="2" scope="col">Người làm</th> 
								<th colspan="31" style="text-align: center;">
									<i id="old-month" aria-hidden="true" class="fas fa-angle-left"></i> <span id="date">${monthShow}/${yearShow}</span> 
									<i id="new-month" aria-hidden="true" class="fas fa-angle-right"></i>
								</th>
							</tr> 
							<tr id="day">`;
			for (var i = 0; i < countDay; i++)
			{
				html += `<th scope="col" class="day">${allDay[i][0]}<br>${allDay[i][1]}</th> `;
			}
			html += `</tr></thead>`;
			for(var i = 0; i < response[0]['seasons'].length; i++) {
				html += `<tbody class="session">
							<tr data-toggle="collapse" data-target="#group-of-rows-${response[0]['seasons'][i]['id']}" aria-expanded="true" aria-controls="group-of-rows-1" class="clickable">
								<td colspan="37">
									<i aria-hidden="true" class="fa fa-plus"></i>
									${response[0]['seasons'][i]['name']}
								</td>
							</tr>
						</tbody>`;
				html += `<tbody id="group-of-rows-${response[0]['seasons'][i]['id']}" class="stage collapse show" style="">`;
				for (var j = 0; j < response[0]['seasons'][i]['tasks'].length; j++) {
					html += `<tr>`;
					html += `<td>${response[0]['seasons'][i]['tasks'][j]['id']}</td> 
							<td><input type="checkbox"></td> 
							<td>${response[0]['seasons'][i]['tasks'][j]['category_name']}</td> 
							<td>${formatDate(response[0]['seasons'][i]['tasks'][j]['start'])}</td> 
							<td>${formatDate(response[0]['seasons'][i]['tasks'][j]['end'])}</td> 
							<td>${response[0]['seasons'][i]['tasks'][j]['firstname']} ${response[0]['seasons'][i]['tasks'][j]['lastname']}</td>`;
					start = response[0]['seasons'][i]['tasks'][j]['start'];
					end = response[0]['seasons'][i]['tasks'][j]['end'];
					status = response[0]['seasons'][i]['tasks'][j]['priority'];
					html += printStatus(start, end, status);
				}
				html += `</tbody>`;
			}
			html += `</table>`;
	        $('#data').html(html).promise().done(function(){
				// xử lý khi chuyển tháng
				$('#old-month').click(function() {
					month = getMonthCurrent();
					year = getYearCurrent();
					if(month == 1) {
						month = 12;
						year--;
					} else {
						month--;
					}
					endDay = daysInMonth(month, year);
					baseUrl = 'https://api.nextfarm.vn/api/crop/overview?cropid=1';
					if(month < 10)
						month = '0' + month;
					start = 'fromdate=' + year + '-' + month + '-' + '01';
					end = 'todate=' + year + '-' + month + '-' + endDay;
					url = baseUrl + '&' + start + '&' + end;
					loadAjaxTask(url);
	        	});

			    $('#new-month').on('click', function() {
			    	month = getMonthCurrent();
					year = getYearCurrent();
					if(month == 12) {
						month = 1;
						year++;
					} else {
						month++;
					}
					endDay = daysInMonth(month, year);
					baseUrl = 'https://api.nextfarm.vn/api/crop/overview?cropid=1';
					if(month < 10)
						month = '0' + month;
					start = 'fromdate=' + year + '-' + month + '-' + '01';
					end = 'todate=' + year + '-' + month + '-' + endDay;
					url = baseUrl + '&' + start + '&' + end;
					loadAjaxTask(url);
			    });
			});
	    });
	}

	/**
	 * lấy ra số ngày trong 1 tháng
	 * @param  {int} month tháng
	 * @param  {int} year  năm
	 * @return {int}       số ngày
	 */
	function daysInMonth (month, year) {
	    return new Date(year, month, 0).getDate();
	}
	/**
     * Lấy tháng hiện tại
     * @return {[int]} [tháng]
     */
    function getMonthCurrent() {
    	date = $('#date').text();
    	params = date.split('/');
    	monthCurrent = parseInt(params[0]);
    	return monthCurrent;
    }
    /**
     * lấy năm hiện tại
     * @return {[int]} [năm]
     */
    function getYearCurrent() {
    	date = $('#date').text();
    	params = date.split('/');
    	yearCurrent = parseInt(params[1]);
    	return yearCurrent;
    }


	/**
	 * [printStatus in ra trạng thái]
	 * @param  {[type]} start  [ngày bắt đầu]
	 * @param  {[type]} end    [ngày kết thúc]
	 * @param  {[type]} status [trạng thái]
	 * @return {[type]}        [chuỗi html trạng thái]
	 */
    function printStatus(start, end, status) {
    	dayStart = getDay(start);
    	dayEnd = getDay(end);
    	monthStart = getMonth(start);
    	monthEnd = getMonth(end);
    	if(monthEnd > monthStart) {
    		dayEnd = countDay;
    	}
    	html = ``;
    	for(var i = 1; i <= countDay; i++) {
    		if((i >= dayStart && i <= dayEnd && monthStart == monthShow) || (i >= 1 && i <= getDay(end)) && monthStart == monthShow-1) {
		    	html += `<td class="${status}"></td>`;
    		} else {
    			html += `<td></td>`;
    		}
    	}
    	return html;
    }
    /**
     * [getDay lấy ra ngày]
     * @param  {[type]} date [chuỗi ngày tháng và giờ]
     * @return {[type]}      [ngày - int]
     */
    function getDay(date) {
    	params = date.split(' ');
    	params = params[0].split('-');
    	day = params[2];
    	return day;
    }
    /**
     * [getDay lấy ra tháng]
     * @param  {[type]} date [chuỗi ngày tháng và giờ]
     * @return {[type]}      [tháng - int]
     */
    function getMonth(date) {
    	params = date.split(' ');
    	params = params[0].split('-');
    	month = params[1];
    	return month;
    }
    /**
     * [getDay lấy ra name]
     * @param  {[type]} date [chuỗi ngày tháng và giờ]
     * @return {[type]}      [năm - int]
     */
    function getYear(date) {
    	params = date.split(' ');
    	params = params[0].split('-');
    	year = params[0];
    	return year;
    }
    /**
     * [formatDate thay đổi dịnh dạng in ra]
     * @param  {[type]} date [huỗi ngày tháng và giờ]
     * @return {[type]}      [định dạng in ra dạng dd/mm/yyyy]
     */
    function formatDate(date) {
    	day = getDay(date);
    	month = getMonth(date);
    	year = getYear(date);
    	return day + '/' + month + '/' + year;
    }
	/**
	 * [getAllDayInMonth lấy ra tất cả các ngày trong tháng]
	 * @param  {[type]} month [tháng]
	 * @param  {[type]} year  [năm]
	 * @return {[type]}       [mảng gổm các phần từ là mảng có 2 phần từ, phần tử đầu là thứ, phần tử thứ 2 là ngày]
	 */
    function getAllDayInMonth(month, year) {
    	month--;
    	var date = new Date(year, month, 1);
		var days = [];
		while (date.getMonth() === month) {
			days.push(new Date(date));
			date.setDate(date.getDate() + 1);
		}
		result = [];
		for(var i = 0; i < days.length; i++) {
			day = [];
			// lấy ra thứ
			// console.log(getNameDay(days[i].getDay()));
			day.push(getNameDay(days[i].getDay()));
			// lấy ra ngày
			// console.log(days[i].getDate());
			day.push(days[i].getDate());
			result.push(day);
		}
		return result;
    }
    /**
     * [getNameDay hàm lấy thứ trong tuần]
     * @param  {[type]} dayweek [ngày trong tuần bắt đầu từ 0 đến 6]
     * @return {[type]}         [tên ngày trong tuần bằng tiếng Anh với 2 ký tự đầu]
     */
    function getNameDay(dayweek) {
    	switch (dayweek) {
    		case 1:
    			return 'MO';
    			break;
    		case 2:
    			return 'TU';
    			break;
    		case 3:
    			return 'WE';
    			break;
    		case 4:
    			return 'TH';
    			break;
    		case 5:
    			return 'FR';
    			break;
    		case 6:
    			return 'SA';
    			break;
    		case 0:
    			return 'SU';
    			break;
    	}
    }

});