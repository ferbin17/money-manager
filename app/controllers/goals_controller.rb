# frozen_string_literal: true

class GoalsController < ApplicationController
  before_action :set_goal, only: %i[show edit update]

  def index
    @goals = Goal.all
  end

  def show; end

  def new
    @goal = Goal.new
  end

  def edit; end

  def create
    @goal = goal.new(goal_params)
    if @goal.save
      redirect_to @goal, notice: t("goals.created_successfully")
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @goal.update(goal_params)
      redirect_to @goal, notice: t("goals.updated_successfully")
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @goal.soft_delete
    redirect_to goals_path, notice: t("goals.destroyed_successfully")
  end

  private

  def set_goal
    @goal = Goal.find(params[:id])

    redirect_to goals_path, alert: t("goals.not_found") unless @fund
  end

  def goal_params
    params.require(:goal).permit(:name, :target_amount, :target_date)
  end
end
