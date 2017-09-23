function sendEmails() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var startRow=2;
  var numRow=2;
  var dataRange=sheet.getRange(startRow,1,numRows,2);
  var data=dataRange.getValues();

  for (i in data){
    var row = data[i];
    var emailAddress=row[0];
    var message=row[1];
    var subject = "Sending emails from a Spreadshet";
    MailApp.sendEmail(recipient=emailAddress, subject=subject, body=message);
  }

}
