# frozen_string_literal: true

class FundTransaction < ApplicationRecord
  belongs_to :fund
  belongs_to :transaction
end
