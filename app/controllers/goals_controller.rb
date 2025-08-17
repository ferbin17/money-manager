# frozen_string_literal: true

class GoalsController < ApplicationController
  include ItemCrudable

  def show
    @goal = @item
  end

  private

  def item_type
    @item_type ||= "goal"
  end

  def goal_params
    params.require(:goal).permit(:name, :target_amount, :target_date)
  end
end
