var data=[],markup='',model_name='General Text Suggestions'

$("body")
.on("click", '[name="tab-select"]', function (e) {
  e.stopPropagation();
  if (!$(this).hasClass("active")) {
    $(this).toggleClass("active").siblings().not(this).removeClass("active");
  }
})
.on("click", ".preview-selected-documents", function (e) {
  let selected_suggestion = this.attributes["data-slected-class"]["value"];
  $(".preview-selected-documents").removeClass("selected");
  $(
    `.preview-selected-documents[data-slected-class='${selected_suggestion}']`
  ).toggleClass("selected");
  $('.suggested_text').text(selected_suggestion)
})
.on("click", '#btn_gts', function (e) {
  model_name='General Text Suggestions'
})
.on("click", '#btn_cts', function (e) {
  model_name='Clinical Text Suggestions'
});


function update_html(html_content, container, _url = "") {
  $(container).html(html_content);
}

function preview_page_content(current_data) {
  $.get("/extracted_data?modal_name="+model_name+"&current_data="+current_data, function (data) {
    console.log('data',data)
    data = data["data"];
      modal_content = `<div class="entity-block">`;
      for (let doc = 0; doc < data.length; doc++) {
        if (doc == 0) {
          modal_content =
            modal_content +
            `<div class="card preview-selected-documents selected" data-slected-class="${data[doc]}">`;
            markup=`&nbsp<span class='suggested_text'>${data[doc]}</span>`
            // event_.target.innerHTML = markup;
            $('#text_area_input').append(markup)
          } else {
          modal_content =
            modal_content +
            `<div class="card preview-selected-documents" data-slected-class="${data[doc]}">`;
        }
        modal_content =
          modal_content +
          `<p class='entity-text-preview' >${data[doc]}</p>
              </div>`;
      }
      modal_content = modal_content + `</div>`;
      update_html(modal_content, ".entity-container");
  
  });
}

var typingTimer;                //timer identifier
var doneTypingInterval = 2000;  //time in ms, 2 seconds for example
var text_box = $('#text_area_input');

//on keyup, start the countdown
text_box.on('keyup', function () {
  var editableDiv = document.getElementById("text_area_input");
  cursorManager.setEndOfContenteditable(editableDiv);
  clearTimeout(typingTimer);
  typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

//on keydown, clear the countdown 
text_box.on('keydown', function (event) {
  clearTimeout(typingTimer);
  var name = event.key;
    // Alert the key name and key code on keydown
    if(name=='Tab'|| name=='ArrowRight'){
      chunks = event.target.innerText;
      event.target.innerText=chunks
      $('.suggested_text').text(' ')
      update_html('', ".entity-container");
      event.preventDefault();
    
    }
    // if(name=='Backspace'){
    //   $('.suggested_text').text(' ')
    //   update_html('', ".entity-container");
    // }
    else{
      $('.suggested_text').text(' ')
      update_html('', ".entity-container");
    }

});

//user is "finished typing," do something
function doneTyping () {

  var sug_txt=$('.suggested_text').text(),
  act_text=$('#text_area_input').text();

  if(sug_txt=='' && act_text.trim()!=''){
    
    chunks = $('#text_area_input').text();
    preview_page_content(chunks)
  }


}

// prevents default tab function for entire page
document.addEventListener('keydown', (event) => {
    var name = event.key;
    if(name=='Tab'){
      event.preventDefault();
    }
  }, false);
  

$(() => {
    $("#btn_gts").trigger("click")
    $("#btn_gts").addClass("active")
    var editableDiv = document.getElementById("text_area_input");
    cursorManager.setEndOfContenteditable(editableDiv);
  })



//move cursor to end
$(function( cursorManager ) {

  //From: http://www.w3.org/TR/html-markup/syntax.html#syntax-elements
  var voidNodeTags = ['AREA', 'BASE', 'BR', 'COL', 'EMBED', 'HR', 'IMG', 'INPUT', 'KEYGEN', 'LINK', 'MENUITEM', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR', 'BASEFONT', 'BGSOUND', 'FRAME', 'ISINDEX'];

  //From: https://stackoverflow.com/questions/237104/array-containsobj-in-javascript
  Array.prototype.contains = function(obj) {
      var i = this.length;
      while (i--) {
          if (this[i] === obj) {
              return true;
          }
      }
      return false;
  }

  //Basic idea from: https://stackoverflow.com/questions/19790442/test-if-an-element-can-contain-text
  function canContainText(node) {
      if(node.nodeType == 1) { //is an element node
          return !voidNodeTags.contains(node.nodeName);
      } else { //is not an element node
          return false;
      }
  };

  function getLastChildElement(el){
      var lc = el.lastChild;
      while(lc && lc.nodeType != 1) {
          if(lc.previousSibling)
              lc = lc.previousSibling;
          else
              break;
      }
      return lc;
  }

  //Based on Nico Burns's answer
  cursorManager.setEndOfContenteditable = function(contentEditableElement)
  {

      while(getLastChildElement(contentEditableElement) &&
            canContainText(getLastChildElement(contentEditableElement))) {
          contentEditableElement = getLastChildElement(contentEditableElement);
      }

      var range,selection;
      if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
      {    
          range = document.createRange();//Create a range (a range is a like the selection but invisible)
          range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
          range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
          selection = window.getSelection();//get the selection object (allows you to change selection)
          selection.removeAllRanges();//remove any selections already made
          selection.addRange(range);//make the range you have just created the visible selection
      }
      else if(document.selection)//IE 8 and lower
      { 
          range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
          range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
          range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
          range.select();//Select the range (make it the visible selection
      }
  }

}( window.cursorManager = window.cursorManager || {}));

