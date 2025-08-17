# frozen_string_literal: true

class FundsController < ApplicationController
  before_action :set_fund, only: %i[show edit update]

  def index
    @funds = Fund.all
  end

  def show; end

  def new
    @fund = Fund.new
  end

  def edit; end

  def create
    @fund = Fund.new(fund_params)
    if @fund.save
      redirect_to @fund, notice: t('funds.created_successfully')
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @fund.update(fund_params)
      redirect_to @fund, notice: t('funds.updated_successfully')
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @fund.soft_delete
    redirect_to funds_path, notice: t('funds.destroyed_successfully')
  end

  private

  def set_fund
    @fund = Fund.find(params[:id])

    redirect_to funds_path, alert: t('funds.not_found') unless @fund
  end

  def fund_params
    params.require(:fund).permit(:name, :fund_type, :subtype, :status, :total_investment, :current_nav, :current_value,
                                 :asset_house_id)
  end
end
