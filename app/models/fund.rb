# frozen_string_literal: true

class Fund < ApplicationRecord
  include SoftDeletable

  belongs_to :asset_house

  enum :fund_type, {
    misc: 0,
    savings: 1,
    current: 2,
    fixed: 3,
    recurring: 4,
    mutual_fund: 5
  }

  enum :subtype, {
    other: 0,
    hybrid: 1,
    elss: 2,
    debt: 3,
    equity: 4
  }

  enum :status, {
    active: 0,
    inactive: 1,
    suspended: 2
  }

  validates :name, :fund_type, :subtype, presence: true
end
