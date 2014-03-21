class PagesController < ApplicationController

  def email_new
    gibbon = MailChimp.new
  end

  def email_create
    gibbon = MailChimp.new
    gibbon.subscribe_member_to(ENV["MAILCHIMP_LIST"], "Oliver", "Switzer", params[:email])
  end

end
