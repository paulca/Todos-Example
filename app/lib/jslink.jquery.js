(function($){
  $.fn.linkTo = function(objects) {
    var self = $(this);
    var changeEvents = ['change'];
    var links = {};
    
    var writeValue = function(element, value) {
      if (element.is('input[type=checkbox]')) {
        element.attr('checked', value);
      } else {
        element.val(value);
      }
    };
    
    $.each(objects, function() {
      var element = $(this);
      var name = element.attr('name');
      links[name] = element;
      writeValue(element, self.data(name));
    });
    
    var suppressEvent = false;
    
    var elementToModel = function() {
      var element = $(this);
      var value;
      if (element.is('input[type=checkbox]')) {
        value = element.attr('checked');
      } else {
        value = element.val();
      }
      
      suppressEvent = true;
      self.data(element.attr('name'), value);
      suppressEvent = false;
    };
    
    var modelToElements = function(e, field, newValue) {
      var element = links[field];
      if (!suppressEvent && element) {
        writeValue(element, newValue);
      }
    };

    self.bind('changeData', modelToElements);
    objects.bind(changeEvents.join(' '), elementToModel);
  };
    
})(jQuery);