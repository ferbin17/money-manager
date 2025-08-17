# frozen_string_literal: true

class AssetHouse < ApplicationRecord
  include SoftDeletable

  attr_accessor :website, :contact_email, :contact_phone # TODO: Remove this once we have a proper form

  validates :name, presence: true, uniqueness: true

  has_many :funds, dependent: :destroy

  private

  def before_soft_delete_callback
    check_for_associated_funds
  end

  def check_for_associated_funds
    return if funds.active.empty?

    errors.add(:base, I18n.t('asset_houses.cannot_delete_with_funds'))
  end
end
