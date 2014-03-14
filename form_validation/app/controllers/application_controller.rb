class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def mail_chimp_key
    @keys ||= YAML::load_file("data/keys.yml")
    keys["MAILCHIMP"]
  end

  def gibbon
    gb = Gibbon::API.new(mail_chimp_key)
  end
end
