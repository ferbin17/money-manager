# frozen_string_literal: true

class AssetHousesController < ApplicationController
  include ItemCrudable

  private

  def set_item
    @item = item_class.includes(:funds).find(params[:id])
  rescue ActiveRecord::RecordNotFound
    redirect_to send("#{item_type}s_path"), alert: t("#{item_type}s.not_found")
  end

  def item_type
    @item_type ||= "asset_house"
  end

  def asset_house_params
    params.require(:asset_house).permit(:name, :description, :website, :contact_email, :contact_phone)
  end
end
