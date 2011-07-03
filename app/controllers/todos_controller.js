o_O('TodosController', {
  index: function() {
    var todos = o_O('TodosBucket')
    o_O.render('todos/layout', {}, {html: 'body'}, function() {
      o_O.bind_form(todos, Todo, '#new-todo')
      o_O.render('todos/todo', todos, '#todo-list', '<li/>')
    })
  }
});