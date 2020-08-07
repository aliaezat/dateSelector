(function ($) {    
    const PLUGIN_PREFIX = 'ds_';
    const DB_DATE_FORMAT = 'YYYY-MM-DD';

    var _plugin_count = 0;

    var dateSelector = function (element, options, plugin_count) {
        var instance = this;

        // These are the default settings.
        instance.settings = {
            date: moment(),
            mode: "weekly", //or "monthly"  
            weekStart: "MON",            
            onDateSelected: null                      
        };

        instance.plugin_count = plugin_count;
        instance.prefix = PLUGIN_PREFIX + plugin_count + '_';
        instance.wrapperId = instance.prefix + "wrapper";
        instance.control = null;
        instance.container = $(element);
        
        instance.dayClassName = PLUGIN_PREFIX + 'day';        
        instance.dayNameClassName = PLUGIN_PREFIX + 'dayName';
        instance.dayNumberClassName = PLUGIN_PREFIX + 'dayNumber';

        instance.initialize(options);
        instance.build();
    };

    dateSelector.prototype = {
        constructor: dateSelector,

        initialize: function (options) {
            var instance = this;

            instance.settings = $.extend(true, {}, instance.settings, options);
            
            instance.selectedDate = moment(instance.settings.date);    
            instance.range = instance.getRange();        
        },

        build: function () {
            var instance = this;

            instance.construct();
            instance.createEvents();
        },

        construct: function () {
            var instance = this;
            
            instance.constructControl();
            instance.updateDisplay();
        },

        constructControl: function () {
            var instance = this;
            
            instance.control = $('<div id="' + instance.wrapperId + '" class="' + PLUGIN_PREFIX + 'wrapper"></div>');
            instance.container.append(instance.control);            
            
            instance.title = $('<div class="' + PLUGIN_PREFIX + 'title"></div>');
            instance.control.append(instance.title);

            instance.navigation = $('<div class="' + PLUGIN_PREFIX + 'navigation"></div>');
            instance.control.append(instance.navigation);

            instance.leftNavigation = $('<div class="' + PLUGIN_PREFIX + 'leftNavigation"></div>');
            instance.leftNavigation.append('<a href="javascript:void(0);"><i class="material-icons">keyboard_arrow_left</i></a>');
            instance.navigation.append(instance.leftNavigation);

            instance.days = $('<div class="' + PLUGIN_PREFIX + 'days"></div>');
            instance.navigation.append(instance.days);

            instance.rightNavigation = $('<div class="' + PLUGIN_PREFIX + 'rightNavigation"></div>');
            instance.rightNavigation.append('<a href="javascript:void(0);"><i class="material-icons">keyboard_arrow_right</i></a>');
            instance.navigation.append(instance.rightNavigation);
        },

        updateDisplay: function(){
            var instance = this;

            instance.displayTitle();
            instance.displayDays();
        },

        displayDays: function(){
            var instance = this;
            
            var range = instance.range;
            var daysCount = range.end.diff(range.start, 'days') + 1;
            var dayWidthPercentage = (100.0 / daysCount).toFixed(2);
            
            var divWidth = instance.navigation.width() - instance.leftNavigation.width() - instance.rightNavigation.width();
            instance.days.width(divWidth);            
            instance.days.html('');

            var appendDaySection = function(date, text, container, className){
                var div = $('<div></div>');                
                div.addClass(className);                         

                var anchor = $('<a href="javascript:void(0);"></a>');                                                        
                anchor.html(text);
                div.append(anchor);

                container.append(div);
            }

            for(i = moment(range.start); i <= range.end; i.add('days', 1)){
                var selected = false;
                if(i.format(DB_DATE_FORMAT) === instance.selectedDate.format(DB_DATE_FORMAT)){
                    selected = true;
                }

                var div = $('<div class="' + instance.dayClassName + '"></div>');
                div.data('date', i.format(DB_DATE_FORMAT));
                div.css('width', dayWidthPercentage + '%');
                if(selected){
                    div.addClass('selected');
                }

                appendDaySection(i,i.format('ddd'),div,instance.dayNameClassName);
                appendDaySection(i,i.format('D'),div,instance.dayNumberClassName);

                instance.days.append(div);
            }
        },

        displayTitle: function(){
            var instance = this;

            var period = instance.GetPeriodText();
            instance.title.html(period);
        },

        getRange: function(day){
            var instance = this;

            if(!day){
                day = moment(instance.selectedDate);
            }

            var weekStart = instance.settings.weekStart;
            var rangeStart = null;
            var rangeEnd = null;

            if(instance.settings.mode === 'month'){
                rangeStart = moment(day).startOf('month');
                rangeEnd = moment(day).endOf('month');
            } else {
                rangeStart = instance.getStartOfWeek(day, weekStart);
                rangeEnd = moment(rangeStart).add('days', 6);
            }  
            
            return {
                start: rangeStart,
                end: rangeEnd
            }
        },

        getStartOfWeek: function(momentDate, weekStart) {
            var weekStartNums = {
                'SUN': 1,
                'MON': 2,
                'TUE': 3,
                'WED': 4,
                'THU': 5,
                'FRI': 6,
                'SAT': 7
            };
        
            var defaultWeekStart = 'MON';
            if (!weekStart) {
                weekStart = defaultWeekStart;
            } else {
                weekStart = weekStart.toUpperCase();
                if(weekStart.length > 3){
                    weekStart = weekStart.substring(0, 3);
                }
            }
        
            if(!weekStartNums[weekStart]){
                weekStart = defaultWeekStart;
            }            
            
            var dateObj = momentDate.toDate()
            var dayNum = dateObj.getDay() + 1;
        
            var diff = weekStartNums[weekStart] - dayNum;
        
            if (weekStartNums[weekStart] > dayNum) {
                diff = diff - 7;
            }
        
            var startOfWeekDate = new Date(dateObj.setDate(dateObj.getDate() + diff));
            return moment(startOfWeekDate);
        },
        

        createEvents: function () {
            var instance = this;

            instance.leftNavigation.click(function(){
                instance.navigateLeft();
            });

            instance.rightNavigation.click(function(){
                instance.navigateRight();
            });

            instance.control.on('click', '.' + instance.dayClassName, function(){
                var element = $(this);
                instance.onDateSelected(element);
            })
        },

        onDateSelected: function(element){
            var instance = this;

            var allDaysElements = instance.control.find('.' + instance.dayClassName);

            var date = moment(element.data('date'));
            var args = {
                date: date,
                trigger: element
            };

            allDaysElements.removeClass('selected');
            element.addClass('selected');

            if(instance.settings.onDateSelected){
                instance.settings.onDateSelected(args);
            }
        },

        navigateLeft: function(){
            var instance = this;
            
            var currentRangeStart = instance.range.start;
            currentRangeStart = moment(currentRangeStart);

            var dateInNewRange = currentRangeStart.add('days', -1);

            instance.range = instance.getRange(dateInNewRange);
            instance.updateDisplay();
        },
                
        navigateRight: function(){
            var instance = this;

            var currentRangeEnd = instance.range.end;
            currentRangeEnd = moment(currentRangeEnd);
            var dateInNewRange = currentRangeEnd.add('days', 1);

            instance.range = instance.getRange(dateInNewRange);
            instance.updateDisplay();
        },

        GetPeriodText: function() {
            var instance = this;
            
            var text = '';
            var range = instance.range;
            var startDate = range.start;
            var endDate = range.end;
        
            if (startDate.format('YYYY-MM-DD') == endDate.format('YYYY-MM-DD')) {
                text = startDate.format('D MMM YYYY');
            } else if (startDate.year() != endDate.year()) {
                text = startDate.format('D MMM YYYY') + " - " + endDate.format('D MMM YYYY');
            } else if (startDate.month() != endDate.month()) {
                text = startDate.format('D MMM') + " - " + endDate.format('D MMM YYYY');
            } else if (startDate.month() === endDate.month()) {
                text = startDate.format('MMMM YYYY');
            } else {
                text = startDate.format('D') + " - " + endDate.format('D MMM YYYY');
            }
        
            return text;
        }

    };


    $.fn.dateSelector = function (options, args) {
        var instance = this.data('dateSelector');
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!instance) {
                    $.data(this, "dateSelector", new dateSelector(this, options, _plugin_count++));
                }
            });
        }    
    else if (typeof options === 'string') {            
        if (options === 'get') {
            return instance.selectedDate;
        } else if (options === 'set') {
            instance.selectedDate = args;
            instance.updateDisplay();
        }            
    }    
        return this;
    };

}(jQuery));