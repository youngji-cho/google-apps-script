<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js">
</script>
<script>
  /**
   * On document load, assign click handlers to each button and try to load the
   * user's origin and destination language preferences if previously set.
   */
  $(function() {
    $('#run-translation').click(runTranslation);
    $('#insert-text').click(insertText);
    google.script.run.withSuccessHandler(loadPreferences)
        .withFailureHandler(showError).getPreferences();
  });
  /**
   * Callback function that populates the origin and destination selection
   * boxes with user preferences from the server.
   *
   * @param {Object} languagePrefs The saved origin and destination languages.
   */
  function loadPreferences(languagePrefs) {
    if (languagePrefs.originLang) {
      $('#origin').prop('selected', languagePrefs.originLang);
    }
    if (languagePrefs.destLang) {
      $('#dest').prop('selected', languagePrefs.destLang);
    }
  }
  /**
   * Runs a server-side function to translate the user-selected text and update
   * the sidebar UI with the resulting translation.
   */
  function runTranslation() {
    this.disabled = true;
    $('#error').remove();
    var origin = $('#origin').prop('selected');
    var dest = $('#dest').prop('selected');
    var savePrefs = $('#save-prefs').prop('checked');
    google.script.run
        .withSuccessHandler(
          function(translatedText, element) {
            $('#translated-text').val(translatedText);
            element.disabled = false;
          })
        .withFailureHandler(
          function(msg, element) {
            showError(msg, $('#button-bar'));
            element.disabled = false;
          })
        .withUserObject(this)
        .runTranslation(origin, dest, savePrefs);
  }
  /**
   * Runs a server-side function to insert the translated text into the document
   * at the user's cursor or selection.
   */
  function insertText() {
    this.disabled = true;
    $('#error').remove();
    google.script.run
        .withSuccessHandler(
          function(returnSuccess, element) {
            element.disabled = false;
          })
        .withFailureHandler(
          function(msg, element) {
            showError(msg, $('#button-bar'));
            element.disabled = false;
          })
        .withUserObject(this)
        .insertText($('#translated-text').val());
  }
  /**
   * Inserts a div that contains an error message after a given element.
   *
   * @param msg The error message to display.
   * @param element The element after which to display the error.
   */
  function showError(msg, element) {
    var div = $('<div id="error" class="error">' + msg + '</div>');
    $(element).after(div);
  }
</script>
