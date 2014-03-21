class PagesController < ApplicationController

  def email_new
    puts Dir.pwd
    gibbon = MailChimp.new
    puts gibbon.members_of("8afaedfb04")
  end

  def email_create
    gibbon = MailChimp.new
    puts gibbon.members_of("8afaedfb04")
    params[:email]
    params[:name]
  end

end
