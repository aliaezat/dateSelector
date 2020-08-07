# dateSelector

A simple light weight plugin to select date. The plugin has 2 modes for navigating dates: by week or month.

![Demo Image](/demo/images/dateSelectorDemoImage.png)

## Dependencies

- jQuery
- momentjs
- material.io icons

## Getting Started

Include jQuery, momentjs, material icons font and dateSelector files in your html.

```html
<head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <link type="text/css" href="css/dateSelector.min.css" rel="stylesheet" />
        
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script type="text/javascript" src="js/moment.min.js"></script>
        <script type="text/javascript" src="js/dateSelector.min.js"></script>                
</head>
```

Add a div element to your html

```html
<div id="example"></div>
```

Attach the dateSelector plugin to the element you want to convert into a dateSelector and do something with the date the user selects

```javascript
$('#example').dateSelector({
    onDateSelected: function(args){
        var date = args.date;
        alert(date.format());     
    }
});
```

## Examples

### Navigate Weeks

```javascript
$('#example').dateSelector({
    mode: "week",
    weekStart: "SAT",
    onDateSelected: function(args){
        var date = args.date;
        alert(date.format());     
    }
});
```


### Navigate Months

```javascript
$('#example').dateSelector({
    mode: "month",
    onDateSelected: function(args){
        var date = args.date;
        alert(date.format());     
    }
});
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| date |moment object, date object, or date string | current date | The currently selected date. |
| mode | string ("week" or "month") | week | Navigation interval. |
| weekStart | string ("MON", "TUE", "WED", "THU", "FRI", "SAT", or "SUN") | MON | The start day of the week. Only needed in the week view. |
| onDateSelected | function | - | The callback function to be executed when the user selects a date. |