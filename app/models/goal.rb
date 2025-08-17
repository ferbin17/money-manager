# frozen_string_literal: true

class Goal < ApplicationRecord
  include SoftDeletable

  enum :status, {
    active: 0,
    inactive: 1
  }

  validates :name, presence: true
  validate :target_date_must_be_future, if: :target_date

  private

  def target_date_must_be_future
    errors.add(:target_date, "must be after today") if target_date <= Time.zone.today
  end
end
