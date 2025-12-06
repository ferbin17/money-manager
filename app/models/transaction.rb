# frozen_string_literal: true

class Transaction < ApplicationRecord
  belongs_to :fund

  enum :transaction_type, {
    buy: 0,
    sell: 1,
    cancelled: 2,
    other: 3
  }, prefix: true

  validates :transaction_type, inclusion: { in: transaction_types.keys }
end
