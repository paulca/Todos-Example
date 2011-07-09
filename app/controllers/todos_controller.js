o_O('TodosController', {
  todos: o_O('TodosBucket'),
  
  index: function() {
    var self = this
    o_O.render('todos/layout', {}, {html: 'body'}, function() {
      o_O.bind_form(self.todos, Todo, '#new-todo')
      o_O.render('todos/stats', self.todos, '#stats')
      o_O.render('todos/todo', self.todos, '#todo-list', '<li/>')
    })
  },
  mark_all_done: function() {
    var todos = o_O('TodosController').todos
    var checked = $('.mark-all-done').attr('checked')
    
    todos.batch_operation(function(bucket) {
      bucket.each(function(el) {
        el('done', checked)
      })
    })
    
    return true;
  },
  clear_completed: function() {
    var todos = o_O('TodosController').todos
    todos.batch_operation(function(bucket) {
      bucket.remove(function(el) {
        return el('done')
      })
    })
  }
});