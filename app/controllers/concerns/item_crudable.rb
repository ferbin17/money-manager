# frozen_string_literal: true

module ItemCrudable
  extend ActiveSupport::Concern

  included do
    before_action :set_item, only: %i[show edit update destroy]
  end

  def index
    @items = item_class.all

    render "layouts/pages/index", locals: item_locals
  end

  def show; end

  def new
    @item = item_class.new

    render "layouts/pages/new", locals: item_locals
  end

  def edit
    render "layouts/pages/edit", locals: item_locals
  end

  def create
    @item = item_class.new(item_params)

    if @item.save
      redirect_to @item, notice: t("#{item_type}s.created_successfully")
    else
      render "layouts/pages/new", locals: item_locals, status: :unprocessable_entity
    end
  end

  def update
    if @item.update(item_params)
      redirect_to @item, notice: t("#{item_type}s.updated_successfully")
    else
      render "layouts/pages/edit", locals: item_locals, status: :unprocessable_entity
    end
  end

  def destroy
    @item.soft_delete

    redirect_to send("#{item_type}s_path"), notice: t("#{item_type}s.destroyed_successfully")
  end

  private

  def set_item
    @item = item_class.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    redirect_to send("#{item_type}s_path"), alert: t("#{item_type}s.not_found")
  end

  def item_locals
    { items: @items, item: @item, item_type: item_type }
  end

  def item_class
    item_type.classify.constantize
  end

  def item_params
    send("#{item_type}_params")
  end

  def item_type; end
end
