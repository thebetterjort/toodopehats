var App = window.App = Skull.View.extend({
  el: 'html',

  events: {
    "click #close-global-alert" : "closeAlert",
    "click a#user-menu" : "toggleMenu",
    "click a.mobile-menu-link" : "mobileMenu",
    "click .zendesk_widget" : "showWidget",
    "click #pg_search_submit" : "searchProject"
  },

  openAlert: function(){
    if($('#global-alert').length === 0 || this.$('body').data('mobile')){
      return;
    };
    if(!window.store.get('globalClosed')){
      $('#global-alert').show();
      $('body').css('padding-top', '30px');
      $('#global-alert')
        .css('z-index', '100');
    }
    else{
      this.closeAlert();
    }
  },

  closeAlert: function(event){
    $('body').css('padding-top', '0');
    $('#global-alert').slideUp('slow');
    window.store.set('globalClosed', true);
  },

  searchProject: function(){
    this.$('.discover-form:visible').submit();
    return false;
  },

  beforeActivate: function(){
    this.$search = this.$('#pg_search');
    this.router = new Backbone.Router;
  },

  activate: function(){
    this.openAlert();
    this.$(".best_in_place").best_in_place();
    this.$dropdown = this.$('.dropdown-list.user-menu');
    this.flash();
    this.notices();
    Backbone.history.start({pushState: false});
    this.maskAllElements();
    this.applyErrors();
    this.loadGMaps();
  },

  flash: function() {
    var that = this;
    this.$flash = this.$('.flash');

    setTimeout( function(){ that.$flash.slideDown('slow') }, 100)
    if( ! this.$('.flash a').length) setTimeout( function(){ that.$flash.fadeOut('slow') }, 5000)
    $(window).click(function(){ that.$('.flash a').slideUp() })
  },

  notices: function() {
    var that = this;
    setTimeout( function(){ this.$('.notice-box').fadeIn('slow') }, 100)
    if(this.$('.notice-box').length) setTimeout( function(){ that.$('.notice-box').fadeOut('slow') }, 16000)
    $('.icon-close').on('click', function(){ that.$('.card-notification').fadeOut('slow') })
  },

  maskAllElements: function(){
    this.$('input[data-fixed-mask]').each(function(){
      $(this).fixedMask();
    });
  },

  showWidget: function(){
    Zenbox.show();
    return false;
  },

  toggleMenu: function(){
    this.$dropdown.toggleClass('w--open');
    return false;
  },

  applyErrors: function() {
    $.each($('[data-applyerror=true]'), function(i, item){
      $(item).addClass('error');
    })
  },

  loadGMaps: function() {
    var pings = [{
      'lat': 33.7950,
      'lang':  -122.4172
    },
      {
        'lat': 37.7250,
        'lang':  -122.4125
      },

    ]
    var mapOptions = {
      zoom: 13,
      center: new google.maps.LatLng(41.9630387,-91.6635387),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: false
    };
    var map = new google.maps.Map($("#map")[0], mapOptions)

    for (var i in pings) {
      var ping = pings[i];
      console.log(ping.lat + " - " + ping.lng);
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(ping.lat, ping.lng),
        title: ping.created_at
      });

      // To add the marker to the map, call setMap();
      marker.setMap(map);
    }
  }
});

$(function(){
  var app = window.app = new App();
});
