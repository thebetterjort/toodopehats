App.addChild('Project', _.extend({
  el: 'body[data-action="show"][data-controller-name="projects"]',

  events: {
    'click #toggle_warning a' : 'toggleWarning',
    'click a#embed_link' : 'toggleEmbed'
  },

  activate: function(){
    this.$warning = this.$('#project_warning_text');
    this.$embed= this.$('#project_embed');
    this.route('about');
    this.route('posts');
    this.route('contributions');
    this.route('comments');
    this.route('edit');
    this.route('reports');
    this.route('metrics');
  },


