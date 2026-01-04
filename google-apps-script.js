function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  try {
    var data = JSON.parse(e.postData.contents);
    
    // Expecting data structure:
    // {
    //   teamLead: { name, email, phone, muid },
    //   member2: { name, email, phone, muid },
    //   member3: { name, email, phone, muid },
    //   timestamp: "..."
    // }
    
    var row = [
      new Date(),
      data.teamLead.name,
      data.teamLead.email,
      data.teamLead.phone,
      data.teamLead.muid,
      data.member2.name,
      data.member2.email,
      data.member2.phone,
      data.member2.muid,
      data.member3.name,
      data.member3.email,
      data.member3.phone,
      data.member3.muid
    ];
    
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function setup() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var headers = [
    "Timestamp", 
    "Team Lead Name", "Team Lead Email", "Team Lead Phone", "Team Lead MuID",
    "Member 2 Name", "Member 2 Email", "Member 2 Phone", "Member 2 MuID",
    "Member 3 Name", "Member 3 Email", "Member 3 Phone", "Member 3 MuID"
  ];
  sheet.appendRow(headers);
}
