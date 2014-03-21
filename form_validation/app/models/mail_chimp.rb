require 'yaml'

class MailChimp


  def initialize
    @gb = Gibbon::API.new(ENV["MAILCHIMP"])
    @gb.timeout ||= 15
  end

  def set_timeout(timeout)
    @gb.timeout = timeout
  end

  def members_of(list_id)
    @gb.lists.members({:id => list_id})
  end

  def subscribe_member_to(list_id, first, last, email)
    @gb.lists.subscribe({:id => list_id, :email => {:email => email}, :merge_vars => {:FNAME => first, :LNAME => last}, :double_optin => false})
  end


end