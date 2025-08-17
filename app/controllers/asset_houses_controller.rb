# frozen_string_literal: true

class AssetHousesController < ApplicationController
  include ItemCrudable

  def show
    @asset_house = @item
  end

  private

  def item_type
    @item_type ||= "asset_house"
  end

  def asset_house_params
    params.require(:asset_house).permit(:name, :description, :website, :contact_email, :contact_phone)
  end
end
