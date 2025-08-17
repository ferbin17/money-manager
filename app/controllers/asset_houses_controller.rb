# frozen_string_literal: true

class AssetHousesController < ApplicationController
  before_action :set_asset_house, only: %i[show edit update destroy]

  def index
    @asset_houses = AssetHouse.all
  end

  def show; end

  def new
    @asset_house = AssetHouse.new
  end

  def edit; end

  def create
    @asset_house = AssetHouse.new(asset_house_params)
    if @asset_house.save
      redirect_to @asset_house, notice: t('asset_houses.created_successfully')
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @asset_house.update(asset_house_params)
      redirect_to @asset_house, notice: t('asset_houses.updated_successfully')
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @asset_house.soft_delete
    redirect_to asset_houses_path, notice: t('asset_houses.destroyed_successfully')
  end

  private

  def set_asset_house
    @asset_house = AssetHouse.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    redirect_to asset_houses_path, alert: t('asset_houses.not_found')
  end

  def asset_house_params
    params.require(:asset_house).permit(:name, :description, :website, :contact_email, :contact_phone)
  end
end
