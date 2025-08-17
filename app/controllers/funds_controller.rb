# frozen_string_literal: true

class FundsController < ApplicationController
  include ItemCrudable

  private

  def item_type
    @item_type ||= "fund"
  end

  def fund_params
    params.require(:fund).permit(:name, :fund_type, :subtype, :status, :total_investment, :current_nav, :current_value,
                                 :asset_house_id)
  end
end
