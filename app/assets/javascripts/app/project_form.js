App.addChild('ProjectForm', _.extend({
  el: 'form#project_form',

  events: {
    'blur input' : 'checkInput',
  },

  activate: function(){
    this.setupForm();
  }

}, Skull.Form));

// Put subview here to avoid dependency issues

App.views.ProjectForm.addChild('VideoUrl', _.extend({
  el: 'input#project_video_url',

  events: {
    'timedKeyup' : 'checkVideoUrl'
  },

  checkVideoUrl: function(){
    var that = this;
    $.get(this.$el.data('path') + '?url=' + encodeURIComponent(this.$el.val())).success(function(data){
      if(!data || !data.provider){
        that.$el.trigger('invalid');
      }
    });
  },

  activate: function(){
    this.setupTimedInput();
  }
}, Skull.TimedInput));

App.views.ProjectForm.addChild('Permalink', _.extend({
  el: 'input#project_permalink',

  events: {
    'timedKeyup' : 'checkPermalink'
  },

  checkPermalink: function(){
    var that = this;
    if(this.re.test(this.$el.val())){
      $.get('/pt/' + this.$el.val()).complete(function(data){
        if(data.status != 404){
          that.$el.trigger('invalid');
        }
      });
    }
  },

  activate: function(){
    this.re = new RegExp(this.$el.prop('pattern'));
    this.setupTimedInput();
  }
}, Skull.TimedInput));


var resizeableImage = function(image_target) {
  // Some variable and settings
  var $container,
  orig_src = new Image(),
  image_target = $(image_target).get(0),
  event_state = {},
  constrain = false,
  min_width = 60, // Change as required
  min_height = 60,
  max_width = 1800, // Change as required
  max_height = 1900,
  init_height=500,
  resize_canvas = document.createElement('canvas');
  imageData=null;

  init = function(){
  
  //load a file with html5 file api
  $('.js-loadfile').change(function(evt) {
    var files = evt.target.files; // FileList object
    var reader = new FileReader();

    reader.onload = function(e) {
      imageData=reader.result;
      loadData();
    }
    reader.readAsDataURL(files[0]);
  });
  
  //add the reset evewnthandler
  $('.js-reset').click(function() {
    if(imageData)
      loadData();
  });
  

    // When resizing, we will always use this copy of the original as the base
    orig_src.src=image_target.src;

    // Wrap the image with the container and add resize handles
    $(image_target).height(init_height)
  .wrap('<div class="resize-container"></div>')
    .before('<span class="resize-handle resize-handle-nw"></span>')
    .before('<span class="resize-handle resize-handle-ne"></span>')
    .after('<span class="resize-handle resize-handle-se"></span>')
    .after('<span class="resize-handle resize-handle-sw"></span>');

    // Assign the container to a variable
    $container =  $('.resize-container');

  $container.prepend('<div class="resize-container-ontop"></div>');
  
    // Add events
    $container.on('mousedown touchstart', '.resize-handle', startResize);
    $container.on('mousedown touchstart', '.resize-container-ontop', startMoving);
    $('.js-crop').on('click', crop);
  };
  
  loadData = function() {
      
  //set the image target
  image_target.src=imageData;
  orig_src.src=image_target.src;
  
  //set the image tot he init height
  $(image_target).css({
    width:'auto',
    height:init_height
  });
  
  
  //resize the canvas
  $(orig_src).bind('load',function() {
    resizeImageCanvas($(image_target).width(),$(image_target).height());
  });
  };
  
  startResize = function(e){
    e.preventDefault();
    e.stopPropagation();
    saveEventState(e);
    $(document).on('mousemove touchmove', resizing);
    $(document).on('mouseup touchend', endResize);
  };

  endResize = function(e){
  resizeImageCanvas($(image_target).width(), $(image_target).height())
    e.preventDefault();
    $(document).off('mouseup touchend', endResize);
    $(document).off('mousemove touchmove', resizing);
  };

  saveEventState = function(e){
    // Save the initial event details and container state
    event_state.container_width = $container.width();
    event_state.container_height = $container.height();
    event_state.container_left = $container.offset().left; 
    event_state.container_top = $container.offset().top;
    event_state.mouse_x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft(); 
    event_state.mouse_y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();
  
  // This is a fix for mobile safari
  // For some reason it does not allow a direct copy of the touches property
  if(typeof e.originalEvent.touches !== 'undefined'){
    event_state.touches = [];
    $.each(e.originalEvent.touches, function(i, ob){
      event_state.touches[i] = {};
      event_state.touches[i].clientX = 0+ob.clientX;
      event_state.touches[i].clientY = 0+ob.clientY;
    });
  }
    event_state.evnt = e;
  };

  resizing = function(e){
    var mouse={},width,height,left,top,offset=$container.offset();
    mouse.x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft(); 
    mouse.y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();
    
    // Position image differently depending on the corner dragged and constraints
    if( $(event_state.evnt.target).hasClass('resize-handle-se') ){
      width = mouse.x - event_state.container_left;
      height = mouse.y  - event_state.container_top;
      left = event_state.container_left;
      top = event_state.container_top;
    } else if($(event_state.evnt.target).hasClass('resize-handle-sw') ){
      width = event_state.container_width - (mouse.x - event_state.container_left);
      height = mouse.y  - event_state.container_top;
      left = mouse.x;
      top = event_state.container_top;
    } else if($(event_state.evnt.target).hasClass('resize-handle-nw') ){
      width = event_state.container_width - (mouse.x - event_state.container_left);
      height = event_state.container_height - (mouse.y - event_state.container_top);
      left = mouse.x;
      top = mouse.y;
      if(constrain || e.shiftKey){
        top = mouse.y - ((width / orig_src.width * orig_src.height) - height);
      }
    } else if($(event_state.evnt.target).hasClass('resize-handle-ne') ){
      width = mouse.x - event_state.container_left;
      height = event_state.container_height - (mouse.y - event_state.container_top);
      left = event_state.container_left;
      top = mouse.y;
      if(constrain || e.shiftKey){
        top = mouse.y - ((width / orig_src.width * orig_src.height) - height);
      }
    }
  
    // Optionally maintain aspect ratio
    if(constrain || e.shiftKey){
      height = width / orig_src.width * orig_src.height;
    }

    if(width > min_width && height > min_height && width < max_width && height < max_height){
      // To improve performance you might limit how often resizeImage() is called
      resizeImage(width, height);  
      // Without this Firefox will not re-calculate the the image dimensions until drag end
      $container.offset({'left': left, 'top': top});
    }
  }

  resizeImage = function(width, height){
  $(image_target).width(width).height(height);
  };
  
  resizeImageCanvas = function(width, height){
    resize_canvas.width = width;
    resize_canvas.height = height;
    resize_canvas.getContext('2d').drawImage(orig_src, 0, 0, width, height);   
    $(image_target).attr('src', resize_canvas.toDataURL("image/png"));  
  //$(image_target).width(width).height(height);
  };

  startMoving = function(e){
    e.preventDefault();
    e.stopPropagation();
    saveEventState(e);
    $(document).on('mousemove touchmove', moving);
    $(document).on('mouseup touchend', endMoving);
  };

  endMoving = function(e){
    e.preventDefault();
    $(document).off('mouseup touchend', endMoving);
    $(document).off('mousemove touchmove', moving);
  };

  moving = function(e){
    var  mouse={}, touches;
    e.preventDefault();
    e.stopPropagation();
    
    touches = e.originalEvent.touches;
    
    mouse.x = (e.clientX || e.pageX || touches[0].clientX) + $(window).scrollLeft(); 
    mouse.y = (e.clientY || e.pageY || touches[0].clientY) + $(window).scrollTop();
    $container.offset({
      'left': mouse.x - ( event_state.mouse_x - event_state.container_left ),
      'top': mouse.y - ( event_state.mouse_y - event_state.container_top ) 
    });
    // Watch for pinch zoom gesture while moving
    if(event_state.touches && event_state.touches.length > 1 && touches.length > 1){
      var width = event_state.container_width, height = event_state.container_height;
      var a = event_state.touches[0].clientX - event_state.touches[1].clientX;
      a = a * a; 
      var b = event_state.touches[0].clientY - event_state.touches[1].clientY;
      b = b * b; 
      var dist1 = Math.sqrt( a + b );
      
      a = e.originalEvent.touches[0].clientX - touches[1].clientX;
      a = a * a; 
      b = e.originalEvent.touches[0].clientY - touches[1].clientY;
      b = b * b; 
      var dist2 = Math.sqrt( a + b );

      var ratio = dist2 /dist1;

      width = width * ratio;
      height = height * ratio;
      // To improve performance you might limit how often resizeImage() is called
      resizeImage(width, height);
    }
  };

  crop = function(){
    //Find the part of the image that is inside the crop box
    var crop_canvas,
        left = $('.overlay').offset().left- $container.offset().left,
        top =  $('.overlay').offset().top - $container.offset().top,
        width = $('.overlay').width(),
        height = $('.overlay').height();
    
    crop_canvas = document.createElement('canvas');
  
    crop_canvas.width = width;
    crop_canvas.height = height;
  
    crop_canvas.getContext('2d').drawImage(image_target, left, top, width, height, 0, 0, width, height);
  var dataURL=crop_canvas.toDataURL("image/png");
  image_target.src=dataURL;
  orig_src.src=image_target.src;
  
  
  $(image_target).bind("load",function() {
    $(this).css({
      width:width,
      height:height
    }).unbind('load').parent().css({
      top:$('.overlay').offset().top- $('.crop-wrapper').offset().top,
      left:$('.overlay').offset().left- $('.crop-wrapper').offset().left
    })
  });
    //window.open(crop_canvas.toDataURL("image/png"));
  }

  init();
};

// Kick everything off with the target image
resizeableImage($('.resize-image'));
var select_item = '';
var select_price = '+0';
var price = 30;

var item_list = [];

var rectboxX = 130,
    rectboxY = 352,
    rectboxWidth = 215,
    rectboxHeight = 337;

function updatePrice(price_change) {
  var regExp = /(\=|\+|\-)(\d+)/;
  var result, result_sign, result_no;

  /* Use Regular Expression to decide input
     undefined = no change
     '=50' = equal 50 baht
     '+50' = add 50 baht
     '-50' = decrease 50 baht
  */
  if ((result = regExp.exec(price_change)) != null) {
      if (result.index === regExp.lastIndex) {
          regExp.lastIndex++;
      }
      result_sign = result[1];
      result_no = result[2];
  }
  
  if(!result_no) {
    
  } else if (result_sign == '=') {
    price = price_change;
  } else if (result_sign == '+') {
    price += price_change;
  } else if (result_sign == '-') {
    price -= price_change
  }
  
  /* Update Price */
  $('#price').html(price);
}

$(document).ready(function() {
  updatePrice();
  
  $('#boxEdit').show();
  $('#boxEditText, #boxEditImage').hide();
  
  $('.ui.accordion')
    .accordion()
  ;

  $('.ui.dropdown')
    .dropdown()
  ;
  
  $('#libraryButton').on('click', function() {
    select_item = '';
    $('.library.modal')
      .modal('show')
    ;
  });
  
  $('.library').find('.item').on('click', function() {
    $('.item').removeClass('active');
    select_item = $(this).find('img').attr('src');
    select_price = $(this).attr('data-price');
    $(this).addClass('active');
  });
  
  $('#libAddButton').on('click', function() {
    if(select_item === '') return;
    var imgObj = new Image();
    imgObj.src = select_item;
    imgObj.onload = function () {
        // start fabricJS stuff

        var image = new fabric.Image(imgObj);
        image.scale(0.5).set({
            left: 0,
            right: 0
        });
        //image.scale(getRandomNum(0.1, 0.25)).setCoords();
      
        image.on('selected', function() {
          var obJ = canvas.getActiveObject();

          $('#boxEdit, #boxEditText').hide();
          $('#boxEditImage').show();
        });
      
        image.itemPrice = select_price;
      
        item_list.push(image);
        canvas.setActiveObject(image).add(image);

        // end fabricJS stuff
      
        updatePrice(select_price);
    }
  });
  
  var canvas = this.__canvas = new fabric.Canvas('c');
  fabric.Object.prototype.transparentCorners = false;

  var radius = 300;

  fabric.Image.fromURL('https://gallery.mailchimp.com/2d721f842e76500384b0e243f/images/3a751f89-fe6e-407e-bcc0-7206bf922c84.jpg', function(img) {
    img.set({
      left: 0,
      top: 0,
      selectable: false,
      hasControls: false,
      hasBorders: false
    });
    canvas.add(img).setActiveObject(img);
    
    rectbox = new fabric.Rect({
      width: rectboxWidth,
      height: rectboxHeight,
      left: rectboxX,
      top: rectboxY,
      stroke: 'rgba(0,0,0,0.3)',
      strokeWidth: 2,
      fill: 'rgba(0,0,0,0)',
      selectable: false,
      hasControls: false,
      hasBorders: false
    });

    canvas.add(rectbox);
    
    var recttext = new fabric.Text('Printable Area', {
      fontSize: 14,
      fontFamily: 'sans-serif',
      left: 200,
      top: 330,
      fill: 'rgba(0,0,0,0.3)',
      selectable: false,
      hasControls: false,
      hasBorders: false
    });
    
    canvas.add(recttext);
    
    // Create Clip Area (Object created after this will be clipped)
/*    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.rect(rectboxX, rectboxY,rectboxWidth, rectboxHeight);
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
    ctx.stroke();
    ctx.clip();*/
    // END Clip Area
  });
  
  $('#addTextButton').on('click', function() {
    var inText = $('#inputText').val();
    
    if(inText.trim() === '') {
      alert('Please type text');
      return;
    }
    
    var inFont = $('#inputFont').val();
    var inSize = 14;
    var inColor = $('#inputColor').val();
    
    var newText = new fabric.Text(inText, {
      fontSize: inSize,
      fontFamily: inFont,
      fill: inColor
    });
    
    newText.on('selected', function() {
      var obJ = canvas.getActiveObject();
      
      // Update Edit Text
      $('#editText').val( obJ.text );
      $('#uiEditFont').dropdown( 'set selected', obJ.fontFamily );
      $('#uiEditFont').dropdown( 'set value', obJ.fontFamily );
      $('#uiEditColor').dropdown( 'set selected', obJ.fill );
      $('#uiEditColor').dropdown( 'set value', obJ.fill );
      
      $('#boxEdit, #boxEditImage').hide();
      $('#boxEditText').show();
    });
    
    canvas.setActiveObject(newText).add(newText);
    
    item_list.push(newText);
  });
  
  $('#updateTextButton').on('click', function() {
    var inText = $('#editText').val();
    
    if(inText.trim() === '') {
      $('.trashButton').trigger('click');
      return;
    }
    
    var inFont = $('#editFont').val();
    var inSize = 14;
    var inColor = $('#editColor').val();
    
    var TexttoEdit = canvas.getActiveObject();
    TexttoEdit.setText(inText)
    .setFontFamily(inFont)
    .setFontSize(inSize)
    .setFill(inColor);
    
    canvas.renderAll();
  });
  
  document.getElementById('imgLoader').onchange = function handleImage(e) {
    
    // Check for available file
    if ($('#imgLoader').val().length < 1) {
      // No file Uploaded
      console.log('No file uploaded');
      return false;
    }
    
    // Check file extensions
    var fileExt = $('#imgLoader').val().split('.').pop().toLowerCase();
    if($.inArray(fileExt, ['png','jpg','jpeg']) == -1) {
        alert('You cannot upload this file. Please upload only .png, .jpg, or .jpeg images.');
        $('#file').val("");
        return false;
    }
    
    var reader = new FileReader();
    reader.onload = function (event) {
        var imgObj = new Image();
        imgObj.src = event.target.result;
        imgObj.onload = function () {
            // start fabricJS stuff
            
            var image = new fabric.Image(imgObj);
            image.set({
                left: 0,
                right: 0
            });
          
            image.on('selected', function() {
              var obJ = canvas.getActiveObject();

              $('#boxEdit, #boxEditText').hide();
              $('#boxEditImage').show();
            });
          
            //image.scale(getRandomNum(0.1, 0.25)).setCoords();
            canvas.setActiveObject(image).add(image);
          
            item_list.push(image);
            
            // end fabricJS stuff
        }
        
    }
    reader.readAsDataURL(e.target.files[0]);
  }
  
  $('.trashButton').on('click', function() {
    $('#modalDelete').modal('setting', {
      onDeny    : function(){
      },
      onApprove : function() {
        var obJ = canvas.getActiveObject();
        
        // Remove from item_list
        var obJindex = item_list.indexOf(obJ);
        if (obJindex > -1) {
            item_list.splice(obJindex, 1);
        }
        
        // Remove from canvas
        obJ.remove();
        clearSelection();
      }
    }).modal('show');
    
    return false;
  });
  
  $('#resetButton').on('click', function() {
    var iLength = item_list.length;
    for (var i = 0; i < iLength; i++) {
        canvas.remove(item_list[i]);
    }
    item_list = [];
  });
  
  canvas.on('selection:cleared', function() {
    clearSelection();
  });
  
  function clearSelection() {
    $('#boxEditImage, #boxEditText').hide();
    $('#boxEdit').show();
  }
  
  $('#getdata-button').on('click', function() {
    alert( JSON.stringify(item_list) );
    for (i = 0; i < item_list.length; i++) { 
      var one_item = item_list[i];
      console.log(one_item, one_item.getLeft(), one_item.getTop());
    }

  });
  
});



