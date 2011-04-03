var i = 0;
function JQueryHandleBarsTemplate(domElement, model, templateString, options) {
  this.templateString = this.santitizeTemplateString(templateString);
  this.template = Handlebars.compile(this.templateString);
  this.options = options || {};
  this.domElement = domElement;
  this.model = model || this.domElement;
  
  this.model.bind('changeData addData removeData', function(e, f, v) {
    console.log([e,f,v]);
    template.render();
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
  $.each(this.model, function() {
    innerTemplate = JQueryHandleBarsTemplate.renderTemplate($('<div/>'), this, template.templateString);
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

JQueryHandleBarsTemplate.renderTemplate = function(domElement, model, templateString, options) {
  return new JQueryHandleBarsTemplate(domElement, model, templateString);
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
})(jQuery);