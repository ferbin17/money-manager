# frozen_string_literal: true

class Fund < ApplicationRecord
  include SoftDeletable

  belongs_to :asset_house

  enum :fund_type, {
    misc: 0,
    savings: 1,
    current: 2,
    fixed: 3,
    recurring: 4
  }

  enum :subtype, {
    other: 0,
    hybrid: 1,
    elss: 2,
    debt: 3,
    equity: 4
  }

  validates :name, :fund_type, :subtype, presence: true

  before_save :set_nav_and_value

  private

  def set_nav_and_value
    self.total_investment = 0.0
    self.current_nav = 0.0
    self.current_value = 0.0
  end
end
