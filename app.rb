require 'rubygems'
require 'sinatra'

get '/' do
  File.read('todos.html').to_s
end
  

set :static, true
set :public, Proc.new { File.expand_path('.') }