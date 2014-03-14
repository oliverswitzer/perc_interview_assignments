FormValidation::Application.routes.draw do

  get "/form", :to => "pages#email_new"
  post "/form-post", :to => "pages#email_create"
end
