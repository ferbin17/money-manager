# frozen_string_literal: true

class Goal < ApplicationRecord
  include SoftDeletable

  enum :status, {
    active: 0,
    inactive: 1
  }

  validate :name, presence: true
end
