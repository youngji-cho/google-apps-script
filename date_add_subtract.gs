var VALID_UNITS=['year','month','week','day','hour','minute','second','milisecond'];

function onInstall(){
  onOpen();
}

function onOpen(){
  SpreadsheetApp.getUi().createAddonMenu()
  .addItem(caption='Use in this spreadsheet', functionName='use')
  .addToUi();
}

function use(){
  var title ='Date Custom Functions';
  var message='The functions DATEADD and DATESUBTRACT are now available in' +
    'this spreadsheet. More information is available in the function help'+
    'box that appears when you start using them in a fomula.';
  var ui= SpreadsheetApp.getUi();
  ui.alert(title, message, ui.ButtonSet.OK);
}

function DATEADD(date,unit, amount){
  var args=toArray(arguments);
  return multimap(args, function(date,unit,amount){
    validateParmeters(date, unit, amount);
    return moment(date).add(unit,amount).toDate();
  });
}

function DATETEST(date,unit,amounts){
  return JSON.stringify(DATEADD(date,unit,amount));
}

function DATESUBTRACT(date,unit,amount){
  var args = toArray(arguments);
  return multimap(args, function(date,unit,amount){
    validateParamters(date,unit,amount);
    return moment(date).subtract(unit,amount).toDate();
  });
}

function validateParameters(date,unit, amount){
  if (date == undefined || typeof date == 'number' || !moment(date).isValid()){
    throw Utilities.formatString('Parameter 1 expects a date value, but "%s" ' +
        'cannot be coerced to a date.', date);
  }
  if (VALID_UNITS.indexof(moment.normalizeUnits(unit))<0){
    throw Utilities.formatString('Parameter 2 expects a unit identifier, but ' +
        '"%s" is not a valid identifier.', unit);
  }
  if (isNaN(Number(amount))){
    throw Utilities.formatString('Parameter 3 expects a number value, but ' +
        '"%s" cannot be coerced to a number.', amount);
  }
}


function multimap(){
  var lengths = args.map(function(arg){
    if (arg instanceof Array){
      return arg.length;
    }else{
     return 0;
    }
  });
  var max= Math.max.apply(null, lengths);

  if (max ==0){
    return func.apply(null, args);
  }

  lengths.forEach(function(length){
    if (length != max && length>1){
      throw 'All input ranges must be the same size:'+max;
    }
  });

    var result = []
  for (var i = 0; i < max; i++) {
    var params = args.map(function(arg) {
      if (arg instanceof Array) {
        return arg.length == 1 ? arg[0] : arg[i];
      } else {
        return arg;
      }
    });
    result.push(multimap(params, func));
  }
  return result;
}


function toArray(args) {
  return Array.prototype.slice.call(args);
}
