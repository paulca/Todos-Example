function JQueryHandleBarsTemplate(domElement, model, template, options) {
  if ((typeof template) == 'string') {
    this.templateString = this.santitizeTemplateString(template);
    template = Handlebars.compile(this.templateString);
  }
  this.template = template;
  this.options = options || {};
  this.domElement = domElement;
  this.model = model || this.domElement;

  var self = this;
  this.model.bind('changeData addData removeData', function(e) {
    self.render();
  });

  this.render();
}

JQueryHandleBarsTemplate.prototype.santitizeTemplateString = function(templateString) {
  try {
    var htmlifiedTemplateString = $(templateString);
    if (htmlifiedTemplateString.is('script')) {
      templateString = htmlifiedTemplateString.text().replace(/<\!\[CDATA\[/, '').replace(/\/\/\]\]>/, '');
    }
  } catch(err) {
    // This can happen when htmlifiedTemplateString is built and
    // templateString does not contain any <script> CDATA stuff
    // don't know how to handle/log this without catching it silently :/
  }
  
  return templateString;
};

JQueryHandleBarsTemplate.prototype.establishTemplate = function() {
  if (typeof this.compiledTemplate == 'undefined') {
    this.compiledTemplate = Handlebars.compile(this.templateString);
  }
  
  return this.compiledTemplate;
};

JQueryHandleBarsTemplate.prototype.renderSingle = function() {
  var rendering = $(this.template(this.model.data()));
  var model = this.model;
  rendering.find('*[data-bind]').each(function() {
    model.linkTo($(this));
  });
  if (this.options.replaceContainerElement) {
    this.domElement.replaceWith(rendering);
    this.domElement = rendering;
  } else {
    this.domElement.html(rendering);
  }
  this.domElement.data('_templateObject', this);
};

JQueryHandleBarsTemplate.prototype.renderCollection = function() {
  var result = $('<div/>');
  var template = this;
  
  var compiledTemplate = this.establishTemplate();
  
  this.domElement.removeTemplateBindings();
  $.each(this.model, function() {
    innerTemplate = JQueryHandleBarsTemplate.renderTemplate($('<div/>'), this, compiledTemplate, {replaceContainerElement: true});
    result.append(innerTemplate.domElement);
  });

  this.domElement.empty().append(result.children());
};

JQueryHandleBarsTemplate.prototype.render = function() {
  if (this.model instanceof Array) {
    this.renderCollection();
  } else {
    this.renderSingle();
  }
};

JQueryHandleBarsTemplate.renderTemplate = function(domElement, model, template, options) {
  return new JQueryHandleBarsTemplate(domElement, model, template, options);
};

(function($){
  $.fn.template = function(model, passedString) {
    var result = [];
    this.each(function() {
      var domElement = $(this);
      if (domElement.data('_templateObject')) {
        result.push(domElement.data('_templateObject'));
      } else {
        template = JQueryHandleBarsTemplate.renderTemplate(domElement, model,  passedString || domElement.data('template') || domElement.html());
        result.push(template);
      }
    });
    
    if (result.length < 2) {
      return result[0];
    }
    
    return result;
  };
  
  $.fn.removeTemplateBindings = function() {
    this.each(function() {
      $(this).children().each(function() {
        var element = $(this);
        var template = element.data('_templateObject');
        if (template) {
          template.model.unbind();
        }
        element.removeTemplateBindings();
      });
    });
  };
})(jQuery);