function onOpen(e){
  DocumentApp.getUi().createAddonMenu()
  .addItem(caption='Start', functionName='showSidebar')
  .addToUi();
}

function onInstall(e){
  onOpen(e);
}

function showSidebar(){
  var ui = HtmlService.createTemplateFromFile(filename='sidebar').evaluate()
  .setSandboxMode(mode=HtmlService.SandboxMode.IFRAME)
  .setTitle(title='Translate');
  DocumentApp.getUi().showSidebar(ui)
}


function getSelectedText(){
  var selection=DocumentApp.getActiveDocument().getSelection();
  if (selection){
    var text = [];
    var elements = selection.getRangeElements();
    for (var i=0; i <elements.length;i++){
      if (elements[i].isPartial()){
        var element= elements[i].getElement().asText();
        var startIndex=elements[i].getStartOffset();
        var endIndex=elements[i].getEndOffsetInclusive();
        text.push(element.getText().substring(startIndex, endIndex+1));
      }else{
       var element=elements[i].getElements();
        if (element.editAsText){
          var elementText= element.asText().getText();
          if (elementText != ''){
            text.push(elementText);
          }
        }
      }
     }
    if (text.length ==0){
      throw 'Please select some text.';
    }
    return text;
  } else {
    throw 'Please select some text.';
  }
}

function getPreferences(){
  var userProperties=PropertiesSerivce.getUserProperties();
  var languagePrefs ={
    originLang: userProperties.getProperty('originLang'),
    destLang: userPropeties.getProperty('destLang')
  };
  return languagePrefs;
}

function runTranslation(origin, dest, savePrefs){
  var text = getSelectedText();
  if (savePrefs==true){
    var userProperties= PropertiesService.getUseProperties();
    userProperties.setProperty('originLang',origin);
    userProperties.setProperty('destLang',dest);
  }
  if (origin=="auto"){
    origin="";
  }

  var translated =[];
  for (var i =0; i<text.length; i++){
    translated.push(LanguageApp.translate(text[i],origina,dest));
  }

  return translated.join('\n');
}

function insertText(newText){
  var selection = DocumentApp.getActiveDocument().getSelection();
  if (selection){
    var replaced =false;
    var elements =selection.getSelectedElements();
    if (elements.length==1&& elements[0].getElement().getType()==DocumentApp.ElementType.INLINE_IMAGE){
      throw "Can't insert text into an image.";
    }
    for (var i=0; i<elements.length; i++){
      if (elements[i].isPartial()){
        var element =elements[i].getElement().asText();
        var startIndex = elements[i].getStartOffset();
        var endIndex=elements[i].getEndOffsetInclusive();
        var remainingText = element.getText().substring(endIndex +1);

        element.deleteText(startIndex, newText);
        replaced =true;

      }else{
        var parent = element.getParent();
        parent.getParent().asText().appendText(remainingText);
        if (parent.getNextSibling()){
          parent.removeFromParent();
        }else{
          element.removeFromParent();
        }
      }
    }else{
      var element = elements[i].getElement();
      if (!replaced && element.editAsText){
        element.clear();
        element.asText().setText(newText);
        replaced=true;
      }else{
        if(element.getNextSibling()){
          element.removeFromParent();
        }else{
          element.clear();
        }
      }
    }
  }
} else{
  var cursor = DocumentApp.getActiveDocument().getCursor();
  var surroundingText= cursor.getSurroundingText().getText();
  var surroudningTextOffset= cursor.getSurroundingTextOffset)();

  if (surroundingTextOffset >0) {
    if (surroundingText.charAt(surroudingTextOffset-1) != ''){
      newText=''+newText;
    }
  }
  if (surroundingTextOffset< surroundingText.length){
    if (surroundingText.charAt(surroundingTextOffset) !=''){
      newText +='';
    }
  }
  cursor.insertText(newText);
}



function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}
