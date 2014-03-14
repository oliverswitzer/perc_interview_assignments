class PagesController < ApplicationController

  def email_new

  end

  def email_create
    params[:email]
    params[:name]
  end

end
