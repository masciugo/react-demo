namespace :db do
  desc 'pupulate db with fakes'
  task populate: :environment do
    require 'faker'

    Comment.destroy_all

    10.times do
      Comment.create(
        author: Faker::Name.first_name + " " + Faker::Name.last_name,
        comment: Faker::Lorem.words(10).join(' ')
      )
    end
  end
end