FormValidation::Application.routes.draw do

  root :to => "pages#email_new"
  post "/form-post", :to => "pages#email_create"
end
