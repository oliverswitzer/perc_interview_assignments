class PagesController < ApplicationController

  def email_new
  end

  def email_create
    begin
      name_array = params[:name].split(" ")
      name_array.each {|name| name.capitalize!}
      gibbon = MailChimp.new
      gibbon.subscribe_member_to(ENV["MAILCHIMP_LIST"], name_array[0], name_array[1], params[:email])
      redirect_to "/form", flash: { success: true}
    rescue Gibbon::MailChimpError
      redirect_to "/form", flash: { already_subscribed: "You have already been subscribed to the list" }
    end
  end

end
