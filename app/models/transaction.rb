# frozen_string_literal: true

class Transaction < ApplicationRecord
  has_many :fund_transactions, dependent: :destroy
  has_many :funds, through: :fund_transactions
end
